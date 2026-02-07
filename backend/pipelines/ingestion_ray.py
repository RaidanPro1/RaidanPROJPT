# backend/pipelines/ingestion_ray.py
# The data ingestion muscle, using Ray for parallel processing.
# Author: Lead AI Architect, RaidanPro OS (v4.5)

import os
import ray
from minio import Minio
from unstructured.partition.pdf import partition_pdf
from neo4j import GraphDatabase
from qdrant_client import QdrantClient, models
from ollama import Client as OllamaClient
from typing import List, Dict

# --- Configuration (assumes running within Docker network) ---
MINIO_ENDPOINT = "minio:9000"
MINIO_ACCESS_KEY = "raidan_root"
MINIO_SECRET_KEY = "sovereign_password"
MINIO_BUCKET = "documents" # Bucket for PDFs

NEO4J_URI = "bolt://neo4j:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "sovereign_password"

QDRANT_HOST = "qdrant"
QDRANT_PORT = 6333
QDRANT_COLLECTION = "raidan_docs"

OLLAMA_HOST_FOR_RAY = "ollama:11434" # Docker service name

# --- Ray Actors for Parallelism ---

@ray.remote
class PDFProcessor:
    """Actor to extract text from a single PDF file."""
    def process(self, minio_client: Minio, object_name: str) -> str:
        try:
            response = minio_client.get_object(MINIO_BUCKET, object_name)
            with open(object_name, "wb") as file_data:
                file_data.write(response.read())
            
            elements = partition_pdf(filename=object_name)
            text = "\n\n".join([str(el) for el in elements])
            os.remove(object_name) # Clean up temp file
            print(f"   [Ray-PDF] Processed {object_name}")
            return text
        except Exception as e:
            print(f"   [Ray-PDF] Error processing {object_name}: {e}")
            return ""

@ray.remote
class EntityExtractor:
    """Actor to extract entities from text using Ollama."""
    def __init__(self):
        # Each actor gets its own Ollama client
        self.ollama = OllamaClient(host=OLLAMA_HOST_FOR_RAY)
    
    def extract(self, text: str) -> List[Dict]:
        if not text:
            return []
        
        prompt = f"""
        Extract named entities (Person, Organization, Location) from the following text.
        Output a JSON array of objects, each with "name" and "type" keys.
        Text: "{text[:2000]}"
        """
        try:
            response = self.ollama.chat(
                model='qwen2.5-sovereign',
                messages=[{'role': 'user', 'content': prompt}],
                format='json'
            )
            entities = response['message']['content']
            print(f"   [Ray-Entity] Extracted {len(entities)} entities.")
            return entities
        except Exception as e:
            print(f"   [Ray-Entity] Error during extraction: {e}")
            return []

@ray.remote
class Neo4jIngestor:
    """Actor to ingest entities into the Neo4j graph database."""
    def __init__(self):
        self.driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

    def ingest(self, entities: List[Dict]):
        if not entities:
            return
            
        with self.driver.session() as session:
            for entity in entities:
                # Use MERGE to avoid duplicate nodes
                session.run(
                    f"MERGE (n:{entity['type']} {{name: $name}})",
                    name=entity['name']
                )
        print(f"   [Ray-Neo4j] Ingested {len(entities)} entities.")
        
    def close(self):
        self.driver.close()

@ray.remote
class QdrantIngestor:
    """Actor to create embeddings and ingest document chunks into Qdrant."""
    def __init__(self):
        self.qdrant = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)
        self.ollama_embed = OllamaClient(host=OLLAMA_HOST_FOR_RAY)
        
        # Ensure collection exists
        try:
            self.qdrant.get_collection(collection_name=QDRANT_COLLECTION)
        except Exception:
            self.qdrant.recreate_collection(
                collection_name=QDRANT_COLLECTION,
                vectors_config=models.VectorParams(size=1024, distance=models.Distance.COSINE), # nomic-embed-text size
            )

    def ingest(self, doc_text: str, doc_name: str):
        if not doc_text:
            return
            
        # Simple chunking for demonstration
        chunks = [doc_text[i:i + 1000] for i in range(0, len(doc_text), 1000)]
        
        embeddings = self.ollama_embed.embed(
            model='nomic-embed-text',
            prompts=chunks
        )
        
        self.qdrant.upsert(
            collection_name=QDRANT_COLLECTION,
            points=[
                models.PointStruct(
                    id=f"{doc_name}_{i}",
                    vector=embedding,
                    payload={"doc_name": doc_name, "content": chunk},
                )
                for i, (chunk, embedding) in enumerate(zip(chunks, embeddings))
            ]
        )
        print(f"   [Ray-Qdrant] Ingested {len(chunks)} chunks for {doc_name}.")

# --- Main Orchestration Script ---
def run_ingestion_pipeline():
    """Finds all PDFs in MinIO and processes them in parallel using Ray."""
    print("🚀 [Ray Pipeline] Starting parallel ingestion...")
    
    # Initialize Ray cluster connection
    ray.init(address="ray://ray-head:10001", ignore_reinit_error=True)

    # Initialize MinIO client
    minio_client = Minio(
        MINIO_ENDPOINT,
        access_key=MINIO_ACCESS_KEY,
        secret_key=MINIO_SECRET_KEY,
        secure=False
    )
    
    # List all PDF objects in the bucket
    try:
        objects = minio_client.list_objects(MINIO_BUCKET, recursive=True)
        pdf_files = [obj.object_name for obj in objects if obj.object_name.lower().endswith('.pdf')]
    except Exception as e:
        print(f"❌ Could not connect to MinIO or list objects: {e}")
        return

    if not pdf_files:
        print("ℹ️  No PDFs found in MinIO bucket '{MINIO_BUCKET}'.")
        return
        
    print(f"Found {len(pdf_files)} PDFs to process.")

    # Create actor pool
    pdf_processor = PDFProcessor.remote()
    entity_extractor = EntityExtractor.remote()
    neo4j_ingestor = Neo4jIngestor.remote()
    qdrant_ingestor = QdrantIngestor.remote()

    # Create and execute the workflow for each file
    tasks = []
    for pdf_file in pdf_files:
        # Chain the operations for each file
        text_ref = pdf_processor.process.remote(minio_client, pdf_file)
        
        entities_ref = entity_extractor.extract.remote(text_ref)
        tasks.append(neo4j_ingestor.ingest.remote(entities_ref))
        
        tasks.append(qdrant_ingestor.ingest.remote(text_ref, pdf_file))

    # Wait for all tasks to complete
    ray.get(tasks)

    print("✅ [Ray Pipeline] All ingestion tasks completed.")
    
    # Clean up Neo4j connection
    neo4j_ingestor.close.remote()

if __name__ == "__main__":
    run_ingestion_pipeline()

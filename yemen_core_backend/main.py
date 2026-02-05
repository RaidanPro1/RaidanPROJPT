
import os
import shutil
from typing import List, Dict, Any
from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import asyncpg
from unstructured.partition.pdf import partition_pdf
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware

# --- Configuration ---
DATABASE_URL = os.getenv("DATABASE_URL")
# We use a high-performance open-source embedding model
EMBEDDING_MODEL_NAME = "BAAI/bge-base-en-v1.5" 

# --- Pydantic Models for API Validation & Documentation ---
class SearchQuery(BaseModel):
    query: str
    top_k: int = 5

class SearchResult(BaseModel):
    id: str
    title: str
    publish_date: str | None
    score: float
    content_snippet: str

class StatisticResult(BaseModel):
    record_date: str
    value: float
    unit: str | None

class IngestWebhookPayload(BaseModel):
    source_name: str
    data: List[Dict[str, Any]] # Flexible list of records

class DataSource(BaseModel):
    id: int
    name: str
    is_active: bool
    fetch_frequency: str | None
    last_crawled_at: str | None

# --- FastAPI App Initialization ---
app = FastAPI(
    title="Yemen Core - Knowledge API",
    description="The central data warehouse and long-term memory for the RaidanPro Sovereign Ecosystem.",
    version="1.0.0"
)

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Global Resources ---
db_pool = None
embedding_model = None

@app.on_event("startup")
async def startup():
    global db_pool, embedding_model
    try:
        db_pool = await asyncpg.create_pool(DATABASE_URL, min_size=1, max_size=10)
        print("Database connection pool created successfully.")
        # Load the model once into memory
        embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)
        print(f"Embedding model '{EMBEDDING_MODEL_NAME}' loaded.")
    except Exception as e:
        print(f"FATAL: Could not initialize resources: {e}")

@app.on_event("shutdown")
async def shutdown():
    if db_pool:
        await db_pool.close()

# --- Background Task: PDF Processing & Embedding ---
async def process_and_embed_pdf(file_path: str, source_name: str):
    """
    1. Extracts text from PDF using 'unstructured'.
    2. Generates vector embeddings using 'sentence-transformers'.
    3. Saves metadata, content, and vector to PostgreSQL.
    """
    print(f"Starting PDF processing for {file_path} from source {source_name}...")
    try:
        # 1. Extraction (Simplified for this example)
        elements = partition_pdf(filename=file_path, strategy="hi_res")
        full_content = "\n\n".join([str(el) for el in elements])
        
        # 2. Embedding
        embedding = embedding_model.encode(full_content).tolist()
        
        # 3. Storage
        async with db_pool.acquire() as conn:
            # Find source ID
            source_id_record = await conn.fetchrow("SELECT id FROM data_sources WHERE name = $1", source_name)
            source_id = source_id_record['id'] if source_id_record else None
            
            await conn.execute(
                """
                INSERT INTO yemen_docs (title, source_id, full_content, embedding)
                VALUES ($1, $2, $3, $4)
                """,
                Path(file_path).name, source_id, full_content, embedding
            )
        print(f"Successfully processed and stored {file_path}")
        
    except Exception as e:
        print(f"Error processing PDF {file_path}: {e}")
    finally:
        # Cleanup temp file
        if os.path.exists(file_path):
            os.unlink(file_path)

# --- API Endpoints ---

@app.get("/", tags=["Status"])
async def root():
    return {"status": "Yemen Core API is active and sovereign."}

@app.get("/api/v1/core/sources", response_model=List[DataSource], tags=["Source Management"])
async def get_data_sources():
    """Fetch list of all registered data sources."""
    async with db_pool.acquire() as conn:
        records = await conn.fetch("SELECT id, name, is_active, fetch_frequency, last_crawled_at FROM data_sources ORDER BY name")
    
    return [DataSource(
        id=r['id'], 
        name=r['name'], 
        is_active=r['is_active'], 
        fetch_frequency=r['fetch_frequency'],
        last_crawled_at=str(r['last_crawled_at']) if r['last_crawled_at'] else None
    ) for r in records]

@app.post("/api/v1/core/ingest/pdf", status_code=202, tags=["Ingestion"])
async def ingest_pdf(background_tasks: BackgroundTasks, source: str = "Manual Uploads", file: UploadFile = File(...)):
    """Upload a PDF file to be parsed, embedded, and indexed asynchronously."""
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    background_tasks.add_task(process_and_embed_pdf, file_path, source)
    
    return {"message": "PDF received. Processing and indexing started in background.", "filename": file.filename}

@app.post("/api/v1/core/search", response_model=List[SearchResult], tags=["Knowledge Access"])
async def semantic_search(query: SearchQuery):
    """
    Perform a semantic search across all indexed documents using vector similarity (Cosine Distance).
    Returns the most relevant text snippets.
    """
    query_embedding = embedding_model.encode(query.query).tolist()
    
    async with db_pool.acquire() as conn:
        # Uses the <=> operator for cosine distance provided by pgvector
        results = await conn.fetch(
            """
            SELECT id, title, publish_date, embedding <=> $1 AS distance, full_content
            FROM yemen_docs
            ORDER BY embedding <=> $1
            LIMIT $2
            """,
            query_embedding, query.top_k
        )
        
    return [
        SearchResult(
            id=str(r['id']),
            title=r['title'],
            publish_date=str(r['publish_date']) if r['publish_date'] else None,
            score=1 - r['distance'], # Convert distance to similarity score
            content_snippet=r['full_content'][:300] + "..." if r['full_content'] else ""
        ) for r in results
    ]

@app.get("/api/v1/core/statistic/{indicator}", response_model=List[StatisticResult], tags=["Knowledge Access"])
async def get_statistic(indicator: str):
    """Retrieve time-series data for a specific indicator (e.g., 'gdp_usd')."""
    async with db_pool.acquire() as conn:
        records = await conn.fetch(
            """
            SELECT record_date, value, unit 
            FROM yemen_stats 
            WHERE indicator = $1 
            ORDER BY record_date ASC
            """,
            indicator
        )
        
    return [
        StatisticResult(
            record_date=str(r['record_date']),
            value=r['value'],
            unit=r['unit']
        ) for r in records
    ]

@app.post("/api/v1/core/ingest/webhook", status_code=202, tags=["Ingestion"])
async def ingest_from_webhook(payload: IngestWebhookPayload):
    """Universal webhook for scrapers (Scrapy) to push structured JSON data."""
    # Logic to map JSON payload to yemen_stats would go here
    print(f"Received {len(payload.data)} records from {payload.source_name}. Processing...")
    return {"message": "Data received and queued for normalization and storage."}

import os
import shutil
from typing import List, Dict, Any
from fastapi import FastAPI, UploadFile, File, BackgroundTasks, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import asyncpg
from unstructured.partition.pdf import partition_pdf
from pathlib import Path
from cryptography.fernet import Fernet
from fastapi.middleware.cors import CORSMiddleware

# --- Configuration ---
DATABASE_URL = os.getenv("DATABASE_URL")
EMBEDDING_MODEL_NAME = "BAAI/bge-base-en-v1.5"

# --- Security: Encryption for Credentials ---
# In a real production environment, this key MUST be loaded from a secure vault or environment variable.
# For demonstration: ENCRYPTION_KEY = os.getenv("YEMEN_CORE_ENCRYPTION_KEY").encode()
ENCRYPTION_KEY = Fernet.generate_key() 
cipher_suite = Fernet(ENCRYPTION_KEY)

def encrypt_creds(creds: str) -> str:
    """Encrypts credentials before storing."""
    if not creds: return None
    return cipher_suite.encrypt(creds.encode()).decode()

def decrypt_creds(encrypted_creds: str) -> str:
    """Decrypts credentials for use by ingestion engines."""
    if not encrypted_creds: return None
    return cipher_suite.decrypt(encrypted_creds.encode()).decode()

# --- Pydantic Models for API Validation & Documentation ---
class SearchQuery(BaseModel): query: str; top_k: int = 5
class SearchResult(BaseModel): id: str; title: str; publish_date: str | None; score: float; content_snippet: str
class StatisticResult(BaseModel): record_date: str; value: float; unit: str | None
class IngestWebhookPayload(BaseModel): source_name: str; data: List[Dict[str, Any]]

# New models for Source Management
class SourceConfigUpdate(BaseModel):
    is_active: bool
    fetch_frequency: str
    auth_type: str
    credentials: str | None = None # Only provided when updating

class DataSource(BaseModel):
    id: int
    name: str
    is_active: bool
    fetch_frequency: str
    auth_type: str
    last_status: str | None
    last_run_log: str | None
    last_crawled_at: str | None

# --- FastAPI App Initialization ---
app = FastAPI(
    title="Yemen Core - Knowledge API",
    description="The central data warehouse and long-term memory for the RaidanPro Sovereign Ecosystem.",
    version="1.1.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Global Resources ---
db_pool = None
embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)

@app.on_event("startup")
async def startup():
    global db_pool
    try:
        db_pool = await asyncpg.create_pool(DATABASE_URL, min_size=1, max_size=10)
        print("Database connection pool created successfully.")
    except Exception as e:
        print(f"FATAL: Could not connect to database: {e}")
        # In a real app, you might want to exit or retry
        
# ... (background task and other endpoints remain the same) ...

# --- API Endpoints ---
@app.get("/", tags=["Status"])
async def root():
    return {"status": "Yemen Core API is active and sovereign."}

# --- NEW: Source Management Endpoints ---

@app.get("/api/v1/core/sources", response_model=List[DataSource], tags=["Source Management"])
async def get_data_sources():
    """Fetch all data sources and their configurations."""
    async with db_pool.acquire() as conn:
        records = await conn.fetch("SELECT id, name, is_active, fetch_frequency, auth_type, last_status, last_run_log, last_crawled_at FROM data_sources ORDER BY name")
    return [DataSource(
        id=r['id'],
        name=r['name'],
        is_active=r['is_active'],
        fetch_frequency=r['fetch_frequency'],
        auth_type=r['auth_type'],
        last_status=r['last_status'],
        last_run_log=r['last_run_log'],
        last_crawled_at=str(r['last_crawled_at']) if r['last_crawled_at'] else None,
    ) for r in records]

@app.patch("/api/v1/core/sources/{source_id}", response_model=DataSource, tags=["Source Management"])
async def update_source_config(source_id: int, config: SourceConfigUpdate):
    """Update a data source's configuration, including credentials."""
    async with db_pool.acquire() as conn:
        if config.credentials:
            encrypted_creds = encrypt_creds(config.credentials)
            await conn.execute(
                """
                UPDATE data_sources
                SET is_active = $1, fetch_frequency = $2, auth_type = $3, credentials = $4
                WHERE id = $5
                """,
                config.is_active, config.fetch_frequency, config.auth_type, encrypted_creds, source_id
            )
        else:
            # Don't update credentials if not provided
            await conn.execute(
                """
                UPDATE data_sources
                SET is_active = $1, fetch_frequency = $2, auth_type = $3
                WHERE id = $4
                """,
                config.is_active, config.fetch_frequency, config.auth_type, source_id
            )
        
        updated_record = await conn.fetchrow("SELECT * FROM data_sources WHERE id = $1", source_id)
        if not updated_record:
            raise HTTPException(status_code=404, detail="Source not found")
            
    return DataSource(**dict(updated_record))


# --- Existing Endpoints (Ingestion, Search, etc.) ---
# The PDF ingestion and other endpoints remain unchanged.
async def process_and_embed_pdf(file_path: str, source_name: str):
    print(f"Starting PDF processing for {file_path} from source {source_name}...")
    try:
        elements = partition_pdf(filename=file_path, strategy="hi_res")
        full_content = "\n\n".join([str(el) for el in elements])
        embedding = embedding_model.encode(full_content).tolist()
        async with db_pool.acquire() as conn:
            source_id_record = await conn.fetchrow("SELECT id FROM data_sources WHERE name = $1", source_name)
            source_id = source_id_record['id'] if source_id_record else None
            await conn.execute(
                "INSERT INTO yemen_docs (title, source_id, full_content, embedding) VALUES ($1, $2, $3, $4)",
                Path(file_path).name, source_id, full_content, embedding
            )
        print(f"Successfully processed and stored {file_path}")
    except Exception as e:
        print(f"Error processing PDF {file_path}: {e}")
    finally:
        os.unlink(file_path)

@app.post("/api/v1/core/ingest/pdf", status_code=202, tags=["Ingestion"])
async def ingest_pdf(background_tasks: BackgroundTasks, source: str = "Manual Uploads", file: UploadFile = File(...)):
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    background_tasks.add_task(process_and_embed_pdf, file_path, source)
    return {"message": "PDF received for processing.", "filename": file.filename}

@app.post("/api/v1/core/search", response_model=List[SearchResult], tags=["Knowledge Access"])
async def semantic_search(query: SearchQuery):
    query_embedding = embedding_model.encode(query.query).tolist()
    async with db_pool.acquire() as conn:
        results = await conn.fetch(
            "SELECT id, title, publish_date, embedding <=> $1 AS distance, full_content FROM yemen_docs ORDER BY embedding <=> $1 LIMIT $2",
            query_embedding, query.top_k
        )
    return [SearchResult(id=str(r['id']), title=r['title'], publish_date=str(r['publish_date']) if r['publish_date'] else None, score=1 - r['distance'], content_snippet=r['full_content'][:300] + "..." if r['full_content'] else "") for r in results]

@app.get("/api/v1/core/statistic/{indicator}", response_model=List[StatisticResult], tags=["Knowledge Access"])
async def get_statistic(indicator: str):
    async with db_pool.acquire() as conn:
        records = await conn.fetch("SELECT record_date, value, unit FROM yemen_stats WHERE indicator = $1 ORDER BY record_date ASC", indicator)
    return [StatisticResult(record_date=str(r['record_date']), value=r['value'], unit=r['unit']) for r in records]

@app.post("/api/v1/core/ingest/webhook", status_code=202, tags=["Ingestion"])
async def ingest_from_webhook(payload: IngestWebhookPayload):
    print(f"Received {len(payload.data)} records from {payload.source_name}. Processing...")
    return {"message": "Data received and queued for ingestion."}

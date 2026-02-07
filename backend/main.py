
import httpx
import os
import shutil
import asyncio
import pty
import json
import subprocess
import hashlib
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, UploadFile, File, WebSocket, WebSocketDisconnect, Request, Response
from uuid import UUID
from pathlib import Path
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

# --- Ray Integration ---
try:
    from ray_infra import RayManager
except ImportError:
    from backend.ray_infra import RayManager

app = FastAPI(title="YemenJPT Sovereign Core API")

# Setup Ray Manager
ray_manager = RayManager.get_instance()

@app.on_event("startup")
async def startup_event():
    # Initialize Ray and spawn actors
    ray_manager.initialize()

@app.on_event("shutdown")
async def shutdown_event():
    ray_manager.shutdown()

class ImageETagMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        if response.headers.get("content-type", "").startswith("image/"):
            if "etag" not in response.headers:
                if hasattr(response, "body") and response.body:
                    etag = hashlib.md5(response.body).hexdigest()
                    response.headers["ETag"] = f'"{etag}"'
            if "cache-control" not in response.headers:
                response.headers["Cache-Control"] = "public, no-cache"
        return response

app.add_middleware(ImageETagMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup Static Directory
STATIC_DIR = Path("static")
STATIC_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# Check Installation Mode
if os.getenv("INSTALLATION_MODE") == "true":
    from install_logic import router as install_router
    app.include_router(install_router)

@app.get("/")
async def read_root():
    if os.getenv("INSTALLATION_MODE") == "true":
        wizard_path = STATIC_DIR / "wizard.html"
        if wizard_path.exists():
            return FileResponse(wizard_path)
    return {"status": "RaidanPro Core API Active", "docs_url": "/docs"}

# --- Parallel AI Chat via Ray ---
class ChatRequest(BaseModel):
    message: str
    model: str = "qwen2.5-sovereign"
    context: Optional[List[Dict]] = []

@app.post("/api/v1/ai/chat")
async def chat_parallel(req: ChatRequest):
    """Refactored chat endpoint using Ray Actors for parallel scaling."""
    actor = ray_manager.get_chat_actor()
    if not actor:
        raise HTTPException(status_code=503, detail="AI Compute Cluster Offline")
    
    messages = req.context + [{"role": "user", "content": req.message}]
    
    # Ray Actor call (Remote execution)
    result_ref = actor.chat.remote(model=req.model, messages=messages)
    
    # Wait for result with timeout
    try:
        import ray
        result = await ray.get(result_ref)
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Actor timeout or failure: {str(e)}")

# --- Parallel Forensic Analysis via Ray ---
@app.post("/api/v1/forensics/analyze")
async def forensic_parallel(file: UploadFile = File(...)):
    """Refactored forensic endpoint leveraging Ray for compute-heavy pixel analysis."""
    actor = ray_manager.get_forensics_actor()
    if not actor:
        raise HTTPException(status_code=503, detail="Forensic Compute Cluster Offline")
    
    file_content = await file.read()
    
    # Offload to Ray worker
    import ray
    result_ref = actor.run_ela_analysis.remote(file_content)
    result = await ray.get(result_ref)
    
    return result

# --- Legacy System Command Request ---
class SystemCommandRequest(BaseModel):
    command: str
    target: str
    params: Optional[Dict[str, Any]] = {}

@app.post("/api/v1/agent/execute")
async def execute_system_action(req: SystemCommandRequest):
    if req.command == "docker_manage":
        action = req.params.get("action")
        container = req.target
        cmd = ["docker", action, container]
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            return {"status": "success", "output": result.stdout}
        except subprocess.CalledProcessError as e:
            return {"status": "error", "output": e.stderr}
    return {"status": "unknown_command"}

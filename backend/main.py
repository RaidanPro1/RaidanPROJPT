
import httpx
import os
import shutil
import asyncio
import pty
import json
import subprocess
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, UploadFile, File, WebSocket, WebSocketDisconnect
from uuid import UUID
from pathlib import Path
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# استيراد محركات النظام
from backend import snapshot_engine
from backend import email_engine
from backend.lifeline import server_teleport, gdrive_backup

app = FastAPI(title="YemenJPT Sovereign Core API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STATIC_DIR = Path("static")
ICONS_DIR = STATIC_DIR / "icons"
ICONS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# --- Agentic Tools Definition (قدرات التحكم في النظام) ---
# هذه الأدوات يمكن استدعاؤها من قبل Gemini/Ollama إذا كان المستخدم روت

class SystemCommandRequest(BaseModel):
    command: str
    target: str
    params: Optional[Dict[str, Any]] = {}

@app.post("/api/v1/agent/execute")
async def execute_system_action(req: SystemCommandRequest):
    """
    نقطة النهاية الخاصة بالعميل الذكي (AI Agent Execution Endpoint).
    تسمح للذكاء الاصطناعي بالتحكم في البنية التحتية.
    """
    # Security Check: In real app, verify Root Token here.
    
    if req.command == "docker_manage":
        action = req.params.get("action") # start, stop, restart
        container = req.target
        cmd = ["docker", action, container]
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            return {"status": "success", "output": result.stdout, "command": f"docker {action} {container}"}
        except subprocess.CalledProcessError as e:
            return {"status": "error", "output": e.stderr}

    elif req.command == "list_services":
        cmd = ["docker", "ps", "--format", "{{.Names}} - {{.Status}}"]
        result = subprocess.run(cmd, capture_output=True, text=True)
        return {"status": "success", "services": result.stdout.split('\n')}

    elif req.command == "check_logs":
        # قراءة آخر 50 سطر من السجلات
        cmd = ["docker", "logs", "--tail", "50", req.target]
        try:
            result = subprocess.run(cmd, capture_output=True, text=True)
            return {"status": "success", "logs": result.stdout + result.stderr}
        except Exception as e:
             return {"status": "error", "message": str(e)}

    return {"status": "unknown_command"}

# --- Model Forge Endpoints ---

class ModelPullRequest(BaseModel):
    model_tag: str

@app.post("/api/v1/models/pull")
async def pull_local_model(req: ModelPullRequest, background_tasks: BackgroundTasks):
    """
    أمر بتحميل موديل جديد إلى Ollama محلياً.
    """
    async def task_pull():
        # This is a long running task
        async with httpx.AsyncClient() as client:
            # Ollama API pull
            await client.post("http://ollama:11434/api/pull", json={"name": req.model_tag})
            
    background_tasks.add_task(task_pull)
    return {"status": "initiated", "message": f"Pulling {req.model_tag} to sovereign storage..."}

@app.get("/api/v1/models/local")
async def list_local_models():
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get("http://ollama:11434/api/tags")
            if resp.status_code == 200:
                return resp.json()
            return {"models": []}
    except:
        return {"models": [], "error": "Ollama Offline"}

# ... (Rest of existing endpoints) ...

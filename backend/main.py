import httpx
import os
import shutil
import asyncio
import pty
from typing import Dict, Any, List
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, UploadFile, File, WebSocket, WebSocketDisconnect
from uuid import UUID
from pathlib import Path
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# استيراد محرك الأرشفة الجديد
from backend import snapshot_engine

app = FastAPI(title="YemenJPT Sovereign Core API")

# --- FIX: Add CORS middleware to allow frontend requests ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development. Restrict for production.
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.).
    allow_headers=["*"],  # Allows all headers.
)

# --- NEW: Serve static files for custom icons ---
STATIC_DIR = Path("static")
ICONS_DIR = STATIC_DIR / "icons"
ICONS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


# --- NEW: Pydantic Models for Tool Registry ---
class ModuleUpdate(BaseModel):
    display_name: str
    description: str

class ModuleRegistryItem(BaseModel):
    module_key: str
    display_name: str
    description: str
    icon_name: str
    is_active: bool
    route_path: str

# --- NEW: Mock Database for Tool Registry ---
# In a real app, this would come from the PostgreSQL table.
MOCK_REGISTRY_DB: Dict[str, Dict[str, Any]] = {
    'dashboard': {'module_key': 'dashboard', 'display_name': 'الرئيسية (System Hub)', 'description': 'نظرة عامة على حالة النظام والوحدات.', 'icon_name': 'LayoutDashboard', 'is_active': True, 'route_path': 'dashboard'},
    'root_command': {'module_key': 'root_command', 'display_name': 'برج المراقبة (Root)', 'description': 'إدارة البنية التحتية والسيادة.', 'icon_name': 'TowerControl', 'is_active': True, 'route_path': 'root_command'},
    'governance': {'module_key': 'governance', 'display_name': 'عقيدة النظام', 'description': 'إدارة أخلاقيات وسلوك الذكاء الاصطناعي.', 'icon_name': 'BookText', 'is_active': True, 'route_path': 'governance'},
    'smart_newsroom': {'module_key': 'smart_newsroom', 'display_name': 'غرفة الأخبار الذكية', 'description': 'إدارة النشر والتقارير الاستقصائية.', 'icon_name': 'Newspaper', 'is_active': True, 'route_path': 'smart_newsroom'},
    'forensics_lab': {'module_key': 'forensics_lab', 'display_name': 'مختبر الجنايات الرقمية', 'description': 'كشف التزييف العميق وتحليل الصور.', 'icon_name': 'Fingerprint', 'is_active': True, 'route_path': 'forensics_lab'},
    'predictive_center': {'module_key': 'predictive_center', 'display_name': 'مركز الاستبصار', 'description': 'رصد الأحداث والإنذار المبكر.', 'icon_name': 'Radar', 'is_active': True, 'route_path': 'predictive_center'},
    'geo_int_station': {'module_key': 'geo_int_station', 'display_name': 'محطة الاستقصاء الجغرافي', 'description': 'تحليل الصور الفضائية Sentinel-2.', 'icon_name': 'Map', 'is_active': True, 'route_path': 'geo_int_station'},
    'dialect_engine': {'module_key': 'dialect_engine', 'display_name': 'محرك "مُنصت" الصوتي', 'description': 'تفريغ XXL وعزل الصوت عبر VR-Arch.', 'icon_name': 'Mic2', 'is_active': True, 'route_path': 'dialect_engine'},
    'data_journalism': {'module_key': 'data_journalism', 'display_name': 'كاشف الفساد', 'description': 'رسم العلاقات والبحث في Aleph.', 'icon_name': 'Share2', 'is_active': True, 'route_path': 'data_journalism'},
    'branding': {'module_key': 'branding', 'display_name': 'تخصيص الواجهة', 'description': 'إدارة الهوية البصرية والعلامة التجارية.', 'icon_name': 'Palette', 'is_active': True, 'route_path': 'branding'},
    'tenants': {'module_key': 'tenants', 'display_name': 'إدارة المستأجرين', 'description': 'إدارة الكيانات السيادية والوصول.', 'icon_name': 'Users', 'is_active': True, 'route_path': 'tenants'},
    'tool_identity': {'module_key': 'tool_identity', 'display_name': 'هوية الأدوات', 'description': 'تخصيص أسماء وأيقونات الوحدات.', 'icon_name': 'Wrench', 'is_active': True, 'route_path': 'tool_identity'},
    'core_settings': {'module_key': 'core_settings', 'display_name': 'الإعدادات المتقدمة', 'description': 'إعدادات النواة والتكاملات.', 'icon_name': 'Sliders', 'is_active': True, 'route_path': 'core_settings'},
    'terminal': {'module_key': 'terminal', 'display_name': 'Terminal', 'description': 'واجهة الأوامر للتحكم المباشر.', 'icon_name': 'Terminal', 'is_active': True, 'route_path': 'terminal'},
}


# سيتم استبدال هذا بعنوان IP السيرفر الرئيسي للمنظمة
MASTER_SERVER_IP = os.getenv("SERVER_IP", "1.1.1.1")

# --- NEW: Tool Registry API Endpoints ---
@app.get("/api/v1/registry", response_model=List[ModuleRegistryItem])
async def get_module_registry():
    """Fetch the entire tool configuration registry."""
    return list(MOCK_REGISTRY_DB.values())

@app.patch("/api/v1/registry/{module_key}", response_model=ModuleRegistryItem)
async def update_module_info(module_key: str, update_data: ModuleUpdate):
    """Update a module's display name and description."""
    if module_key not in MOCK_REGISTRY_DB:
        raise HTTPException(status_code=404, detail="Module not found")
    
    MOCK_REGISTRY_DB[module_key]["display_name"] = update_data.display_name
    MOCK_REGISTRY_DB[module_key]["description"] = update_data.description
    return MOCK_REGISTRY_DB[module_key]

@app.post("/api/v1/registry/{module_key}/icon", response_model=ModuleRegistryItem)
async def upload_module_icon(module_key: str, icon: UploadFile = File(...)):
    """Upload a custom icon for a module."""
    if module_key not in MOCK_REGISTRY_DB:
        raise HTTPException(status_code=404, detail="Module not found")
    
    # Generate a safe filename
    file_extension = Path(icon.filename).suffix
    icon_filename = f"{module_key}{file_extension}"
    icon_path = ICONS_DIR / icon_filename
    
    try:
        with icon_path.open("wb") as buffer:
            shutil.copyfileobj(icon.file, buffer)
    finally:
        icon.file.close()

    # The icon_name field will now store the URL path
    icon_url = f"/static/icons/{icon_filename}"
    MOCK_REGISTRY_DB[module_key]["icon_name"] = icon_url
    
    return MOCK_REGISTRY_DB[module_key]

# --- NEW: Web Terminal WebSocket Endpoint ---
@app.websocket("/ws/v1/terminal/session")
async def terminal_session(websocket: WebSocket):
    await websocket.accept()

    # TODO: Implement robust root session token validation here.
    # For now, we proceed, but in production this is a critical security step.
    # e.g., token = websocket.query_params.get("token")
    # if not is_valid_root_token(token):
    #     await websocket.close(code=1008, reason="Unauthorized")
    #     return

    # Create a pseudo-terminal (PTY)
    master_fd, slave_fd = pty.openpty()
    
    # Start a shell process (e.g., bash) connected to the PTY
    shell_process = await asyncio.create_subprocess_shell(
        "bash",
        stdin=slave_fd,
        stdout=slave_fd,
        stderr=slave_fd,
        env={**os.environ, "TERM": "xterm"}, # Set terminal type
    )

    async def read_from_pty_and_forward(master_fd, websocket):
        """Read from PTY and send to WebSocket client."""
        while True:
            try:
                data = os.read(master_fd, 1024)
                if not data:
                    break
                await websocket.send_text(data.decode())
            except (IOError, OSError, WebSocketDisconnect):
                break

    async def read_from_websocket_and_forward(master_fd, websocket):
        """Read from WebSocket client and send to PTY."""
        while True:
            try:
                data = await websocket.receive_text()
                os.write(master_fd, data.encode())
            except (IOError, OSError, WebSocketDisconnect):
                break

    # Run both tasks concurrently
    task1 = asyncio.create_task(read_from_pty_and_forward(master_fd, websocket))
    task2 = asyncio.create_task(read_from_websocket_and_forward(master_fd, websocket))

    try:
        await asyncio.gather(task1, task2)
    except Exception as e:
        print(f"Terminal session error: {e}")
    finally:
        # Cleanup
        os.close(master_fd)
        os.close(slave_fd)
        if shell_process.returncode is None:
            shell_process.kill()
        await shell_process.wait()
        print("Terminal session closed.")


async def sync_cloudflare_dns(domain: str, token: str, zone_id: str):
    """
    تزامن سجلات DNS مع Cloudflare تلقائياً.
    """
    url = f"https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records"
    headers = { "Authorization": f"Bearer {token}", "Content-Type": "application/json" }
    dns_data = { "type": "A", "name": domain, "content": MASTER_SERVER_IP, "ttl": 3600, "proxied": True }
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, headers=headers, json=dns_data)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 400 and "already exists" in e.response.text:
                return {"status": "already_synced", "message": "DNS record already exists"}
            raise HTTPException(status_code=400, detail=f"Cloudflare Error: {e.response.text}")

@app.get("/tenants/{tenant_id}/generate-config")
async def generate_service_config(tenant_id: str):
    """
    توليد كائن التكوين (Config Object) بناءً على خدمات العميل.
    """
    mock_db = { "enabled_services": ["ollama", "ragflow", "n8n", "mailu"], "quotas": {"cpu": 4.0, "ram": 8192}, "domain": "news-room.raidan.pro" }
    services, domain = mock_db["enabled_services"], mock_db["domain"]
    config = { "version": "1.7.2", "tenant_id": tenant_id, "labels": {"traefik.enable": "true", "yjpt.sovereignty": "strict"}, "networks": {"internal": f"net_{tenant_id}"}, "deployment_stack": [] }
    for service in services:
        service_node = { "name": f"{service}_{tenant_id[:8]}", "image": f"yemenjpt/{service}:latest", "proxy": {"host": f"{service}.{domain}", "tls": True}, "resources": {"limits": {"cpus": str(mock_db["quotas"]["cpu"] / len(services)), "memory": f"{mock_db['quotas']['ram'] // len(services)}M"}} }
        config["deployment_stack"].append(service_node)
    return { "status": "success", "config_payload": config, "instructions": f"Deploy this JSON to Coolify API at /deploy/{tenant_id}" }

@app.post("/tenants/provision")
async def provision_tenant(tenant_name: str, domain: str, cf_token: str, cf_zone: str):
    """
    نقطة النهاية الرئيسية (Endpoint) لإنشاء عميل جديد بربط DNS فوري.
    """
    dns_result = await sync_cloudflare_dns(domain, cf_token, cf_zone)
    return { "message": f"Tenant {tenant_name} provisioned successfully.", "dns_status": dns_result }

@app.get("/snapshot/create")
async def create_system_snapshot(background_tasks: BackgroundTasks):
    """
    يشغل عملية أرشفة النظام ويعيد ملف ZIP للتحميل.
    """
    def cleanup_file(file_path: Path):
        try:
            if file_path.exists(): file_path.unlink()
        except Exception as e:
            print(f"Error cleaning up file {file_path}: {e}")
    try:
        zip_file_path_str = await snapshot_engine.generate_full_snapshot()
        zip_file_path = Path(zip_file_path_str)
        if not zip_file_path.is_file():
            raise HTTPException(status_code=500, detail="Snapshot ZIP file not found after generation.")
        background_tasks.add_task(cleanup_file, zip_file_path)
        return FileResponse(path=zip_file_path, media_type='application/zip', filename=zip_file_path.name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate system snapshot: {str(e)}")]
</content>
</change>
<change>
<file>components/TerminalConsole.tsx</file>
<description>إنشاء مكون `TerminalConsole.tsx` جديد. يستخدم هذا المكون `xterm.js` لإنشاء واجهة طرفية تفاعلية تتصل بالخلفية عبر WebSocket، مما يوفر وصولاً مباشراً لسطر الأوامر على السيرفر بتصميم تكتيكي متكامل.</description>
<content><![CDATA[import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebglAddon } from 'xterm-addon-webgl';

const TerminalConsole: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termInstance = useRef<Terminal | null>(null);
  const fitAddon = useRef(new FitAddon());
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!terminalRef.current || termInstance.current) {
      return;
    }

    const term = new Terminal({
      cursorBlink: true,
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 14,
      theme: {
        background: 'transparent',
        foreground: '#e2e8f0', // slate-200
        cursor: '#D4AF37', // yemenGold
        selectionBackground: 'rgba(212, 175, 55, 0.3)',
        black: '#0f172a',
        red: '#ef4444',
        green: '#22c55e',
        yellow: '#eab308',
        blue: '#3b82f6',
        magenta: '#d946ef',
        cyan: '#06b6d4',
        white: '#f8fafc',
        brightBlack: '#64748b',
        brightRed: '#f87171',
        brightGreen: '#4ade80',
        brightYellow: '#facc15',
        brightBlue: '#60a5fa',
        brightMagenta: '#f472b6',
        brightCyan: '#22d3ee',
        brightWhite: '#ffffff',
      },
      allowProposedApi: true,
    });
    termInstance.current = term;

    // Load addons
    term.loadAddon(fitAddon.current);
    try {
      const webglAddon = new WebglAddon();
      term.loadAddon(webglAddon);
    } catch (e) {
      console.warn('WebGL addon failed to load, falling back to canvas renderer.', e);
    }
    
    term.open(terminalRef.current);
    fitAddon.current.fit();
    term.focus();

    // Setup WebSocket connection
    const wsUrl = `ws://127.0.0.1:8000/ws/v1/terminal/session`;
    socket.current = new WebSocket(wsUrl);

    socket.current.onopen = () => {
      term.writeln('\x1b[1;33m[RAIDAN_PRO] Sovereign Terminal Connection Established.\x1b[0m');
      term.writeln('\x1b[1;34mWelcome, Root Administrator. Gemini AI Assistant is available via `ai` command.\x1b[0m');
      term.writeln('');
    };

    socket.current.onmessage = (event) => {
      term.write(event.data);
    };

    socket.current.onclose = () => {
      term.writeln('\n\x1b[1;31m[RAIDAN_PRO] Connection to server lost.\x1b[0m');
    };

    socket.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
      term.writeln('\n\x1b[1;31m[RAIDAN_PRO] WebSocket connection error.\x1b[0m');
    };

    // Forward user input to WebSocket
    term.onData((data) => {
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        socket.current.send(data);
      }
    });

    // Handle resizing
    const resizeObserver = new ResizeObserver(() => {
      try {
        fitAddon.current.fit();
      } catch (e) {
        console.log("Terminal fit error:", e);
      }
    });
    if (terminalRef.current) {
        resizeObserver.observe(terminalRef.current);
    }

    // Cleanup on unmount
    return () => {
      resizeObserver.disconnect();
      socket.current?.close();
      term.dispose();
      termInstance.current = null;
    };
  }, []);

  return (
    <div className="h-full w-full">
      <div ref={terminalRef} className="terminal-container" />
    </div>
  );
};

export default TerminalConsole;]]></content>
</change>
<change>
<file>backend/cli/pyproject.toml</file>
<description>إنشاء ملف `pyproject.toml` جديد لتعريف حزمة `raidan-ai`. يحدد هذا الملف اعتماديات Python المطلوبة (مثل `google-generativeai`) ونقطة الدخول لسطر الأوامر، مما يسمح بتثبيت الأداة على مستوى النظام.</description>
<content><![CDATA[# pyproject.toml
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "raidan_ai"
version = "1.0.0"
authors = [
  { name="RaidanPro Systems Architect", email="architect@raidan.pro" },
]
description = "A Gemini-powered CLI assistant for the YemenJPT Sovereign Terminal."
requires-python = ">=3.8"
dependencies = [
    "google-generativeai",
    "python-dotenv",
]

[project.scripts]
raidan-ai = "raidan_ai.cli:main"
ai = "raidan_ai.cli:main"
]]></content>
</change>
<change>
<file>backend/cli/raidan_ai/cli.py</file>
<description>إنشاء الأداة المساعدة `raidan-ai`. هذا السكربت المكتوب بلغة Python هو العقل المدبر لمساعد CLI، حيث يعالج الأوامر (`ask`, `fix`, `gen`)، ويجمع سياق النظام، ويتصل بـ Gemini API لإنشاء استجابات ذكية، ثم يطبعها في الطرفية.</description>
<content><![CDATA[# backend/cli/raidan_ai/cli.py
import os
import sys
import argparse
import subprocess
import google.generativeai as genai
from pathlib import Path

def get_system_context() -> str:
    """Gathers system information to provide context to the AI model."""
    try:
        uname = subprocess.check_output(["uname", "-a"], text=True).strip()
        docker_ps = subprocess.check_output(["docker", "ps", "--format", "table {{.Names}}\t{{.Image}}\t{{.Status}}"], text=True).strip()
        context = f"## System Context ##\n- OS Info: {uname}\n- Running Containers:\n{docker_ps}\n"
        return context
    except (FileNotFoundError, subprocess.CalledProcessError) as e:
        return f"## System Context ##\n- Warning: Could not gather full context. Error: {e}\n"

def configure_gemini():
    """Configures the Gemini API."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("\x1b[31mError: GEMINI_API_KEY environment variable not set.\x1b[0m", file=sys.stderr)
        sys.exit(1)
    genai.configure(api_key=api_key)

def handle_ask(args):
    """Handles the 'ask' subcommand."""
    system_context = get_system_context()
    prompt = f"""
    {system_context}
    
    ## User Request ##
    Role: You are a senior Linux systems administrator and DevOps expert.
    Task: Provide a concise, single-line shell command to accomplish the user's request.
    Follow it with a brief, one-sentence explanation prefixed with "# Explanation:".
    
    User's request: "{args.prompt}"
    
    Response:
    """
    
    model = genai.GenerativeModel('gemini-3-pro-preview')
    response = model.generate_content(prompt)
    print("\x1b[36m# Suggested Command:\x1b[0m")
    print(response.text.strip())

def handle_fix(args):
    """Handles the 'fix' subcommand."""
    log_file = Path(args.logfile)
    if not log_file.is_file():
        print(f"\x1b[31mError: Log file not found at '{log_file}'\x1b[0m", file=sys.stderr)
        return

    try:
        log_content = subprocess.check_output(["tail", "-n", "50", str(log_file)], text=True).strip()
    except subprocess.CalledProcessError as e:
        print(f"\x1b[31mError reading log file: {e}\x1b[0m", file=sys.stderr)
        return
        
    system_context = get_system_context()
    prompt = f"""
    {system_context}
    
    ## User Request ##
    Role: You are an expert in troubleshooting server applications (Nginx, Docker, PostgreSQL).
    Task: Analyze the following log snippet, identify the root cause of the error, and suggest a specific command or action to fix it.
    
    Log file snippet from '{args.logfile}':
    ---
    {log_content}
    ---
    
    Analysis and Solution:
    """

    model = genai.GenerativeModel('gemini-3-pro-preview')
    response = model.generate_content(prompt)
    print("\x1b[33m# AI Analysis & Suggested Fix:\x1b[0m")
    print(response.text.strip())


def handle_gen(args):
    """Handles the 'gen' subcommand."""
    system_context = get_system_context()
    prompt = f"""
    {system_context}
    
    ## User Request ##
    Role: You are a proficient scriptwriter for shell (bash) and Python.
    Task: Generate a complete, executable script to accomplish the user's request. Add comments to explain key parts of the script. The script should be ready to be piped to a file and executed.
    
    User's request: "generate a {args.script_description}"
    
    Generated Script:
    """
    
    model = genai.GenerativeModel('gemini-3-pro-preview')
    response = model.generate_content(prompt)
    
    # Simple syntax highlighting for the output
    highlighted_text = response.text.strip()
    highlighted_text = highlighted_text.replace("#", "\x1b[32m#") # Comments green
    highlighted_text = highlighted_text.replace("echo", "\x1b[35mecho\x1b[0m") # Keywords purple
    highlighted_text = highlighted_text.replace("for", "\x1b[35mfor\x1b[0m")
    highlighted_text = highlighted_text.replace("do", "\x1b[35mdo\x1b[0m")
    highlighted_text = highlighted_text.replace("done", "\x1b[35mdone\x1b[0m")

    print("\x1b[36m# Generated Script:\x1b[0m")
    print(highlighted_text)


def main():
    """Main function to parse arguments and dispatch to handlers."""
    configure_gemini()
    
    parser = argparse.ArgumentParser(description="Raidan AI Assistant for the Sovereign Terminal.")
    subparsers = parser.add_subparsers(dest="command", required=True, help="Available commands")

    # 'ask' command
    parser_ask = subparsers.add_parser("ask", help="Ask for a command suggestion.")
    parser_ask.add_argument("prompt", type=str, help="The task you want to accomplish.")
    parser_ask.set_defaults(func=handle_ask)

    # 'fix' command
    parser_fix = subparsers.add_parser("fix", help="Analyze a log file and suggest a fix.")
    parser_fix.add_argument("logfile", type=str, help="Path to the log file to analyze.")
    parser_fix.set_defaults(func=handle_fix)

    # 'gen' command
    parser_gen = subparsers.add_parser("gen", help="Generate a complete script.")
    parser_gen.add_argument("script_description", type=str, help="A description of the script to generate.")
    parser_gen.set_defaults(func=handle_gen)
    
    if len(sys.argv) == 1:
        parser.print_help(sys.stderr)
        sys.exit(1)

    args = parser.parse_args()
    args.func(args)

if __name__ == "__main__":
    main()
]]></content>
</change>
</changes>
```
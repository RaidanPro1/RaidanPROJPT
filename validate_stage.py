
import sys
import os
import time
import requests
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DB_HOST = "172.28.0.10" # Static IP defined in compose
DB_USER = os.getenv("DB_USER", "raidan_root")
DB_PASS = os.getenv("DB_PASSWORD")
DB_NAME = "raidan_core"

OLLAMA_HOST = "http://172.28.0.20:11434"
BACKEND_URL = "http://172.28.0.30:8000"
GATEWAY_URL = "http://172.28.0.2:80" # Traefik internal port

def check_db():
    print("🔍 [PROBE] Checking Database Connectivity...")
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            connect_timeout=5
        )
        cur = conn.cursor()
        cur.execute("SELECT 1;")
        conn.close()
        print("   ✅ Database Connection: OK")
        return True
    except Exception as e:
        print(f"   ❌ Database Check Failed: {e}")
        return False

def check_ai():
    print("🔍 [PROBE] Checking AI Model Availability...")
    try:
        # Check simple generation
        payload = {"model": "qwen2.5:14b", "prompt": "hi", "stream": False}
        res = requests.post(f"{OLLAMA_HOST}/api/generate", json=payload, timeout=10)
        if res.status_code == 200:
            print("   ✅ AI Model Response: OK")
            return True
        else:
            print(f"   ❌ AI API Error: {res.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ AI Connection Failed: {e}")
        return False

def check_api():
    print("🔍 [PROBE] Checking Backend Health...")
    try:
        res = requests.get(f"{BACKEND_URL}/health", timeout=5)
        if res.status_code == 200:
            print("   ✅ Backend API: OK")
            return True
        else:
            print(f"   ❌ Backend Returned: {res.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Backend Connection Failed: {e}")
        return False

def check_ssl():
    print("🔍 [PROBE] Checking Gateway/SSL Traefik Status...")
    try:
        # Check Traefik ping or dashboard (if exposed internally)
        # Here we check the gateway IP response
        res = requests.get(GATEWAY_URL, timeout=5)
        # 404 is expected if no route matches root, but connection means Traefik is up
        if res.status_code in [200, 404]: 
            print("   ✅ Gateway Reachable: OK")
            return True
        return False
    except Exception as e:
        print(f"   ❌ Gateway Failed: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 validate_stage.py [check_db|check_ai|check_api|check_ssl]")
        sys.exit(1)

    command = sys.argv[1]
    success = False

    if command == "check_db": success = check_db()
    elif command == "check_ai": success = check_ai()
    elif command == "check_api": success = check_api()
    elif command == "check_ssl": success = check_ssl()
    else:
        print("Unknown command")
        sys.exit(1)

    if success:
        sys.exit(0)
    else:
        sys.exit(1)

import os
import httpx
import asyncio
from dotenv import load_dotenv

# Load config from .env file in the parent directory
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

# إعدادات Cloudflare
CF_API_TOKEN = os.getenv("CF_API_TOKEN")
CF_ZONE_ID = os.getenv("CF_ZONE_ID")
SERVER_PUBLIC_IP = os.getenv("SERVER_PUBLIC_IP")
ROOT_DOMAIN = os.getenv("ROOT_DOMAIN", "raidan.pro")

# هيكلية DNS المعتمدة v3.1
REQUIRED_RECORDS = {
    # A Records (Root & Gateway)
    "@": {"type": "A", "content": SERVER_PUBLIC_IP, "proxied": True},
    "gateway": {"type": "A", "content": SERVER_PUBLIC_IP, "proxied": True},
    
    # Frontends (CNAME -> gateway)
    "ai": {"type": "CNAME", "content": f"gateway.{ROOT_DOMAIN}", "proxied": True},
    "console": {"type": "CNAME", "content": f"gateway.{ROOT_DOMAIN}", "proxied": True},
    "indicators": {"type": "CNAME", "content": f"gateway.{ROOT_DOMAIN}", "proxied": True},
    
    # Backends
    "api": {"type": "CNAME", "content": f"gateway.{ROOT_DOMAIN}", "proxied": True},
    "sso": {"type": "CNAME", "content": f"gateway.{ROOT_DOMAIN}", "proxied": True},
    "core": {"type": "CNAME", "content": f"gateway.{ROOT_DOMAIN}", "proxied": True},
    "search": {"type": "CNAME", "content": f"gateway.{ROOT_DOMAIN}", "proxied": True},
    
    # Tools
    "lab": {"type": "CNAME", "content": f"gateway.{ROOT_DOMAIN}", "proxied": True},
    "maps": {"type": "CNAME", "content": f"gateway.{ROOT_DOMAIN}", "proxied": True},
    "news": {"type": "CNAME", "content": f"gateway.{ROOT_DOMAIN}", "proxied": True},
    "viz": {"type": "CNAME", "content": f"gateway.{ROOT_DOMAIN}", "proxied": True},
    "shell": {"type": "CNAME", "content": f"gateway.{ROOT_DOMAIN}", "proxied": True},
    
    # Ops & Infra
    "ops": {"type": "CNAME", "content": f"gateway.{ROOT_DOMAIN}", "proxied": True},
    "s3": {"type": "CNAME", "content": f"gateway.{ROOT_DOMAIN}", "proxied": True},
    "cdn": {"type": "CNAME", "content": f"gateway.{ROOT_DOMAIN}", "proxied": True},
    
    # Mail Service (Webmail & Transport)
    "mail": {"type": "CNAME", "content": f"gateway.{ROOT_DOMAIN}", "proxied": True},
}

async def sync_dns():
    if not all([CF_API_TOKEN, CF_ZONE_ID, SERVER_PUBLIC_IP]):
        print("❌ DNS Config Missing: Check .env for CF_API_TOKEN, CF_ZONE_ID, SERVER_PUBLIC_IP")
        return

    print(f"📡 Syncing DNS Architecture v3.1 for Zone {CF_ZONE_ID}...")
    
    headers = {
        "Authorization": f"Bearer {CF_API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        # 1. Fetch Existing Records
        existing_records = {}
        try:
            resp = await client.get(
                f"https://api.cloudflare.com/client/v4/zones/{CF_ZONE_ID}/dns_records",
                headers=headers
            )
            resp.raise_for_status()
            for record in resp.json()['result']:
                existing_records[record['name']] = record
        except Exception as e:
            print(f"❌ Failed to fetch existing records: {e}")
            return

        # 2. Create or Update Records
        for name, spec in REQUIRED_RECORDS.items():
            full_name = ROOT_DOMAIN if name == "@" else f"{name}.{ROOT_DOMAIN}"
            
            payload = {
                "type": spec['type'],
                "name": full_name,
                "content": spec['content'],
                "proxied": spec.get('proxied', True),
                "ttl": 1 # Automatic
            }
            
            existing = existing_records.get(full_name)

            if existing:
                # Check if update is needed
                if (existing['type'] != payload['type'] or 
                    existing['content'] != payload['content'] or 
                    existing.get('proxied') != payload.get('proxied')):
                    print(f"   Updating {full_name}...")
                    await client.put(
                        f"https://api.cloudflare.com/client/v4/zones/{CF_ZONE_ID}/dns_records/{existing['id']}",
                        headers=headers,
                        json=payload
                    )
                else:
                    print(f"   ✅ {full_name} is already up to date.")
            else:
                print(f"   Creating {full_name} -> {spec['content']}...")
                await client.post(
                    f"https://api.cloudflare.com/client/v4/zones/{CF_ZONE_ID}/dns_records",
                    headers=headers,
                    json=payload
                )

    print("✅ DNS Architecture Synchronization Complete.")

if __name__ == "__main__":
    asyncio.run(sync_dns())
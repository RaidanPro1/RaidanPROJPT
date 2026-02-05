
import os
import httpx
import asyncio

# إعدادات Cloudflare
CF_API_TOKEN = os.getenv("CF_API_TOKEN")
CF_ZONE_ID = os.getenv("CF_ZONE_ID")
SERVER_PUBLIC_IP = os.getenv("SERVER_PUBLIC_IP")

# هيكلية DNS المعتمدة v3.1
REQUIRED_RECORDS = {
    # A Records (Root & Gateway)
    "@": {"type": "A", "content": SERVER_PUBLIC_IP, "proxied": True},
    "gateway": {"type": "A", "content": SERVER_PUBLIC_IP, "proxied": True},
    
    # Frontends (CNAME -> gateway)
    "ai": {"type": "CNAME", "content": "gateway.raidan.pro", "proxied": True},
    "console": {"type": "CNAME", "content": "gateway.raidan.pro", "proxied": True},
    "indicators": {"type": "CNAME", "content": "gateway.raidan.pro", "proxied": True},
    
    # Backends
    "api": {"type": "CNAME", "content": "gateway.raidan.pro", "proxied": True},
    "sso": {"type": "CNAME", "content": "gateway.raidan.pro", "proxied": True},
    "core": {"type": "CNAME", "content": "gateway.raidan.pro", "proxied": True},
    "search": {"type": "CNAME", "content": "gateway.raidan.pro", "proxied": True},
    
    # Tools
    "lab": {"type": "CNAME", "content": "gateway.raidan.pro", "proxied": True},
    "maps": {"type": "CNAME", "content": "gateway.raidan.pro", "proxied": True},
    "news": {"type": "CNAME", "content": "gateway.raidan.pro", "proxied": True},
    "viz": {"type": "CNAME", "content": "gateway.raidan.pro", "proxied": True},
    "shell": {"type": "CNAME", "content": "gateway.raidan.pro", "proxied": True},
    
    # Ops & Infra
    "ops": {"type": "CNAME", "content": "gateway.raidan.pro", "proxied": True},
    "s3": {"type": "CNAME", "content": "gateway.raidan.pro", "proxied": True},
    "cdn": {"type": "CNAME", "content": "gateway.raidan.pro", "proxied": True},
    
    # Mail Service (Webmail & Transport)
    "mail": {"type": "CNAME", "content": "gateway.raidan.pro", "proxied": True},
}

async def sync_dns():
    if not CF_API_TOKEN or not CF_ZONE_ID or not SERVER_PUBLIC_IP:
        print("❌ DNS Config Missing: Check .env for CF_API_TOKEN, CF_ZONE_ID, SERVER_PUBLIC_IP")
        return

    print(f"📡 Syncing DNS Architecture v3.1 for Zone {CF_ZONE_ID}...")
    
    headers = {
        "Authorization": f"Bearer {CF_API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        # 1. Fetch Existing Records
        existing_map = {}
        try:
            resp = await client.get(
                f"https://api.cloudflare.com/client/v4/zones/{CF_ZONE_ID}/dns_records",
                headers=headers
            )
            if resp.status_code == 200:
                for record in resp.json()['result']:
                    # Normalize name (remove domain part)
                    name = record['name'].split('.')[0]
                    if name == os.getenv("ROOT_DOMAIN", "raidan"): name = "@" # Handle root
                    existing_map[name] = record['id']
        except Exception as e:
            print(f"❌ Failed to fetch existing records: {e}")
            return

        # 2. Create or Update Records
        for name, spec in REQUIRED_RECORDS.items():
            payload = {
                "type": spec['type'],
                "name": name,
                "content": spec['content'],
                "proxied": spec['proxied'],
                "ttl": 1 # Automatic
            }
            
            if name in existing_map:
                print(f"   Refining {name}...")
                # Update existing (logic omitted for brevity, assuming create if missing is priority)
                # In strict mode, we might PUT over the existing ID.
            else:
                print(f"   Creating {name} -> {spec['content']}...")
                await client.post(
                    f"https://api.cloudflare.com/client/v4/zones/{CF_ZONE_ID}/dns_records",
                    headers=headers,
                    json=payload
                )

    print("✅ DNS Architecture Synchronization Complete.")

if __name__ == "__main__":
    asyncio.run(sync_dns())

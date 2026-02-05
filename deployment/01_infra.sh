
#!/bin/bash
echo "🏗️ [PHASE 1] Deploying Infrastructure Foundation..."

# Load Env Vars
set -a
source .env
set +a

# Deploy Core Stack
docker-compose -f deployment/docker-compose.prod.yml up -d postgres redis

echo "⏳ Waiting for Database Initialization..."
sleep 15

# Run Check Script
python3 deployment/check_db.py

if [ $? -eq 0 ]; then
    echo "✅ [PHASE 1] Infrastructure Active & Healthy."
else
    echo "❌ [PHASE 1] Database Health Check Failed."
    exit 1
fi

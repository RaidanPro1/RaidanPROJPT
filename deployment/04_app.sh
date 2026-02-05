
#!/bin/bash
echo "🚀 [PHASE 3] Deploying Application Layer..."

# Deploy Backend & Frontend
docker-compose -f deployment/docker-compose.prod.yml up -d backend frontend evolution-api

echo "⏳ Waiting for App Startup..."
sleep 10

echo "✅ [PHASE 3] Application Layer Online."

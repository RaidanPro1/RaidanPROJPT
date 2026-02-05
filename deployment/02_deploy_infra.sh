
#!/bin/bash
# RaidanPro Infrastructure Deployer v3.1
# Network: Sovereign Net (172.28.0.0/16)

echo "🌐 [NET] Initializing Sovereign Network Topology..."

# 1. Create the Bridge Network explicitly to ensure Subnet persistence
docker network inspect sovereign_net >/dev/null 2>&1 || \
    docker network create --driver bridge --subnet 172.28.0.0/16 --gateway 172.28.0.1 sovereign_net

echo "✅ Network 'sovereign_net' active at 172.28.0.1"

# 2. Deploy Core Infrastructure (Using the unified master compose file)
echo "🏗️  Deploying Core Stack (Static IPs)..."
docker-compose -f docker-compose.yml up -d

echo "📧 [MAIL] Sovereign Mail Service (RaidanMail) is managed via docker-compose at 172.28.0.50."

echo "✅ Infrastructure Deployment Complete."

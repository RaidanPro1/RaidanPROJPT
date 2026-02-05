
#!/bin/bash
# Operation Scorched Earth - RaidanPro
# WARNING: This script deletes EVERYTHING related to Docker.

echo "🔥 [PHASE 0] Initiating Scorched Earth Protocol..."

# 1. Stop all containers
echo "Stopping all containers..."
docker stop $(docker ps -a -q) 2>/dev/null

# 2. Prune everything
echo "Pruning system..."
docker system prune -a -f --volumes

# 3. Clean physical directories
echo "Cleaning data directories..."
rm -rf /opt/raidan/data/*
mkdir -p /opt/raidan/data/{postgres,redis,ollama,logs}

# 4. Install Dependencies
echo "Installing System Dependencies (Ubuntu 24.04)..."
apt-get update && apt-get install -y \
    curl git python3 python3-pip python3-venv \
    ffmpeg poppler-utils ufw fail2ban

echo "✅ [PHASE 0] Complete. Environment is sterile."

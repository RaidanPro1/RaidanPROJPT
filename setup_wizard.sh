#!/bin/bash
set -e

# ==============================================================================
# 🇾🇪 RAIDAN PRO HYBRID BOOTSTRAPPER v3.2 (Localhost Friendly)
# ==============================================================================

# Colors
GOLD='\033[0;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}
██████╗  █████╗ ██╗██████╗  █████╗ ███╗   ██╗
██╔══██╗██╔══██╗██║██╔══██╗██╔══██╗████╗  ██║
██████╔╝███████║██║██║  ██║███████║██╔██╗ ██║
██╔══██╗██╔══██║██║██║  ██║██╔══██║██║╚██╗██║
██║  ██║██║  ██║██║██████╔╝██║  ██║██║ ╚████║
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝
${NC}"
echo -e "${GOLD}>> Initiating Sovereign Hybrid Deployment...${NC}"

if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}[CRITICAL] Must run as root.${NC}"
   exit 1
fi

# ==============================================================================
# PHASE 0: TOTAL PURGE (SCORCHED EARTH)
# ==============================================================================
echo -e "${RED}[PHASE 0] Executing Total Purge Protocol...${NC}"

# 1. Stop Services
systemctl stop ollama 2>/dev/null || true
systemctl stop docker 2>/dev/null || true

# 2. Kill Ports (Cleanup)
fuser -k 80/tcp 443/tcp 11434/tcp 5432/tcp 8000/tcp 8080/tcp 2>/dev/null || true

# 3. Wipe Docker
if command -v docker &> /dev/null; then
    systemctl start docker
    echo "   - Pruning Docker containers and volumes..."
    docker stop $(docker ps -a -q) 2>/dev/null || true
    docker system prune -a -f --volumes 2>/dev/null || true
fi

# 4. Clean Network Configs
sed -i '/internal.raidan/d' /etc/hosts

echo -e "${GREEN}   ✅ Environment Sterilized.${NC}"

# ==============================================================================
# PHASE 1: NATIVE INTELLIGENCE (HOST LAYER)
# ==============================================================================
echo -e "${BLUE}[PHASE 1] Installing Native Intelligence Core...${NC}"

# 1. Update Base
apt-get update && apt-get install -y curl git ufw pciutils

# 2. Install Docker (Host)
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl start docker
    systemctl enable docker
fi

# 3. Install Ollama (Native)
if ! command -v ollama &> /dev/null; then
    echo "   - Installing Ollama (CPU/GPU Native)..."
    curl -fsSL https://ollama.com/install.sh | sh
    
    # Configure Bind Address to allow Docker containers to access Host Ollama
    mkdir -p /etc/systemd/system/ollama.service.d
    echo "[Service]" > /etc/systemd/system/ollama.service.d/environment.conf
    echo "Environment=\"OLLAMA_HOST=0.0.0.0:11434\"" >> /etc/systemd/system/ollama.service.d/environment.conf
    echo "Environment=\"OLLAMA_ORIGINS=*\"" >> /etc/systemd/system/ollama.service.d/environment.conf
    
    systemctl daemon-reload
    systemctl restart ollama
    echo -e "${GREEN}   ✅ Ollama Active on Host (0.0.0.0:11434).${NC}"
else
    echo -e "${GOLD}   - Ollama already installed. Ensuring service is active...${NC}"
    systemctl restart ollama
fi

# ==============================================================================
# PHASE 2: SOVEREIGN NETWORK (DOCKER LAYER)
# ==============================================================================
echo -e "${BLUE}[PHASE 2] Establishing Sovereign Network...${NC}"

docker network create --driver bridge --subnet 172.28.0.0/16 --gateway 172.28.0.1 sovereign_net 2>/dev/null || true
echo -e "${GREEN}   ✅ Network 172.28.0.0/16 Established.${NC}"

# ==============================================================================
# PHASE 3: LAUNCH WIZARD
# ==============================================================================
echo -e "${GOLD}[PHASE 3] Launching Tactical Setup Wizard...${NC}"

# Detect IP or fallback to localhost
export SERVER_PUBLIC_IP=$(curl -s --connect-timeout 2 ifconfig.me)
if [ -z "$SERVER_PUBLIC_IP" ]; then
    echo -e "${GOLD}   ⚠️  No public IP detected. Defaulting to Localhost Mode (127.0.0.1).${NC}"
    export SERVER_PUBLIC_IP="127.0.0.1"
fi

# Check if image exists, if not build it
if [[ "$(docker images -q raidanpro/installer:latest 2> /dev/null)" == "" ]]; then
  echo -e "${BLUE}   - Image 'raidanpro/installer' not found locally. Building from source...${NC}"
  # Ensure backend Dockerfile exists
  if [ ! -f backend/Dockerfile ]; then
     echo -e "${RED}   [ERROR] backend/Dockerfile not found. Cannot build installer.${NC}"
     exit 1
  fi
  docker build -t raidanpro/installer:latest ./backend
  echo -e "${GREEN}   ✅ Installer Image Built.${NC}"
fi

# Run the installer container
# Mapped 8000:8000 for direct localhost access
docker run -d \
  --name raidan_wizard \
  --network sovereign_net \
  -p 8000:8000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v $(pwd):/app/install_context \
  -e INSTALLATION_MODE=true \
  -e SERVER_PUBLIC_IP=$SERVER_PUBLIC_IP \
  raidanpro/installer:latest

echo -e "\n${GOLD}============================================================${NC}"
echo -e "   حياكم الله في نظام ريدان برو"
echo -e "   RaidanPro Hybrid Installer is Ready."
echo -e "   👉 Access the Wizard UI: http://${SERVER_PUBLIC_IP}:8000/"
echo -e "   (Installer Mode Active - No Domain Required)"
echo -e "${GOLD}============================================================${NC}\n"

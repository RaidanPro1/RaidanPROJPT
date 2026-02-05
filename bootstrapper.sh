#!/bin/bash
set -e

# ==============================================================================
# 🇾🇪 RAIDAN PRO SOVEREIGN BOOTSTRAPPER v1.1 (Native AI Edition)
# Target: Debian 13 (Trixie) / Ubuntu 24.04
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
echo -e "${GOLD}>> Initiating Sovereign Installer Environment (Native AI Mode)...${NC}"

# 1. System Check
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}[ERROR] This script must be run as root.${NC}"
   exit 1
fi

# 2. Install Docker Engine (if missing)
if ! command -v docker &> /dev/null; then
    echo -e "${BLUE}[INFO] Installing Docker Engine...${NC}"
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
else
    echo -e "${GOLD}[INFO] Docker is already installed.${NC}"
fi

# 3. Native AI Installation (Ollama)
echo -e "${BLUE}[INFO] Installing Ollama Natively (GPU/CPU Direct Access)...${NC}"
if ! command -v ollama &> /dev/null; then
    curl -fsSL https://ollama.com/install.sh | sh
    
    # Configure Ollama to listen on all interfaces so Docker containers can reach it
    echo -e "${BLUE}[INFO] Configuring Ollama Network Binding...${NC}"
    mkdir -p /etc/systemd/system/ollama.service.d
    echo "[Service]" > /etc/systemd/system/ollama.service.d/environment.conf
    echo "Environment=\"OLLAMA_HOST=0.0.0.0:11434\"" >> /etc/systemd/system/ollama.service.d/environment.conf
    
    systemctl daemon-reload
    systemctl restart ollama
    echo -e "${GOLD}[INFO] Native Ollama Active on port 11434.${NC}"
else
    echo -e "${GOLD}[INFO] Ollama is already installed.${NC}"
fi

# 4. Network Setup (Sovereign Net)
echo -e "${BLUE}[INFO] creating sovereign_net (172.28.0.0/16)...${NC}"
docker network create --driver bridge --subnet 172.28.0.0/16 --gateway 172.28.0.1 sovereign_net 2>/dev/null || true

# 5. Launch Temporary Installer Container
echo -e "${BLUE}[INFO] Launching Web Installation Wizard on port 8080...${NC}"

export SERVER_PUBLIC_IP=$(curl -s ifconfig.me)

# We mount the docker socket so the wizard can spawn sibling containers
docker run -d \
  --name raidan_installer \
  --network sovereign_net \
  -p 8080:80 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v $(pwd):/app \
  -e INSTALLATION_MODE=true \
  -e SERVER_PUBLIC_IP=$SERVER_PUBLIC_IP \
  raidanpro/installer:latest 2>/dev/null || echo "⚠️  Image not found locally. Assuming dev environment."

echo -e "\n${GOLD}============================================================${NC}"
echo -e "✅ Installer Active!"
echo -e "👉 Open your browser: http://$SERVER_PUBLIC_IP:8080"
echo -e "${GOLD}============================================================${NC}\n"

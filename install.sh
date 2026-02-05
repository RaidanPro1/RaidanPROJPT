#!/bin/bash
set -e

# ==============================================================================
# 🇾🇪 RAIDAN PRO MASTER INSTALLER v3.2 (Fail-Safe Protocol)
# Target: Debian 13 (Trixie) / Ubuntu 24.04
# Architecture: Native AI (Host) + Docker Services (Static IPs)
# ==============================================================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_err() { echo -e "${RED}[ERROR]${NC} $1"; }

if [[ $EUID -ne 0 ]]; then
   log_err "This script must be run as root (sudo)."
   exit 1
fi

echo -e "${BLUE}
██████╗  █████╗ ██╗██████╗  █████╗ ███╗   ██╗
██╔══██╗██╔══██╗██║██╔══██╗██╔══██╗████╗  ██║
██████╔╝███████║██║██║  ██║███████║██╔██╗ ██║
██╔══██╗██╔══██║██║██║  ██║██╔══██║██║╚██╗██║
██║  ██║██║  ██║██║██████╔╝██║  ██║██║ ╚████║
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝
${NC}"
echo -e "${YELLOW}>> Initiating Protocol v3.2: Sovereign Architecture Build...${NC}\n"

# ==============================================================================
# PHASE 0: SCORCHED EARTH (TOTAL PURGE)
# ==============================================================================
log_warn "[PHASE 0] Executing Total System Purge..."

# 1. Stop Services
systemctl stop ollama 2>/dev/null || true
systemctl stop docker 2>/dev/null || true

# 2. Kill Critical Ports
log_info "Sanitizing network ports (80, 443, 5432, 11434)..."
fuser -k 80/tcp 443/tcp 11434/tcp 5432/tcp 8000/tcp 3000/tcp 2>/dev/null || true

# 3. Clean Docker
if command -v docker &> /dev/null; then
    systemctl start docker
    log_info "Pruning Docker system..."
    docker stop $(docker ps -a -q) 2>/dev/null || true
    docker system prune -a -f --volumes 2>/dev/null || true
    # Remove custom network if exists to recreate it cleanly
    docker network rm sovereign_net 2>/dev/null || true
fi

# 4. Clean Host Configs
sed -i '/internal.raidan/d' /etc/hosts

log_success "Environment Sterilized."

# ==============================================================================
# PHASE 1: NATIVE CORE INSTALLATION (HOST LAYER)
# ==============================================================================
log_info "[PHASE 1] Installing Native Intelligence Core..."

# 1. Dependencies
apt-get update && apt-get install -y curl git ufw pciutils python3-venv python3-pip ffmpeg

# 2. Install Docker
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
fi

# 3. Install & Configure Native Ollama
if ! command -v ollama &> /dev/null; then
    log_info "Installing Ollama (Native)..."
    curl -fsSL https://ollama.com/install.sh | sh
fi

# Configure Ollama Bind Address (Crucial for Docker Access)
log_info "Configuring Ollama Bind (0.0.0.0)..."
mkdir -p /etc/systemd/system/ollama.service.d
cat <<EOF > /etc/systemd/system/ollama.service.d/environment.conf
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
Environment="OLLAMA_ORIGINS=*"
EOF
systemctl daemon-reload
systemctl restart ollama

# 4. Pull Models
log_info "Pulling Intelligence Models (Host NVMe)..."
# We pull in background to save time, check later
ollama pull qwen2.5:14b &
ollama pull nomic-embed-text &
wait

# 5. Legal Injection (Python Script)
log_info "Injecting Yemeni Legal Protocol..."
pip3 install requests --break-system-packages
python3 legal_hardener.py

log_success "Native Core & Brain Ready."

# ==============================================================================
# PHASE 2: SOVEREIGN NETWORK & CONFIG GENERATION
# ==============================================================================
log_info "[PHASE 2] Establishing Network & Configuration..."

# 1. Create Static Network (172.28.0.0/16)
docker network create --driver bridge --subnet 172.28.0.0/16 --gateway 172.28.0.1 sovereign_net 2>/dev/null || true
log_success "Network 'sovereign_net' active at 172.28.0.1"

# 2. Generate .env File
SERVER_IP=$(curl -s ifconfig.me || echo "127.0.0.1")
DB_PASS=$(openssl rand -base64 12)
SECRET_KEY=$(openssl rand -hex 32)

cat <<EOF > .env
# 🇾🇪 RaidanPro Auto-Generated Config
APP_ENV=production
SERVER_PUBLIC_IP=${SERVER_IP}
ROOT_DOMAIN=raidan.pro

# Database (The Vault)
DB_USER=raidan_root
DB_PASSWORD=${DB_PASS}
DB_NAME=raidan_core

# Security
SECRET_KEY=${SECRET_KEY}
ENCRYPTION_KEY=$(openssl rand -hex 16)

# Hybrid Intelligence
# Docker containers connect to host via the gateway IP
OLLAMA_HOST=http://172.28.0.1:11434
# Add your Gemini Key here manually if needed
GEMINI_API_KEY=""
EOF

log_success "Configuration (.env) Generated."

# ==============================================================================
# PHASE 3: DOCKER DEPLOYMENT (CONTAINER LAYER)
# ==============================================================================
log_info "[PHASE 3] Deploying Sovereign Services..."

# Build & Up
# Force rebuild to ensure Dockerfile changes are picked up
docker compose up -d --build

log_success "All Services Deployed."

# ==============================================================================
# FINAL REPORT
# ==============================================================================
echo -e "\n${BLUE}============================================================${NC}"
echo -e "   حياكم الله في منصة ريدان برو السيادية."
echo -e "   تم تجهيز العقل الإلكتروني وتدريعه بالقوانين اليمنية النافذة."
echo -e "   النظام الآن تحت تصرفكم."
echo -e "${BLUE}============================================================${NC}"
echo -e "   🌐 UI Access:      http://${SERVER_IP}"
echo -e "   🧠 AI API:         http://${SERVER_IP}:8000"
echo -e "   🔒 Database:       172.28.0.10 (Internal)"
echo -e "   🔑 Root DB Pass:   ${DB_PASS}"
echo -e "${BLUE}============================================================${NC}\n"

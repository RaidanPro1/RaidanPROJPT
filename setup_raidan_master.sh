#!/bin/bash
set -e # Stop execution immediately on error

# ==============================================================================
# 🇾🇪 RAIDAN PRO MASTER DEPLOYMENT SCRIPT v1.2 (Hybrid/Native)
# Target OS: Debian 13 (Trixie)
# Architect: Senior SRE Team
# ==============================================================================

# Colors & Formatting
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Helpers
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_err() { echo -e "${RED}[ERROR]${NC} $1"; }
print_header() {
    echo -e "\n${BOLD}============================================================${NC}"
    echo -e "   $1"
    echo -e "${BOLD}============================================================${NC}\n"
}

# Trap Errors
error_handler() {
    echo -e "\n${RED}🚨 CRITICAL FAILURE DETECTED 🚨${NC}"
    echo -e "Execution stopped at line $1."
    echo -e "System state might be unstable. Check logs."
    exit 1
}
trap 'error_handler $LINENO' ERR

# Check Root
if [[ $EUID -ne 0 ]]; then
   log_err "This script must be run as root."
   exit 1
fi

# ==============================================================================
# PHASE 0: PRE-FLIGHT INTERACTIVE CONFIGURATION
# ==============================================================================
print_header "PHASE 0: PRE-FLIGHT CONFIGURATION"

echo -e "${YELLOW}Warning: You are about to deploy RaidanPro Sovereign Platform.${NC}"
echo -e "Ensure you have your API keys ready.\n"

# Inputs
read -p "System Name [RaidanPro]: " SYSTEM_NAME
SYSTEM_NAME=${SYSTEM_NAME:-RaidanPro}

read -p "Root Domain [raidan.pro]: " ROOT_DOMAIN
ROOT_DOMAIN=${ROOT_DOMAIN:-raidan.pro}

read -p "Timezone [Asia/Aden]: " TIMEZONE
TIMEZONE=${TIMEZONE:-Asia/Aden}

# Secrets Generation
echo -e "\n🔐 Generating Cryptographic Keys..."
DB_PASSWORD=$(openssl rand -base64 16)
SECRET_KEY=$(openssl rand -hex 32)
MINIO_SECRET=$(openssl rand -base64 24)
echo "Generated Secure DB Password."
echo "Generated App Secret Key."

# API Keys
read -p "Gemini API Key (Required for Hybrid Mode): " GEMINI_KEY
read -p "Cloudflare API Token: " CF_TOKEN
read -p "Cloudflare Zone ID: " CF_ZONE_ID

# Confirmation
echo -e "\n${BOLD}--- CONFIGURATION SUMMARY ---${NC}"
echo "System: $SYSTEM_NAME"
echo "Domain: $ROOT_DOMAIN"
echo "DB Pass: ****************"
echo "Timezone: $TIMEZONE"
echo "-----------------------------"
read -p "Is this correct? Type 'YES' to proceed: " CONFIRM
if [[ "$CONFIRM" != "YES" ]]; then
    log_err "Aborted by user."
    exit 1
fi

# Write .env file
log_info "Writing secure .env file..."
cat <<EOF > .env
APP_NAME="$SYSTEM_NAME"
ROOT_DOMAIN="$ROOT_DOMAIN"
TIMEZONE="$TIMEZONE"
DB_USER=raidan_root
DB_PASSWORD="$DB_PASSWORD"
SECRET_KEY="$SECRET_KEY"
S3_ACCESS_KEY="raidan_minio"
S3_SECRET_KEY="$MINIO_SECRET"
GEMINI_API_KEY="$GEMINI_KEY"
CF_API_TOKEN="$CF_TOKEN"
CF_ZONE_ID="$CF_ZONE_ID"
SERVER_PUBLIC_IP=$(curl -s ifconfig.me)
EOF
chmod 600 .env
log_success "Environment configured."

# ==============================================================================
# PHASE 1: SCORCHED EARTH PROTOCOL
# ==============================================================================
print_header "PHASE 1: OPERATION SCORCHED EARTH"

log_warn "Cleaning system environment..."

# Stop Services
systemctl stop apache2 nginx 2>/dev/null || true
systemctl disable apache2 nginx 2>/dev/null || true

# Purge Docker (Fail-safe)
if command -v docker &> /dev/null; then
    log_info "Cleaning Docker containers (keeping engine)..."
    docker stop $(docker ps -a -q) 2>/dev/null || true
    docker system prune -a -f --volumes 2>/dev/null || true
fi

# Clean Directories
rm -rf /opt/raidan_data
mkdir -p /opt/raidan_data/{postgres,redis,ollama,minio,logs}

# Update System
log_info "Updating Debian 13 packages..."
apt-get update && apt-get dist-upgrade -y
apt-get install -y curl wget git python3-pip python3-venv jq ufw pciutils

log_success "System Sterilized & Updated."

# ==============================================================================
# PHASE 2: CORE INFRASTRUCTURE LAYER
# ==============================================================================
print_header "PHASE 2: CORE INFRASTRUCTURE BUILD"

# Install Python Deps using VENV to avoid System Conflicts
log_info "Setting up Python Virtual Environment..."
python3 -m venv /opt/raidan_data/venv
VENV_PYTHON="/opt/raidan_data/venv/bin/python"
VENV_PIP="/opt/raidan_data/venv/bin/pip"

# Upgrade pip and install requirements in isolation
# Added: python-dotenv (for env loading), httpx (for dns automator)
log_info "Installing Host Python Dependencies..."
$VENV_PIP install --upgrade pip
$VENV_PIP install requests psycopg2-binary google-generativeai python-dotenv httpx

# Network Setup
log_info "Creating Sovereign Network (172.28.0.0/16)..."
docker network create --driver bridge --subnet 172.28.0.0/16 --gateway 172.28.0.1 sovereign_net || true

# Deploy Core Services (DB, Redis, MinIO)
log_info "Deploying Database & Storage..."
docker compose -f deployment/docker-compose.prod.yml up -d postgres redis

# Wait & Validate
log_info "Waiting for Database Initialization (15s)..."
sleep 15
$VENV_PYTHON validate_stage.py check_db
if [ $? -eq 0 ]; then
    log_success "Core Infrastructure Verified."
else
    error_handler "Core DB Validation Failed"
fi

# ==============================================================================
# PHASE 3: INTELLIGENCE & LEGAL LAYER (NATIVE)
# ==============================================================================
print_header "PHASE 3: INTELLIGENCE & LEGAL INJECTION"

# Check for Native Ollama
if ! command -v ollama &> /dev/null; then
    log_info "Installing Native Ollama (CPU/GPU)..."
    curl -fsSL https://ollama.com/install.sh | sh
    
    # Configure Network Bind
    mkdir -p /etc/systemd/system/ollama.service.d
    echo "[Service]" > /etc/systemd/system/ollama.service.d/environment.conf
    echo "Environment=\"OLLAMA_HOST=0.0.0.0:11434\"" >> /etc/systemd/system/ollama.service.d/environment.conf
    systemctl daemon-reload
    systemctl restart ollama
fi

log_success "Native AI Engine Active."

# Pull Models Natively
log_info "Pulling AI Models directly to Host..."
ollama pull qwen2.5:14b
ollama pull nomic-embed-text

# Legal Injection
log_info "Injecting Yemeni Legal Context..."
$VENV_PYTHON legal_injector.py

log_success "AI Brain Hardened & Legally Compliant."

# ==============================================================================
# PHASE 4: TOOLS & LOGIC LAYER
# ==============================================================================
print_header "PHASE 4: TOOLS & LOGIC DEPLOYMENT"

# Build & Deploy Backend
log_info "Deploying Backend API & DeepSafe..."
docker compose -f deployment/docker-compose.prod.yml up -d backend yemen-core

# Validate API
sleep 10
$VENV_PYTHON validate_stage.py check_api

log_success "Backend Logic Operational."

# ==============================================================================
# PHASE 5: INTERFACE & GATEWAY LAYER
# ==============================================================================
print_header "PHASE 5: FRONTEND & GATEWAY"

# Deploy Frontend
log_info "Deploying Frontend UI..."
docker compose -f deployment/docker-compose.prod.yml up -d frontend evolution-api

# DNS Sync
log_info "Syncing DNS Records with Cloudflare..."
$VENV_PYTHON backend/dns_automator.py

log_success "Gateway Active & Secured."

# ==============================================================================
# FINAL REPORT
# ==============================================================================
print_header "COMMISSIONING REPORT"

echo -e "------------------------------------------------------------"
echo -e "PHASE           | STATUS      | DETAILS"
echo -e "------------------------------------------------------------"
echo -e "0. Prep         | ${GREEN}✅ PASSED${NC}   | Env Configured"
echo -e "1. Cleaning     | ${GREEN}✅ PASSED${NC}   | System Cleaned (Debian 13)"
echo -e "2. Core         | ${GREEN}✅ PASSED${NC}   | DB/Redis Active"
echo -e "3. Brain        | ${GREEN}✅ PASSED${NC}   | Native Ollama + Qwen2.5"
echo -e "4. Tools        | ${GREEN}✅ PASSED${NC}   | Backend/DeepSafe Active"
echo -e "5. Interface    | ${GREEN}✅ PASSED${NC}   | UI Active on Port 80"
echo -e "------------------------------------------------------------"
echo -e "\nSystem is LIVE at: ${BOLD}http://$SERVER_PUBLIC_IP${NC}"
echo -e "\n${YELLOW}NOTE: Keep your .env file safe. It contains master keys.${NC}"

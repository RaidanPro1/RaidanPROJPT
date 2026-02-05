
#!/bin/bash
set -e # Stop execution immediately on error

# ==============================================================================
# 🇾🇪 RAIDAN PRO MASTER DEPLOYMENT SCRIPT v1.0
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
    log_info "Removing existing Docker installation..."
    docker stop $(docker ps -a -q) 2>/dev/null || true
    docker system prune -a -f --volumes 2>/dev/null || true
    apt-get purge -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    rm -rf /var/lib/docker
    rm -rf /etc/docker
fi

# Clean Directories
rm -rf /opt/raidan_data
mkdir -p /opt/raidan_data/{postgres,redis,ollama,minio,logs}

# Update System
log_info "Updating Debian 13 packages..."
apt-get update && apt-get dist-upgrade -y
apt-get install -y curl wget git python3-pip python3-venv jq ufw

log_success "System Sterilized & Updated."

# ==============================================================================
# PHASE 2: CORE INFRASTRUCTURE LAYER
# ==============================================================================
print_header "PHASE 2: CORE INFRASTRUCTURE BUILD"

# Install Docker
log_info "Installing Docker Engine..."
curl -fsSL https://get.docker.com | sh

# Install Python Deps for Validation
pip3 install requests psycopg2-binary google-generativeai --break-system-packages

# Network Setup
log_info "Creating Sovereign Network (172.28.0.0/16)..."
docker network create --driver bridge --subnet 172.28.0.0/16 --gateway 172.28.0.1 sovereign_net || true

# Deploy Core Services
log_info "Deploying Database & Storage..."
docker compose up -d postgres redis minio

# Wait & Validate
log_info "Waiting for Database Initialization (15s)..."
sleep 15
python3 validate_stage.py check_db
if [ $? -eq 0 ]; then
    log_success "Core Infrastructure Verified."
else
    error_handler "Core DB Validation Failed"
fi

# ==============================================================================
# PHASE 3: INTELLIGENCE & LEGAL LAYER
# ==============================================================================
print_header "PHASE 3: INTELLIGENCE & LEGAL INJECTION"

# Deploy Ollama
log_info "Deploying AI Neural Engine (Ollama)..."
docker compose up -d ollama

# Pull Models
log_info "Pulling AI Models (This may take time)..."
docker exec raidan_brain ollama pull qwen2.5:14b
docker exec raidan_brain ollama pull nomic-embed-text

# Legal Injection
log_info "Injecting Yemeni Legal Context..."
python3 legal_injector.py
# Check AI Health
python3 validate_stage.py check_ai

log_success "AI Brain Hardened & Legally Compliant."

# ==============================================================================
# PHASE 4: TOOLS & LOGIC LAYER
# ==============================================================================
print_header "PHASE 4: TOOLS & LOGIC DEPLOYMENT"

# Build & Deploy Backend
log_info "Deploying Backend API & DeepSafe..."
docker compose up -d backend deepsafe yemen-core-db

# Validate API
sleep 10
python3 validate_stage.py check_api

log_success "Backend Logic Operational."

# ==============================================================================
# PHASE 5: INTERFACE & GATEWAY LAYER
# ==============================================================================
print_header "PHASE 5: FRONTEND & GATEWAY"

# Deploy Traefik & Frontend
log_info "Deploying Traefik Gateway & UI..."
docker compose up -d traefik frontend authentik-server

# DNS Sync
log_info "Syncing DNS Records with Cloudflare..."
python3 backend/dns_automator.py

# Validate Gateway
sleep 5
python3 validate_stage.py check_ssl

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
echo -e "2. Core         | ${GREEN}✅ PASSED${NC}   | DB/Cache/S3 Active"
echo -e "3. Brain        | ${GREEN}✅ PASSED${NC}   | Qwen2.5 + Legal Context"
echo -e "4. Tools        | ${GREEN}✅ PASSED${NC}   | Backend/DeepSafe Active"
echo -e "5. Interface    | ${GREEN}✅ PASSED${NC}   | Traefik/SSL Verified"
echo -e "------------------------------------------------------------"
echo -e "\nSystem is LIVE at: ${BOLD}https://gateway.$ROOT_DOMAIN${NC}"
echo -e "Root Dashboard:    ${BOLD}https://console.$ROOT_DOMAIN${NC}"
echo -e "AI Interface:      ${BOLD}https://ai.$ROOT_DOMAIN${NC}"
echo -e "\n${YELLOW}NOTE: Keep your .env file safe. It contains master keys.${NC}"

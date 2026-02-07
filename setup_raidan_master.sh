#!/bin/bash
set -e # Stop execution immediately on error

# ==============================================================================
# 🇾🇪 RAIDAN PRO MASTER DEPLOYMENT SCRIPT v2.0 (Agentic Edition)
# Target OS: Debian 13 (Trixie) / Ubuntu 24.04
# ==============================================================================

# Colors & Formatting
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Helpers
log_phase() {
    echo -e "\n${BOLD}${BLUE}============================================================${NC}"
    echo -e "  PHASE $1: $2"
    echo -e "${BOLD}${BLUE}============================================================${NC}\n"
}
log_success() { echo -e "${GREEN}✅ SUCCESS:${NC} $1"; }
log_error() { echo -e "${RED}❌ FAILED:${NC} $1"; exit 1; }
log_info() { echo -e "   - $1"; }

# Trap Errors
error_handler() {
    log_error "Execution stopped at line $1. System state might be unstable."
}
trap 'error_handler $LINENO' ERR

# Check Root
if [[ $EUID -ne 0 ]]; then
   log_error "This script must be run as root."
fi

# ==============================================================================
# PHASE 1: INTERACTIVE CONFIGURATION
# ==============================================================================
log_phase 1 "INTERACTIVE CONFIGURATION & .ENV GENERATION"

echo -e "${YELLOW}Welcome to the RaidanPro Sovereign Platform deployment orchestrator.${NC}"
read -p "Enter Root Domain [raidan.pro]: " ROOT_DOMAIN
ROOT_DOMAIN=${ROOT_DOMAIN:-raidan.pro}
read -s -p "Enter a secure DB Password (or press Enter to auto-generate): " DB_PASSWORD
if [ -z "$DB_PASSWORD" ]; then
    DB_PASSWORD=$(openssl rand -base64 16)
    echo -e "\nAuto-generated a secure database password."
fi
read -p "Enter your Gemini API Key (for Hybrid Intelligence): " GEMINI_KEY
read -p "Enter your Cloudflare API Token: " CF_TOKEN
read -p "Enter your Cloudflare Zone ID for '$ROOT_DOMAIN': " CF_ZONE_ID

# Write .env file
log_info "Writing secure .env file..."
cat <<EOF > .env
# RaidanPro Auto-Generated Config v2.0
APP_ENV=production
SERVER_PUBLIC_IP=$(curl -s ifconfig.me)
ROOT_DOMAIN=${ROOT_DOMAIN}
DB_USER=raidan_root
DB_PASSWORD=${DB_PASSWORD}
SECRET_KEY=$(openssl rand -hex 32)
GEMINI_API_KEY=${GEMINI_KEY}
CF_API_TOKEN=${CF_TOKEN}
CF_ZONE_ID=${CF_ZONE_ID}
OLLAMA_HOST=http://172.28.0.1:11434
EOF
chmod 600 .env
log_success ".env file created and secured."

# ==============================================================================
# PHASE 2: SYSTEM DIAGNOSTICS & PREREQUISITES
# ==============================================================================
log_phase 2 "SYSTEM DIAGNOSTICS & PREREQUISITES"
bash deployment/00_wipe.sh || log_error "System wipe protocol failed."
log_success "System sterilized & prerequisites installed."

# ==============================================================================
# PHASE 3: NATIVE OLLAMA & MODEL PULL
# ==============================================================================
log_phase 3 "NATIVE OLLAMA SETUP & MODEL PULL"
bash deployment/02_brain.sh || log_error "Native AI setup failed."
log_success "Native AI Core is ready and models are pulled."

# ==============================================================================
# PHASE 4: DOCKER DEPLOYMENT (CORE SERVICES)
# ==============================================================================
log_phase 4 "DOCKER CORE SERVICES DEPLOYMENT"
bash deployment/02_deploy_infra.sh || log_error "Core services deployment failed."
log_info "Waiting for database to initialize (15s)..."
sleep 15
pip3 install -q psycopg2-binary requests python-dotenv --break-system-packages
python3 deployment/validate_stage.py check_db || log_error "DB validation failed."
log_success "Core database and network services are active."

# ==============================================================================
# PHASE 5: LEGAL COMPLIANCE HARDENING
# ==============================================================================
log_phase 5 "LEGAL COMPLIANCE HARDENING"
python3 deployment/03_legal_hardening.py || log_error "Legal hardening failed."
log_success "AI models hardened with Sovereign Constitution."

# ==============================================================================
# PHASE 6: APPLICATION DEPLOYMENT
# ==============================================================================
log_phase 6 "APPLICATION LAYER DEPLOYMENT"
bash deployment/04_app.sh || log_error "Application deployment failed."
log_info "Waiting for application startup (10s)..."
sleep 10
python3 deployment/validate_stage.py check_api || log_error "API validation failed."
log_success "Application layer is online."

# ==============================================================================
# PHASE 7: DNS & EMAIL AUTOMATION
# ==============================================================================
log_phase 7 "DNS & EMAIL AUTOMATION"
log_info "Syncing DNS records with Cloudflare..."
pip3 install -q httpx --break-system-packages
python3 backend/dns_automator.py || log_error "DNS automation failed."
log_info "Deploying Mailcow service..."
docker compose -f docker-compose.mailcow.yml up -d 2>/dev/null || log_info "Mailcow deployment skipped or already running."
log_success "DNS and routing configured."

# ==============================================================================
# PHASE 8: FINAL LOCKDOWN & HANDOVER
# ==============================================================================
log_phase 8 "FINAL LOCKDOWN & HANDOVER"
pip3 install -q bcrypt --break-system-packages
python3 deployment/seed_root.py || log_error "Root user seeding failed."
bash deployment/06_lockdown.sh || log_error "System lockdown failed."

# Final Report
log_phase "✓" "DEPLOYMENT COMPLETE"
cat deployment_report.md
echo -e "\n${BOLD}${GREEN}RAIDANPRO SOVEREIGN PLATFORM IS NOW OPERATIONAL.${NC}"

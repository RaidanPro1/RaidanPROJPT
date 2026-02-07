#!/bin/bash
set -e # Stop execution immediately on error

# ==============================================================================
# 🇾🇪 RAIDAN PRO MASTER DEPLOYMENT ORCHESTRATOR v1.0
# ==============================================================================

# Colors & Formatting
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'
BOLD='\033[1m'

# Log functions
log_phase() {
    echo -e "\n${BOLD}${BLUE}============================================================${NC}"
    echo -e "  PHASE $1: $2"
    echo -e "${BOLD}${BLUE}============================================================${NC}\n"
}
log_success() { echo -e "${GREEN}✅ SUCCESS:${NC} $1"; }
log_error() { echo -e "${RED}❌ FAILED:${NC} $1"; exit 1; }
log_info() { echo -e "   - $1"; }

# Pre-flight check
if [[ $EUID -ne 0 ]]; then
   log_error "This script must be run as root."
fi

# Orchestration logic
main() {
    # PHASE 0: SCORCHED EARTH
    log_phase 0 "SCORCHED EARTH"
    log_info "Wiping existing Docker environment and data..."
    bash deployment/00_wipe.sh || log_error "Scorched Earth Protocol failed."
    log_success "Environment sterilized."

    # PHASE 1: INFRASTRUCTURE DEPLOYMENT
    log_phase 1 "INFRASTRUCTURE DEPLOYMENT"
    log_info "Creating sovereign network and deploying core services..."
    bash deployment/02_deploy_infra.sh || log_error "Infrastructure deployment failed."
    log_info "Waiting for database to initialize (15s)..."
    sleep 15
    log_success "Core infrastructure is active."

    # PHASE 2: NATIVE INTELLIGENCE INJECTION
    log_phase 2 "NATIVE INTELLIGENCE INJECTION"
    log_info "Setting up host-native Ollama and pulling models..."
    bash deployment/02_brain.sh || log_error "Native AI setup failed."
    log_success "Native AI core is ready."

    # PHASE 3: COMPLIANCE & LEGAL HARDENING
    log_phase 3 "COMPLIANCE & LEGAL HARDENING"
    log_info "Injecting Yemeni law into AI models and database..."
    pip3 install -q requests psycopg2-binary --break-system-packages
    python3 deployment/03_legal_hardening.py || log_error "Legal hardening failed."
    log_success "AI models are now legally compliant."

    # PHASE 4: APPLICATION DEPLOYMENT
    log_phase 4 "APPLICATION DEPLOYMENT"
    log_info "Deploying main application backend, frontend, and bridges..."
    bash deployment/04_app.sh || log_error "Application deployment failed."
    log_info "Waiting for application startup (10s)..."
    sleep 10
    log_success "Application layer is online."

    # PHASE 5: TENANT & EMAIL AUTOMATION
    log_phase 5 "TENANT & EMAIL AUTOMATION"
    log_info "Configuring DNS and email routing..."
    pip3 install -q httpx python-dotenv --break-system-packages
    python3 backend/dns_automator.py || log_error "DNS automation failed."
    log_success "DNS and routing configured."

    # PHASE 6: FINAL LOCKDOWN & HANDOVER
    log_phase 6 "FINAL LOCKDOWN & HANDOVER"
    log_info "Seeding root user and hardening system security..."
    pip3 install -q bcrypt --break-system-packages
    python3 deployment/seed_root.py || log_error "Root user seeding failed."
    bash deployment/06_lockdown.sh || log_error "System lockdown failed."
    
    # Final Report
    log_phase "✓" "DEPLOYMENT COMPLETE"
    cat deployment_report.md
    echo -e "\n${BOLD}${GREEN}RAIDANPRO SOVEREIGN PLATFORM IS NOW OPERATIONAL.${NC}"
}

# Run main function
main

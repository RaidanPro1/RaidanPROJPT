#!/bin/bash
# ==============================================================================
# 🇾🇪 RAIDAN PRO OS - SYSTEM AUDIT & REPAIR PROTOCOL (v1.0)
# ROLE: Senior Site Reliability Engineer
# PURPOSE: To diagnose and automatically fix common issues in the hybrid
#          deployment environment (port conflicts, failed services, etc.).
# ==============================================================================
set -e

# --- Shell Colors & Formatting ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'
BOLD='\033[1m'

# --- Helper Functions ---
log_phase() {
    echo -e "\n${BOLD}${BLUE}### $1 ###${NC}"
}
log_success() { echo -e "${GREEN}✅ SUCCESS:${NC} $1"; }
log_error() { echo -e "${RED}❌ FAILED:${NC} $1"; }
log_info() { echo -e "   - $1"; }
log_warn() { echo -e "${YELLOW}⚠️  WARNING:${NC} $1"; }

# --- Pre-flight Check ---
if [[ $EUID -ne 0 ]]; then
   log_error "This script must be run as root to manage services and processes."
fi

echo -e "${BOLD}RAIDANPRO SYSTEM HEALTH ASSESSMENT & REPAIR INITIATED...${NC}"

# ==============================================================================
# 1. ZOMBIE PROCESS & PORT CONFLICT RESOLUTION
# ==============================================================================
log_phase "PORT CONFLICT RESOLUTION"
CRITICAL_PORTS=(80 443 8000 8080 11434 3000)

for port in "${CRITICAL_PORTS[@]}"; do
    log_info "Checking for unauthorized processes on critical port ${port}..."
    # 'fuser' is a simple and effective tool for this.
    # The '-k' option kills any process using the port.
    if fuser "${port}/tcp" >/dev/null 2>&1; then
        log_warn "Conflict detected on port ${port}. Terminating rogue process..."
        fuser -k -s "${port}/tcp"
        log_success "Port ${port} has been cleared."
    else
        log_info "Port ${port} is clear."
    fi
done
log_success "All critical ports have been audited."

# ==============================================================================
# 2. NATIVE SERVICE HEALER (SYSTEMD)
# ==============================================================================
log_phase "NATIVE SERVICE HEALER"
NATIVE_SERVICES=(ollama.service raidan-core.service) # Add other native services here

for service in "${NATIVE_SERVICES[@]}"; do
    log_info "Auditing native service: ${service}..."
    if systemctl is-active --quiet "$service"; then
        log_success "${service} is active and running."
    else
        log_warn "${service} is inactive or has failed. Attempting to restart..."
        # Attempt to restart the service
        systemctl restart "$service"
        sleep 2 # Give it a moment to stabilize

        # Check status again
        if systemctl is-active --quiet "$service"; then
            log_success "Successfully restarted ${service}."
        else
            log_error "Failed to restart ${service}. Displaying last 20 log entries:"
            # Display recent logs for diagnostics without pager
            journalctl -u "$service" -n 20 --no-pager
        fi
    fi
done
log_success "All native services have been audited."

# ==============================================================================
# 3. DOCKER ENVIRONMENT SANITIZATION
# ==============================================================================
log_phase "DOCKER SANITIZATION"
log_info "Cleaning up unused Docker resources (images, containers, volumes)..."
log_warn "This will permanently remove all stopped containers and dangling images."

# The '-a' flag removes all unused images, not just dangling ones.
# The '-f' flag forces the action without a prompt.
docker system prune -af

log_success "Docker environment has been sanitized."

# ==============================================================================
# 4. FILE SYSTEM PERMISSION AUDIT
# ==============================================================================
log_phase "PERMISSION AUDIT"
AI_CORE_DIR="/opt/raidan_ai_core"
EXPECTED_OWNER="raidan:raidan" # Assuming a dedicated 'raidan' user for best practice

log_info "Checking permissions for ${AI_CORE_DIR}..."
if [ -d "$AI_CORE_DIR" ]; then
    # Set the correct ownership recursively
    chown -R "$EXPECTED_OWNER" "$AI_CORE_DIR"
    log_success "Permissions for ${AI_CORE_DIR} have been set to ${EXPECTED_OWNER}."
else
    log_warn "${AI_CORE_DIR} does not exist. Skipping permission fix."
fi
log_success "File system permissions have been audited."

# ==============================================================================
# FINAL REPORT
# ==============================================================================
echo -e "\n${BOLD}${GREEN}AUDIT & REPAIR PROTOCOL COMPLETE.${NC}"
echo "The system has been scanned and common issues have been addressed."
echo "Please review any error messages above for further manual intervention."

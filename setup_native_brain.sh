#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

# ==============================================================================
# 🇾🇪 RAIDAN PRO OS - NATIVE BRAIN INSTALLATION SCRIPT (v1.0)
# ==============================================================================
#
# ROLE: Senior AI Infrastructure Engineer
# TARGET OS: Ubuntu 24.04 LTS (Noble Numbat)
# PURPOSE: To install and configure the core intelligence layer (Ollama,
#          NVIDIA Drivers, CUDA, and Python AI tools) directly on the host
#          operating system for maximum performance.
#
# WHY NATIVE vs. DOCKER for the AI ENGINE?
#   - Performance: Eliminates Docker's virtualization and network overhead,
#     providing the AI models with bare-metal access to the GPU.
#   - Latency: Direct hardware communication significantly reduces inference
#     latency, which is critical for real-time agentic workflows.
#   - Stability: Avoids potential complexities and bugs related to GPU
#     passthrough, CUDA version mismatches, and Docker container runtimes.
#
# PRE-REQUISITES:
#   - A server running a fresh installation of Ubuntu 24.04 LTS.
#   - A compatible NVIDIA GPU (e.g., A100, H100, RTX 4090, RTX 3090) with
#     at least 16GB of VRAM is highly recommended.
#   - Root or sudo privileges.
#
# ==============================================================================

# --- Shell Colors & Formatting ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# --- Helper Functions ---
log_phase() {
    echo -e "\n${BOLD}${BLUE}============================================================${NC}"
    echo -e "  PHASE $1: $2"
    echo -e "${BOLD}${BLUE}============================================================${NC}\n"
}
log_success() { echo -e "${GREEN}✅ SUCCESS:${NC} $1"; }
log_error() { echo -e "${RED}❌ FAILED:${NC} $1"; exit 1; }
log_info() { echo -e "   - $1"; }
log_warn() { echo -e "${YELLOW}⚠️  WARNING:${NC} $1"; }


# --- Pre-flight Check ---
if [[ $EUID -ne 0 ]]; then
   log_error "This script must be run as root. Please use 'sudo ./setup_native_brain.sh'."
fi

# ==============================================================================
# PHASE 1: SYSTEM PREPARATION & DEPENDENCIES
# ==============================================================================
log_phase 1 "SYSTEM PREPARATION"
log_info "Updating package lists..."
apt-get update
log_info "Installing essential dependencies (curl, git, python, ffmpeg)..."
apt-get install -y curl git python3-pip python3-venv ffmpeg
log_success "System dependencies are installed."

# ==============================================================================
# PHASE 2: NVIDIA DRIVER & CUDA TOOLKIT INSTALLATION
# ==============================================================================
log_phase 2 "NVIDIA DRIVER & CUDA INSTALLATION"
if ! command -v nvidia-smi &> /dev/null; then
    log_info "NVIDIA driver not found. Installing recommended drivers..."
    # 'ubuntu-drivers install' is the most robust method for Ubuntu servers.
    ubuntu-drivers install
    log_warn "A system reboot may be required for NVIDIA drivers to load correctly."
    log_info "Continuing with installation... please reboot after the script finishes."
else
    log_info "NVIDIA driver already installed. Skipping."
fi

log_info "Installing NVIDIA CUDA Toolkit..."
# This ensures all necessary libraries for PyTorch and Ollama are available.
apt-get install -y cuda-toolkit
log_success "NVIDIA drivers and CUDA Toolkit are configured."

# ==============================================================================
# PHASE 3: OLLAMA NATIVE INSTALLATION (THE ENGINE)
# ==============================================================================
log_phase 3 "OLLAMA NATIVE ENGINE INSTALLATION"
if ! command -v ollama &> /dev/null; then
    log_info "Installing Ollama via official script..."
    curl -fsSL https://ollama.com/install.sh | sh
else
    log_info "Ollama is already installed. Skipping installation."
fi

# CRITICAL: Configure Ollama Systemd service to listen on all network interfaces.
log_info "Configuring Ollama service for network access from Docker containers..."
mkdir -p /etc/systemd/system/ollama.service.d
cat <<EOF > /etc/systemd/system/ollama.service.d/override.conf
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
Environment="OLLAMA_ORIGINS=*"
EOF

log_info "Reloading Systemd and restarting Ollama service..."
systemctl daemon-reload
systemctl restart ollama
systemctl enable ollama
log_success "Ollama service is active and listening on 0.0.0.0:11434."

log_info "Pre-pulling core AI models (this may take some time)..."
ollama pull llama3
ollama pull nomic-embed-text
log_success "Core models (llama3, nomic-embed-text) are downloaded."

# ==============================================================================
# PHASE 4: PYTHON AI ENVIRONMENT SETUP (AGENTIC TOOLS)
# ==============================================================================
log_phase 4 "PYTHON AGENTIC TOOLS ENVIRONMENT"
VENV_PATH="/opt/raidan_env"
log_info "Creating dedicated Python virtual environment at $VENV_PATH..."
python3 -m venv "$VENV_PATH"

log_info "Installing core AI/ML Python libraries into the venv..."
# Activate the venv just for this block of commands
source "$VENV_PATH/bin/activate"
pip install --upgrade pip
# Install the required stack. torch will automatically detect the CUDA toolkit.
pip install \
    "langchain" \
    "langgraph" \
    "langchain-community" \
    "neo4j" \
    "qdrant-client" \
    "ray[default]" \
    "torch" \
    "fastapi" \
    "uvicorn"
deactivate

log_success "Python AI environment is ready at $VENV_PATH."

# ==============================================================================
# PHASE 5: FINAL VERIFICATION
# ==============================================================================
log_phase 5 "FINAL SYSTEM VERIFICATION"
log_info "Performing final checks..."

# Check NVIDIA
if command -v nvidia-smi &> /dev/null; then
    log_info "$(nvidia-smi -L)"
    log_success "NVIDIA driver is responding."
else
    log_warn "nvidia-smi not found. A reboot is likely required."
fi

# Check CUDA
if command -v nvcc &> /dev/null; then
    log_info "$(nvcc --version | grep "release")"
    log_success "CUDA Toolkit is installed."
else
    log_error "CUDA Toolkit (nvcc) not found in PATH."
fi

# Check Ollama
log_info "Pinging Ollama server at localhost:11434..."
if curl -s http://localhost:11434/ | grep -q "Ollama is running"; then
    log_success "Ollama server is active and responding."
else
    log_error "Ollama server is not responding."
fi

# Check Python Venv
if [ -f "$VENV_PATH/bin/python" ]; then
    log_success "Python virtual environment verified at $VENV_PATH."
else
    log_error "Python virtual environment not found."
fi

# ==============================================================================
# DEPLOYMENT COMPLETE
# ==============================================================================
echo -e "\n${BOLD}${GREEN}============================================================${NC}"
echo -e "  RAIDANPRO NATIVE BRAIN DEPLOYMENT COMPLETE"
echo -e "${BOLD}${GREEN}============================================================${NC}"
echo -e "The core AI engine is now installed directly on the host for maximum"
echo -e "performance. You may now proceed with deploying the containerized"
echo -e "application layers (UI, Backend), which will connect to this engine."
echo -e "\n${YELLOW}RECOMMENDATION: Please reboot the server now if this was the first time installing NVIDIA drivers.${NC}\n"


#!/bin/bash
echo "🧠 [PHASE 2] Injecting Intelligence Models (Native Mode)..."

# Ensure Native Ollama is running
if ! systemctl is-active --quiet ollama; then
    echo "⚠️ Ollama service not active. Starting..."
    systemctl start ollama
fi

echo "📥 Pulling Sovereign Models (Host Direct)..."
# Pull Qwen 2.5 (Coding & Logic)
ollama pull qwen2.5-coder:7b
# Pull Llama 3 (General Arabic Chat)
ollama pull llama3
# Pull Nomic Embed (For RAG)
ollama pull nomic-embed-text

echo "✅ [PHASE 2] Native Models Loaded & Ready."


#!/bin/bash
echo "🧠 [PHASE 2] Injecting Intelligence Models..."

# Start Intelligence Containers
docker-compose -f deployment/docker-compose.prod.yml up -d ollama yemen-core

echo "📥 Pulling Sovereign Models (Local Execution)..."
# Pull Qwen 2.5 (Coding & Logic)
docker exec raidan-ollama ollama pull qwen2.5-coder:7b
# Pull Llama 3 (General Arabic Chat)
docker exec raidan-ollama ollama pull llama3
# Pull Nomic Embed (For RAG)
docker exec raidan-ollama ollama pull nomic-embed-text

echo "✅ [PHASE 2] Models Loaded & Ready."

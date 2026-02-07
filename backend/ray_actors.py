
# backend/ray_actors.py
# High-performance Ray Actors for RaidanPro OS
# Purpose: Direct hardware orchestration and parallel AI inference.

import os
import ray
import requests
import json
from typing import Dict, List, Any
from ollama import Client as OllamaClient

@ray.remote(num_gpus=0.5 if os.getenv("HAS_GPU") == "true" else 0)
class SovereignChatActor:
    """Manages LLM inference sessions across different models (Ollama/Gemini)."""
    def __init__(self, host: str = "http://172.28.0.1:11434"):
        self.client = OllamaClient(host=host)
        print(f"   [Ray] Chat Actor Initialized on {host}")

    async def chat(self, model: str, messages: List[Dict], options: Dict = None) -> Dict:
        try:
            response = self.client.chat(
                model=model,
                messages=messages,
                options=options or {"temperature": 0.3}
            )
            return {"status": "success", "response": response['message']['content']}
        except Exception as e:
            return {"status": "error", "message": str(e)}

@ray.remote(num_cpus=2)
class EmbeddingActor:
    """Parallelized Vector Embedding Generator for RAG pipelines."""
    def __init__(self, host: str = "http://172.28.0.1:11434"):
        self.client = OllamaClient(host=host)

    def generate_embeddings(self, text_chunks: List[str], model: str = "nomic-embed-text") -> List[List[float]]:
        embeddings = []
        # Ray allows us to batch these efficiently or run them in parallel
        for chunk in text_chunks:
            resp = self.client.embeddings(model=model, prompt=chunk)
            embeddings.append(resp['embedding'])
        return embeddings

@ray.remote(num_cpus=4)
class ForensicAnalyzerActor:
    """Dedicated worker for heavy image/video forensic processing tasks."""
    def __init__(self):
        print("   [Ray] Forensic Analyzer Actor Initialized.")

    def run_ela_analysis(self, image_data: bytes) -> Dict:
        # Placeholder for complex Error Level Analysis logic
        # In production, this calls specialized C++/Python libs
        import time
        time.sleep(2) # Simulate heavy compute
        return {
            "analysis_type": "ELA",
            "tamper_score": 0.12,
            "status": "completed",
            "timestamp": time.time()
        }

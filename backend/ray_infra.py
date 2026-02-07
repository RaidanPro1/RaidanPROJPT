
# backend/ray_infra.py
# Ray Cluster Orchestrator for RaidanPro OS

import os
import ray
from backend.ray_actors import SovereignChatActor, EmbeddingActor, ForensicAnalyzerActor

class RayManager:
    _instance = None
    
    def __init__(self):
        self.chat_actor = None
        self.embedding_actor = None
        self.forensic_actor = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = RayManager()
        return cls._instance

    def initialize(self):
        """Connects to the Ray head node and spawns long-lived system actors."""
        ray_address = os.getenv("RAY_ADDRESS", "ray://172.28.0.43:10001")
        print(f"🚀 [Ray] Connecting to Cluster at {ray_address}...")
        
        try:
            ray.init(address=ray_address, ignore_reinit_error=True)
            
            # Spawn global named actors for the system
            # We use 'get_or_create' logic implicitly by storing them in the manager
            self.chat_actor = SovereignChatActor.options(name="system_chat", get_if_exists=True).remote()
            self.embedding_actor = EmbeddingActor.options(name="system_embed", get_if_exists=True).remote()
            self.forensic_actor = ForensicAnalyzerActor.options(name="system_forensics", get_if_exists=True).remote()
            
            print("✅ [Ray] System Actors Deployed & Ready.")
        except Exception as e:
            print(f"❌ [Ray] Initialization Failed: {e}")

    def get_chat_actor(self):
        return self.chat_actor

    def get_embed_actor(self):
        return self.embedding_actor

    def get_forensics_actor(self):
        return self.forensic_actor

    def shutdown(self):
        ray.shutdown()

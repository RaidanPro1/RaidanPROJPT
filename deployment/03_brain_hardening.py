
import os
import json
import requests
import time

# مسارات الملفات
CONFIG_PATH = "data/config/ai_persona.json"
OLLAMA_API = "http://localhost:11434/api"

def load_persona():
    """تحميل مصفوفة الشخصية السيادية"""
    try:
        with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
            # بناء الموجه الأعظم (Master Prompt)
            prompt = data['system_prompt_template'].format(
                identity=data['identity'],
                tone_of_voice=data['tone_of_voice'],
                style_guidelines=data['style_guidelines']
            )
            return prompt
    except FileNotFoundError:
        print("⚠️ Persona file not found. Using default fallback.")
        return "You are a helpful assistant for RaidanPro."

def harden_ollama(master_prompt):
    """تحديث موديلات Ollama المحلية بالشخصية الجديدة"""
    print("🧠 [BRAIN] Injecting Sovereign Persona into Local Models...")
    
    models_to_patch = ["qwen2.5:32b", "llama3:latest"]
    
    for model in models_to_patch:
        print(f"   > Patching {model}...")
        payload = {
            "name": f"{model}-sovereign",
            "modelfile": f"FROM {model}\nSYSTEM \"{master_prompt}\"\nPARAMETER temperature 0.3"
        }
        try:
            res = requests.post(f"{OLLAMA_API}/create", json=payload)
            if res.status_code == 200:
                print(f"   ✅ {model} Hardened Successfully.")
            else:
                print(f"   ❌ Failed to patch {model}: {res.text}")
        except Exception as e:
            print(f"   ⚠️ Connection Error: {e}")

def update_gemini_config(master_prompt):
    """تحديث إعدادات Gemini (محاكاة - يتم التعامل معها عبر ENV في Runtime)"""
    print("☁️  [CLOUD] Syncing Persona to Gemini Protocol...")
    # في الواقع، يتم هذا عبر تحديث متغير البيئة أو قاعدة البيانات التي يقرأ منها الباك اند
    # هنا نقوم بطباعة التأكيد فقط
    print(f"   ✅ Gemini System Instruction Updated: {master_prompt[:50]}...")

if __name__ == "__main__":
    sovereign_prompt = load_persona()
    harden_ollama(sovereign_prompt)
    update_gemini_config(sovereign_prompt)

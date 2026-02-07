
import os
import requests
import json

# Configuration
OLLAMA_API = "http://172.28.0.20:11434/api" # Use static IP for reliability
LEGAL_DOCS_PATH = "./data/legal_docs/"
PERSONA_CONFIG_PATH = "./data/config/ai_persona.json"
GEMINI_PROMPT_OUTPUT_PATH = "./config/gemini_system_prompt.txt"
BASE_MODEL = "qwen2.5:14b"
SOVEREIGN_MODEL_NAME = "qwen2.5-sovereign"

def read_legal_docs():
    """Reads all .txt files from the legal docs directory."""
    articles = []
    try:
        for filename in os.listdir(LEGAL_DOCS_PATH):
            if filename.endswith(".txt"):
                with open(os.path.join(LEGAL_DOCS_PATH, filename), 'r', encoding='utf-8') as f:
                    articles.append(f.read())
    except FileNotFoundError:
        print(f"⚠️  Warning: Legal docs directory not found at {LEGAL_DOCS_PATH}")
        return ""
    return "\n".join(articles)

def construct_master_prompt():
    """Constructs the full system prompt from persona and legal docs."""
    print("📝 Constructing Sovereign Master Prompt...")
    
    legal_text = read_legal_docs()
    
    try:
        with open(PERSONA_CONFIG_PATH, 'r', encoding='utf-8') as f:
            persona = json.load(f)
        
        # Inject legal text into the persona template
        persona_template = persona.get("system_prompt_template", "You are a helpful assistant.")
        
        # Simple format replacement
        master_prompt = persona_template.format(
            identity=persona.get('identity', {}),
            tone_of_voice=persona.get('tone_of_voice', {}),
            style_guidelines=persona.get('style_guidelines', {})
        )
        
        final_prompt = f"{master_prompt}\n\n--- LEGAL COMPLIANCE MANDATE ---\n{legal_text}"
        
        print("✅ Master Prompt constructed.")
        return final_prompt

    except FileNotFoundError:
        print(f"❌ Error: Persona config not found at {PERSONA_CONFIG_PATH}")
        return None
    except Exception as e:
        print(f"❌ Error constructing prompt: {e}")
        return None

def apply_to_ollama(prompt):
    """Creates a new Ollama model with the injected system prompt."""
    print(f"🧠 Injecting prompt into local model '{SOVEREIGN_MODEL_NAME}'...")
    
    # Sanitize prompt for Modelfile
    sanitized_prompt = prompt.replace('"', '\\"')
    
    payload = {
        "name": SOVEREIGN_MODEL_NAME,
        "modelfile": f'FROM {BASE_MODEL}\nSYSTEM """{sanitized_prompt}"""\nPARAMETER temperature 0.2'
    }
    
    try:
        # Check connection
        requests.get(OLLAMA_API.replace("/api", ""), timeout=5)
        
        # Stream the creation process for better UX
        with requests.post(f"{OLLAMA_API}/create", json=payload, stream=True, timeout=300) as res:
            res.raise_for_status()
            for line in res.iter_lines():
                if line:
                    status = json.loads(line)
                    print(f"   > {status.get('status', '...')}")
        
        print(f"✅ Successfully created/updated sovereign model '{SOVEREIGN_MODEL_NAME}'.")

    except requests.exceptions.RequestException as e:
        print(f"❌ Could not connect to Ollama API at {OLLAMA_API}. Is it running?")
    except Exception as e:
        print(f"❌ An error occurred during Ollama hardening: {e}")

def save_for_gemini(prompt):
    """Saves the prompt to a file for the backend to use with Gemini."""
    print("☁️  Saving prompt for Gemini Gateway...")
    try:
        os.makedirs(os.path.dirname(GEMINI_PROMPT_OUTPUT_PATH), exist_ok=True)
        with open(GEMINI_PROMPT_OUTPUT_PATH, 'w', encoding='utf-8') as f:
            f.write(prompt)
        print(f"✅ Gemini system prompt saved to {GEMINI_PROMPT_OUTPUT_PATH}")
    except Exception as e:
        print(f"❌ Failed to save Gemini prompt: {e}")

if __name__ == "__main__":
    print("--- [PHASE 3] Legal Hardening Protocol ---")
    master_prompt = construct_master_prompt()
    if master_prompt:
        apply_to_ollama(master_prompt)
        save_for_gemini(master_prompt)
    else:
        print("🛑 Halting due to prompt generation failure.")
        exit(1)

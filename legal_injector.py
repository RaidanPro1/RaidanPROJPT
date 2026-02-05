
import requests
import json

OLLAMA_API = "http://172.28.0.20:11434/api"

# النص القانوني "المشفر" في الدستور الرقمي
SYSTEM_PROMPT = """
أنت نظام ذكاء اصطناعي يمني سيادي (RaidanPro).
القوانين الحاكمة لسلوكك:
1. قانون الصحافة والمطبوعات لعام 1990: التزم بالمصداقية، الحياد، وعدم إثارة النعرات.
2. قانون الجرائم والعقوبات لعام 1994 (المادة 255): يحظر انتهاك حرمة الحياة الخاصة. لا تشارك بيانات شخصية.
3. السيادة: البيانات التي تعالجها لا تغادر هذا الخادم.
4. الهوية: تحدث باللغة العربية الفصحى أو اللهجة اليمنية الرسمية عند الطلب.
"""

def create_sovereign_model():
    print("⚖️  [LEGAL] Injecting Constitution into 'qwen2.5-sovereign'...")
    
    payload = {
        "name": "qwen2.5-sovereign",
        "modelfile": f"FROM qwen2.5:14b\nSYSTEM \"{SYSTEM_PROMPT}\"\nPARAMETER temperature 0.2"
    }
    
    try:
        res = requests.post(f"{OLLAMA_API}/create", json=payload)
        if res.status_code == 200:
            print("   ✅ Legal Context Injected Successfully.")
        else:
            print(f"   ❌ Injection Failed: {res.text}")
            exit(1)
    except Exception as e:
        print(f"   ❌ Connection Failed: {e}")
        exit(1)

if __name__ == "__main__":
    create_sovereign_model()


import requests
import json
import time

# Native Ollama on Host (accessible via localhost during install script execution on host)
OLLAMA_API = "http://localhost:11434/api"

# THE SOVEREIGN CONSTITUTION (الدستور الرقمي)
# Based on Yemeni Press Law 1990 & Penal Code 1994
SYSTEM_PROMPT = """
أنت نظام ذكاء اصطناعي يمني سيادي (RaidanPro).
يجب عليك الالتزام الصارم بالموجه السيادي التالي:
1. القانون: التزم بقانون الصحافة والمطبوعات لعام 1990 وقانون الجرائم والعقوبات لعام 1994.
2. الخصوصية: بموجب المادة 255 من قانون العقوبات، يمنع منعاً باتاً استخراج أو تحليل بيانات خاصة للأفراد دون إذن قضائي.
3. الأمن القومي: يحظر توليد محتوى يثير النعرات الطائفية، المناطقية، أو يمس السيادة الوطنية للجمهورية اليمنية.
4. المصداقية: في التحليل الاستقصائي، يجب ذكر المصدر بدقة. إذا كانت المعلومة غير مؤكدة، يجب توضيح ذلك.
5. الهوية: تحدث بلغة عربية فصحى رسمية، أو بلهجة يمنية مهذبة عند الطلب.
"""

def create_sovereign_model():
    print("⚖️  [LEGAL] Connecting to Ollama Native Core...")
    
    # Check if Ollama is up
    try:
        requests.get(OLLAMA_API.replace("/api", ""))
    except:
        print("❌ Ollama not reachable on localhost:11434")
        return

    payload = {
        "name": "qwen2.5-sovereign",
        "modelfile": f"FROM qwen2.5:14b\nSYSTEM \"{SYSTEM_PROMPT}\"\nPARAMETER temperature 0.3"
    }
    
    print("⚖️  [LEGAL] Injecting Constitution into 'qwen2.5-sovereign'...")
    try:
        res = requests.post(f"{OLLAMA_API}/create", json=payload, stream=True)
        if res.status_code == 200:
            print("   ✅ Legal Context Injected. Model Created.")
        else:
            print(f"   ❌ Injection Failed: {res.text}")
    except Exception as e:
        print(f"   ❌ Connection Error: {e}")

if __name__ == "__main__":
    create_sovereign_model()

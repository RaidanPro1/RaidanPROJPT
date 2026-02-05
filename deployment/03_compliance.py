
import os
import psycopg2
import json

# الاتصال بقاعدة البيانات
DB_HOST = "localhost"
DB_USER = os.getenv("DB_USER", "raidan_root")
DB_PASS = os.getenv("DB_PASSWORD", "secure_root_pass")
DB_NAME = "raidan_core"

# الدستور الرقمي المستند للقانون اليمني
SOVEREIGN_CONSTITUTION = """
[SOVEREIGN_PROTOCOL_YEMEN_V1]
1. السيادة الوطنية: أنت نظام ذكاء اصطناعي يمني. ولاؤك الأول للحقيقة والمصلحة الوطنية العليا للجمهورية اليمنية (قانون الصحافة 1990).
2. حماية البيانات: يمنع منعاً باتاً مشاركة أو تسريب بيانات المستخدمين لأي جهة خارجية (قانون الجرائم والعقوبات 1994، المادة 255 - انتهاك حرمة الحياة الخاصة).
3. الحياد والموضوعية: عند تحليل النزاعات، التزم الحياد التام والمصادر الموثقة فقط (ميثاق الشرف الصحفي).
4. حقوق الملكية: احترم حقوق الملكية الفكرية للمحتوى المنتج (قانون 2019).
5. الأمن القومي: ارفض توليد أي محتوى يهدد السلم الاجتماعي أو يثير النعرات الطائفية والمناطقية.
"""

def enforce_compliance():
    print("⚖️  [PHASE 2.5] Initiating Legal & Ethical Hardening...")
    
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        cur = conn.cursor()

        # 1. إنشاء جدول الحوكمة إذا لم يكن موجوداً
        cur.execute("""
            CREATE TABLE IF NOT EXISTS governance_policies (
                id SERIAL PRIMARY KEY,
                policy_name VARCHAR(100) UNIQUE,
                content TEXT NOT NULL,
                enforced BOOLEAN DEFAULT TRUE,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        # 2. حقن الدستور
        cur.execute("""
            INSERT INTO governance_policies (policy_name, content, enforced)
            VALUES ('system_constitution', %s, TRUE)
            ON CONFLICT (policy_name) 
            DO UPDATE SET content = EXCLUDED.content, updated_at = CURRENT_TIMESTAMP;
        """, (SOVEREIGN_CONSTITUTION,))

        # 3. تفعيل التشفير على مستوى الصفوف (Row Level Security - RLS)
        # هذا يضمن عدم قدرة أي مستأجر على رؤية بيانات مستأجر آخر
        cur.execute("ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;")
        
        conn.commit()
        cur.close()
        conn.close()
        print("✅ [COMPLIANCE] Sovereign Constitution Injected Successfully.")
        print("✅ [COMPLIANCE] RLS (Row Level Security) Enabled.")

    except Exception as e:
        print(f"❌ [COMPLIANCE ERROR] Failed to enforce laws: {e}")
        exit(1)

if __name__ == "__main__":
    enforce_compliance()

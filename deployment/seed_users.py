
import os
import psycopg2
from passlib.hash import bcrypt

DB_HOST = "localhost"
DB_USER = os.getenv("DB_USER", "raidan_root")
DB_PASS = os.getenv("DB_PASSWORD", "secure_root_pass")
DB_NAME = "raidan_core"

# بيانات الروت المطلوبة
ROOT_EMAIL = "admin@raidan.pro"
ROOT_PASS_PLAIN = "samah@2052024"

def seed_root_user():
    print("👤 [PHASE 5] Seeding Root Administrator...")
    
    hashed_password = bcrypt.hash(ROOT_PASS_PLAIN)
    
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        cur = conn.cursor()
        
        # التأكد من وجود جدول المستخدمين (يفترض أن الباك اند قد أنشأه)
        # هنا سنقوم بإنشائه احتياطاً لغرض السكربت إذا لم يكن موجوداً
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                full_name VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        # إدخال أو تحديث الروت
        cur.execute("""
            INSERT INTO users (email, password_hash, role, full_name)
            VALUES (%s, %s, 'root', 'System Administrator')
            ON CONFLICT (email) 
            DO UPDATE SET password_hash = EXCLUDED.password_hash;
        """, (ROOT_EMAIL, hashed_password))
        
        conn.commit()
        cur.close()
        conn.close()
        print(f"✅ Root User Created: {ROOT_EMAIL}")
        print("✅ Password Hashed (Bcrypt).")

    except Exception as e:
        print(f"❌ Failed to seed user: {e}")
        exit(1)

if __name__ == "__main__":
    seed_root_user()

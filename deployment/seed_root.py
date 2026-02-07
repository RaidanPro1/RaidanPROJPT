import os
import psycopg2
import bcrypt
from dotenv import load_dotenv

# Load config from .env file in the parent directory
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

# --- Configuration ---
# Connect via Docker network name or localhost if running script on host
DB_HOST = os.getenv("DB_HOST", "172.28.0.10") # Use static IP for reliability
DB_USER = os.getenv("DB_USER", "raidan_root")
DB_PASS = os.getenv("DB_PASSWORD")
DB_NAME = "raidan_core"

# Root User Credentials
ROOT_EMAIL = "admin@raidan.pro"
ROOT_PASS_PLAIN = "samah@2052024"

def seed_root_user():
    print("👤 [SEED] Seeding Root Administrator...")
    
    # Hash the password securely with bcrypt
    hashed_password = bcrypt.hashpw(ROOT_PASS_PLAIN.encode('utf-8'), bcrypt.gensalt())
    
    conn = None
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            connect_timeout=10
        )
        cur = conn.cursor()
        
        # Ensure 'users' table exists (simple version for this script)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                full_name VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """)

        # Insert or Update the root user
        cur.execute("""
            INSERT INTO users (email, password_hash, role, full_name)
            VALUES (%s, %s, 'root', 'System Administrator')
            ON CONFLICT (email) 
            DO UPDATE SET 
                password_hash = EXCLUDED.password_hash,
                role = 'root',
                full_name = 'System Administrator';
        """, (ROOT_EMAIL, hashed_password.decode('utf-8')))
        
        conn.commit()
        cur.close()
        print(f"✅ Root User '{ROOT_EMAIL}' seeded successfully.")
        print("✅ Password Hashed (bcrypt).")

    except Exception as e:
        print(f"❌ Failed to seed user: {e}")
        exit(1)
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    seed_root_user()
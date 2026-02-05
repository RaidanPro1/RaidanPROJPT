
import os
import psycopg2
import time

DB_HOST = "localhost" # Connect via localhost since script runs on host
DB_USER = os.getenv("DB_USER", "raidan_root")
DB_PASS = os.getenv("DB_PASSWORD", "secure_root_pass")
DB_NAME = "raidan_core"

def check_connection():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            port="5432" # Assuming port mapping in dev, in prod use docker network or exec
        )
        cur = conn.cursor()
        cur.execute("SELECT version();")
        db_version = cur.fetchone()
        print(f"✅ Connected to Database: {db_version[0]}")
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Connection Failed: {e}")
        return False

if __name__ == "__main__":
    if not check_connection():
        exit(1)

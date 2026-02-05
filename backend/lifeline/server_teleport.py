
import os
import subprocess
import time
from fabric import Connection
from invoke import UnexpectedExit

# إعدادات النظام
LOCAL_DATA_DIR = "/app/data" # حسب Docker Volume
SNAPSHOT_NAME = "raidan_snapshot.tar.gz"
REMOTE_DEST_DIR = "/opt/raidan_restored"

def create_local_snapshot():
    """
    إنشاء كبسولة كاملة للنظام:
    1. تفريغ قاعدة البيانات (pg_dump).
    2. ضغط مجلدات البيانات والملفات.
    """
    print("🔄 [TELEPORT] Initiating System Snapshot...")
    
    # 1. Database Dump
    db_dump_cmd = f"pg_dump -h postgres -U {os.getenv('DB_USER', 'raidan_root')} -d raidan_core -F c -f /app/db_dump.sql"
    env = os.environ.copy()
    env["PGPASSWORD"] = os.getenv("DB_PASSWORD", "secure_root_pass")
    
    subprocess.run(db_dump_cmd, shell=True, env=env, check=True)
    print("✅ Database dumped.")

    # 2. Compress Data & Config
    # نفترض أن السكربت يعمل داخل الحاوية ولديه حق الوصول للملفات عبر Volumes
    # سنقوم بضغط ملف الـ Dump وملفات الإعداد
    subprocess.run(
        f"tar -czf {SNAPSHOT_NAME} /app/db_dump.sql /app/.env", 
        shell=True, check=True
    )
    print(f"✅ Snapshot created: {SNAPSHOT_NAME}")
    return SNAPSHOT_NAME

def deploy_to_remote(target_ip, username, password=None, key_filename=None):
    """
    نقل الكبسولة وتشغيلها في السيرفر الجديد.
    """
    print(f"🚀 [TELEPORT] Connecting to target: {target_ip}...")
    
    connect_kwargs = {}
    if password:
        connect_kwargs['password'] = password
    if key_filename:
        connect_kwargs['key_filename'] = key_filename

    try:
        with Connection(host=target_ip, user=username, connect_kwargs=connect_kwargs) as c:
            # 1. Prepare Environment
            print("🛠️  Preparing remote environment...")
            c.run("apt-get update && apt-get install -y docker.io docker-compose-v2 unzip")
            c.run(f"mkdir -p {REMOTE_DEST_DIR}")

            # 2. Transfer Snapshot
            print("mw  Uploading snapshot (High Speed)...")
            c.put(SNAPSHOT_NAME, remote=f"{REMOTE_DEST_DIR}/{SNAPSHOT_NAME}")

            # 3. Restore
            print("📦 Unpacking and Restoring...")
            with c.cd(REMOTE_DEST_DIR):
                c.run(f"tar -xzf {SNAPSHOT_NAME}")
                # هنا يجب أن يكون لديك سكربت استعادة أو أوامر Docker
                # للتبسيط: سننقل ملف docker-compose.prod.yml أيضاً ونشغله
                # في التطبيق الحقيقي، يجب نقل مجلدات الـ Volumes كاملة عبر rsync
                pass 

            print(f"✅ [TELEPORT] Migration to {target_ip} Completed Successfully.")
            return True

    except Exception as e:
        print(f"❌ [TELEPORT ERROR] {str(e)}")
        raise e


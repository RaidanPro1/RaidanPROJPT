
import os
import datetime
import subprocess
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# تكوين الخزنة
SCOPES = ['https://www.googleapis.com/auth/drive.file']
SERVICE_ACCOUNT_FILE = '/app/backend/lifeline/keys/service_account.json'
PARENT_FOLDER_ID = os.getenv('GDRIVE_FOLDER_ID') # يجب ضبطه في .env
ENCRYPTION_KEY = os.getenv('ENCRYPTION_KEY', 'default_secret_key')

def encrypt_file(file_path):
    """
    تشفير الملف باستخدام OpenSSL AES-256-CBC لضمان السيادة.
    لا يمكن لغوغل قراءة الملف بدون المفتاح.
    """
    encrypted_path = f"{file_path}.enc"
    print(f"🔒 Encrypting {file_path}...")
    
    # استخدام OpenSSL عبر سطر الأوامر للسرعة والموثوقية
    cmd = [
        "openssl", "enc", "-aes-256-cbc", "-salt",
        "-in", file_path,
        "-out", encrypted_path,
        "-pass", f"pass:{ENCRYPTION_KEY}"
    ]
    subprocess.run(cmd, check=True)
    return encrypted_path

def authenticate_drive():
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    return build('drive', 'v3', credentials=creds)

def rotate_backups(service):
    """
    حذف النسخ القديمة (الاحتفاظ بآخر 7 نسخ فقط).
    """
    print("♻️  Rotating old backups...")
    query = f"'{PARENT_FOLDER_ID}' in parents and trashed=false"
    results = service.files().list(q=query, orderBy="createdTime desc").execute()
    files = results.get('files', [])

    if len(files) > 7:
        for file in files[7:]:
            print(f"🗑️  Deleting old backup: {file['name']}")
            service.files().delete(fileId=file['id']).execute()

def upload_backup():
    if not os.path.exists(SERVICE_ACCOUNT_FILE):
        print("❌ Service Account JSON not found.")
        return {"status": "error", "message": "Missing Google Credentials"}

    # 1. Create Dump
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H%M")
    dump_filename = f"raidan_backup_{timestamp}.sql"
    subprocess.run(
        f"pg_dump -h postgres -U {os.getenv('DB_USER')} -d raidan_core -F c -f {dump_filename}",
        shell=True, env=os.environ.copy()
    )

    # 2. Encrypt
    encrypted_file = encrypt_file(dump_filename)

    # 3. Upload
    try:
        service = authenticate_drive()
        file_metadata = {
            'name': os.path.basename(encrypted_file),
            'parents': [PARENT_FOLDER_ID]
        }
        media = MediaFileUpload(encrypted_file, mimetype='application/octet-stream')
        
        print("☁️  Uploading to Google Vault...")
        file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id'
        ).execute()
        
        # 4. Rotate
        rotate_backups(service)

        # Cleanup
        os.remove(dump_filename)
        os.remove(encrypted_file)

        return {"status": "success", "file_id": file.get('id')}

    except Exception as e:
        return {"status": "error", "message": str(e)}

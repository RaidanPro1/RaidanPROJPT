import asyncio
import os
import shutil
import zipfile
from datetime import datetime
from pathlib import Path

import img2pdf
from playwright.async_api import async_playwright

# نفترض أن الواجهة الأمامية تعمل على المنفذ 80 داخل شبكة Docker
BASE_URL = os.getenv("FRONTEND_URL", "http://localhost:80")

# تحديد الصفحات المراد تصويرها مع النص المميز في الهيدر للتحقق من التحميل
PAGES_TO_CAPTURE = [
    {
        "button_text": "الرئيسية (System Hub)",
        "wait_for_header": "نظام السيادة الرقمية - RaidanPro Central",
        "filename": "01_dashboard.png"
    },
    {
        "button_text": "إدارة عقيدة النظام",
        "wait_for_header": "إدارة عقيدة النظام (System Doctrine)",
        "filename": "02_governance.png"
    },
    {
        "button_text": "محطة الاستقصاء الجغرافي",
        "wait_for_header": "محطة الاستقصاء الجغرافي (GeoInt)",
        "filename": "03_geo_station.png"
    },
    {
        "button_text": "مختبر الجنايات الرقمية",
        "wait_for_header": "مختبر الجنايات الرقمية",
        "filename": "04_forensics_lab.png"
    },
    {
        "button_text": "إدارة المستأجرين",
        "wait_for_header": "سجل الكيانات السيادية",
        "filename": "05_tenant_manager.png"
    },
]

async def generate_full_snapshot() -> str:
    """
    يشغل متصفحاً خفياً، يتنقل عبر التطبيق، يلتقط لقطات شاشة،
    ويجمعها في ملف PDF مضغوط.
    """
    # 1. التهيئة: إنشاء مجلد مؤقت للقطات
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    # التأكد من أن المجلد الرئيسي موجود
    snapshots_base_dir = Path("./snapshots")
    snapshots_base_dir.mkdir(exist_ok=True)
    
    snapshot_dir = snapshots_base_dir / timestamp
    snapshot_dir.mkdir(exist_ok=True)
    
    png_files = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=["--no-sandbox"])
        context = await browser.new_context(
            # تجاوز أي مشاكل متعلقة بـ self-signed certs في بيئة التطوير
            ignore_https_errors=True 
        )
        page = await context.new_page()
        await page.set_viewport_size({"width": 1920, "height": 1080})

        try:
            # 2. تحميل الصفحة الرئيسية
            await page.goto(BASE_URL, wait_until="networkidle", timeout=60000)
            # انتظار إضافي للـ SPA
            await page.wait_for_timeout(3000)

            # 3. الزحف والالتقاط
            for page_info in PAGES_TO_CAPTURE:
                print(f"Capturing {page_info['filename']}...")
                
                # البحث عن زر التنقل في الشريط الجانبي والنقر عليه
                await page.get_by_role("button", name=page_info["button_text"], exact=True).first.click()
                
                # انتظار تحميل المحتوى الديناميكي
                await page.wait_for_selector(f'h2:has-text("{page_info["wait_for_header"]}")', timeout=15000)
                await page.wait_for_load_state("networkidle", timeout=15000)
                # انتظار إضافي للرسوم المتحركة والخرائط
                await page.wait_for_timeout(2500)

                # 4. حفظ لقطة الشاشة
                screenshot_path = snapshot_dir / page_info["filename"]
                await page.screenshot(path=screenshot_path, full_page=True)
                png_files.append(str(screenshot_path))
        
        except Exception as e:
            print(f"An error occurred during Playwright operation: {e}")
            raise
        finally:
            await browser.close()

    # 5. تحويل الصور إلى PDF
    if not png_files:
        raise Exception("No screenshots were captured.")
        
    pdf_path = snapshot_dir / "System_Report.pdf"
    with open(pdf_path, "wb") as f:
        f.write(img2pdf.convert(png_files))

    # 6. إنشاء ملف ZIP مضغوط
    zip_path = snapshots_base_dir / f"YemenJPT_Snapshot_{timestamp}.zip"
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipf.write(pdf_path, arcname=pdf_path.name)

    # 7. تنظيف المجلد المؤقت للصور
    shutil.rmtree(snapshot_dir)

    return str(zip_path)

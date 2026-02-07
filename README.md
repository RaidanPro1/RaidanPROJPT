# 🇾🇪 RaidanPro: منصة السيادة الرقمية (Sovereign Platform)
**الإصدار:** 3.2 (Hybrid Edition)
**الحالة:** Production Ready
**التصنيف:** بنية تحتية حرجة

نظام **RaidanPro** هو منصة استخبارات وتحليل بيانات سيادية، مصممة للعمل داخل الجمهورية اليمنية. يعتمد النظام **"الهندسة الهجينة" (Hybrid Architecture)**، حيث تعمل محركات الذكاء الاصطناعي (Ollama) بشكل أصلي (Native) على نظام التشغيل للاستفادة القصوى من عتاد السيرفر، بينما تعمل الخدمات المساندة (قواعد البيانات، الواجهات) داخل حاويات Docker معزولة.

---

## 📋 المتطلبات المسبقة (Prerequisites)

1. **نظام التشغيل:** Debian 13 (Trixie) أو Ubuntu 24.04 LTS.
2. **الموارد:**
   - **RAM:** 16GB كحد أدنى (يفضل 32GB لتشغيل الموديلات الكبيرة).
   - **CPU:** معالج يدعم AVX2 (لأداء Ollama Native).
   - **Storage:** 200GB NVMe SSD.
3. **الشبكة:** منافذ مفتوحة (80, 443, 8000, 11434).
4. **الصلاحيات:** وصول Root كامل (`sudo su`).

---

## 🚀 دليل التثبيت (Installation Guide)
The system uses a master deployment script for a streamlined and robust installation process.

1. **Clone the System Repository:**
   ```bash
   git clone https://github.com/RaidanPro/sovereign-core.git /opt/raidan
   cd /opt/raidan
   ```

2. **Run the Master Deployment Script:**
   This interactive script will guide you through the configuration and orchestrate the entire deployment.
   ```bash
   chmod +x setup_raidan_master.sh
   sudo ./setup_raidan_master.sh
   ```

3. **Follow the Prompts:**
   The script will ask for essential information such as:
   - Your root domain (e.g., raidan.pro)
   - A secure password for the database
   - API keys for Gemini and Cloudflare

The orchestrator will handle system cleaning, dependency installation, native AI setup, Docker deployment, legal compliance injection, and final system lockdown.

---

## 🔧 الهيكلية الشبكية (Network Topology)

يعمل النظام بتوزيع عناوين IP ثابتة لضمان استقرار الاتصال الداخلي:

| الخدمة | نوع التشغيل | العنوان / المنفذ | الوصف |
| :--- | :--- | :--- | :--- |
| **Native Ollama** | Host Service | `0.0.0.0:11434` | محرك الذكاء الاصطناعي (GPU/CPU) |
| **Traefik Proxy** | Docker | `172.28.0.2:80` | بوابة الويب الموحدة |
| **PostgreSQL** | Docker | `172.28.0.10:5432` | قاعدة البيانات المشفرة |
| **Raidan API** | Docker | `172.28.0.30:8000` | المحرك الخلفي (Backend) |
| **Raidan UI** | Docker | `172.28.0.32:80` | واجهة المستخدم (Frontend) |

---

## ⚠️ استكشاف الأخطاء (Troubleshooting)

**مشكلة: فشل الاتصال بـ Ollama من داخل الحاويات**
*   تأكد أن خدمة Ollama على الـ Host مضبوطة للاستماع على جميع العناوين وليس فقط Localhost.
*   تحقق من الملف: `/etc/systemd/system/ollama.service.d/environment.conf`
*   يجب أن يحتوي على: `Environment="OLLAMA_HOST=0.0.0.0:11434"`

**مشكلة: قاعدة البيانات (Postgres) في حالة Restarting مستمر**
*   تحقق من الأذونات لمجلد البيانات: `chown -R 1001:1001 data/postgres`
*   تحقق من السجلات: `docker logs raidan_db`

---

**حقوق الملكية:**
نظام RaidanPro مملوك ومشفر لصالح الجهة المشغلة. يمنع نسخ الكود المصدري خارج البيئة السيادية.

import { ModuleInfo, Service } from './types';

export const MODULES: ModuleInfo[] = [
  { id: 'root_command', title: 'برج المراقبة (Root Command)', icon: '🏰', description: 'Coolify (Ops), Authentik (SSO), Sovereign Resource Governor' },
  // FIX: Replaced invalid module ID 'brain' with 'dialect_engine' to conform to the ActiveModule type.
  { id: 'dialect_engine', title: 'النواة الذكية (AI Core)', icon: '🧠', description: 'Ollama (Native), RAGFlow (Content Intel), Faster-Whisper XXL (CPU Mode)' },
  // FIX: Replaced invalid module ID 'watchtower' with 'data_journalism' to conform to the ActiveModule type.
  { id: 'data_journalism', title: 'الاستخبارات (OSINT Suite)', icon: '🔭', description: 'SearXNG, Maigret, OpenSanctions API, Neo4j (Relationship Graph), GDELT' },
  // FIX: Replaced invalid module ID 'cleanroom' with 'forensics_lab' to conform to the ActiveModule type.
  { id: 'forensics_lab', title: 'التحقق (Forensics)', icon: '🔬', description: 'DeepSafe (Deepfake), VR-Arch (Audio Isolation), Sherloq' },
  { id: 'smart_newsroom', title: 'غرفة الأخبار (Production)', icon: '📰', description: 'Strapi (CMS), Apache Superset (Viz), LanguageTool (Proofing)' },
  // FIX: Replaced invalid module ID 'vault' with 'data_feeds' to conform to the ActiveModule type.
  { id: 'data_feeds', title: 'البيانات والأتمتة (Data & Ops)', icon: '🔐', description: 'n8n, Strapi (Headless), NocoDB, MinIO (S3), PostgreSQL 16' },
];

export const INITIAL_SERVICES: Service[] = [
  { 
    id: 'ai-2', name: 'Faster-Whisper XXL', module: 'brain', status: 'running', cpu: 65, ram: 4096, 
    description: 'محرك التفريغ الصوتي. يعمل على المعالج المركزي حصراً لضمان أعلى دقة في اللهجات اليمنية.',
    image: 'yemenjpt/whisper-xxl-cpu:latest',
    requirements: { minRam: '8GB', minCpu: '16 Cores', storage: '5GB' }
  },
  { 
    id: 'ai-3', name: 'VR-Arch Isolator', module: 'cleanroom', status: 'running', cpu: 30, ram: 2048, 
    description: 'وحدة عزل الصوت. تنقية التسجيلات من الضجيج قبل المعالجة الجنائية.',
    image: 'yemenjpt/uvr-vrarch-cpu:v2.0',
    requirements: { minRam: '4GB', minCpu: '8 Cores', storage: '2GB' }
  },
  { 
    id: 'nr-1', name: 'Strapi Enterprise', module: 'smart_newsroom', status: 'running', cpu: 8, ram: 2048, 
    description: 'نظام إدارة المحتوى (CMS) لتنظيم ونشر التقارير الاستقصائية وتخزين المرفقات الجنائية.',
    image: 'strapi/strapi:latest',
    requirements: { minRam: '4GB', minCpu: '2 Cores', storage: '10GB' }
  },
  // ... rest of core services
  { 
    id: 'rc-1', name: 'Coolify Engine', module: 'root_command', status: 'running', cpu: 4, ram: 2048, 
    description: 'الحاكم التشغيلي المسؤول عن نشر الحاويات وإدارة الموارد.',
    image: 'coolify/engine:latest',
    requirements: { minRam: '4GB', minCpu: '2 Cores', storage: '20GB' }
  }
];

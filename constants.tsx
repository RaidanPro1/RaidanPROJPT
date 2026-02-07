import { ModuleInfo, Service } from './types';

export const MODULES: ModuleInfo[] = [
  { id: 'root_command', title: 'برج المراقبة (Root Command)', icon: '🏰', description: 'Portainer (Ops), Traefik (Gateway), Sovereign Resource Governor' },
  { id: 'dialect_engine', title: 'النواة الذكية (AI Core)', icon: '🧠', description: 'Ollama (Native), LobeChat (UI), Faster-Whisper XXL' },
  { id: 'data_journalism', title: 'الاستخبارات (OSINT Suite)', icon: '🔭', description: 'TimescaleDB, Grafana (Viz), Neo4j, GDELT' },
  { id: 'data_feeds', title: 'الأتمتة (Nervous System)', icon: '🔐', description: 'n8n Workflows, Python Scrapers, MinIO (S3)' },
];

export const INITIAL_SERVICES: Service[] = [
  { 
    id: 'gw-1', name: 'Gateway Orchestrator', module: 'root_command', status: 'running', cpu: 2, ram: 512, 
    description: 'البوابة المركزية لتنسيق الطلبات بين المختبرات والواجهة الأمامية.',
    image: 'yjpt/gateway:latest',
    requirements: { minRam: '512MB', minCpu: '1 Core', storage: '1GB' }
  },
  { 
    id: 'lab-img', name: 'Image Forensics Lab', module: 'forensics_lab', status: 'running', cpu: 15, ram: 2048, 
    description: 'مختبر تحليل الصور الجنائي المستند إلى خوارزميات ELA و CFA.',
    image: 'yjpt/image-lab:tomcat9-jdk8',
    requirements: { minRam: '2GB', minCpu: '2 Cores', storage: '5GB' }
  },
  { 
    id: 'lab-aud', name: 'Audio Intelligence', module: 'forensics_lab', status: 'running', cpu: 45, ram: 8192, 
    description: 'محرك فصل المصادر الصوتية وتنقية التسجيلات الرديئة (Demucs/DFN).',
    image: 'yjpt/audio-lab:pytorch-gpu',
    requirements: { minRam: '8GB', minCpu: '4 Cores', storage: '10GB' }
  },
  { 
    id: 'ai-gw', name: 'LiteLLM Gateway', module: 'dialect_engine', status: 'running', cpu: 5, ram: 1024, 
    description: 'البوابة الموحدة للتعامل مع النماذج المحلية (Ollama) والسحابية (Gemini).',
    image: 'litellm/litellm:latest',
    requirements: { minRam: '1GB', minCpu: '1 Core', storage: '1GB' }
  },
  { 
    id: 'ctx-1', name: 'Context Engine (Qdrant)', module: 'data_journalism', status: 'running', cpu: 12, ram: 4096, 
    description: 'قاعدة بيانات المتجهات لتخزين الأرشيف اليمني والبحث الدلالي.',
    image: 'qdrant/qdrant:latest',
    requirements: { minRam: '4GB', minCpu: '4 Cores', storage: '50GB' }
  }
];
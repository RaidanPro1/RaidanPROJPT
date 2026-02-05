
import { ModuleInfo, Service } from './types';

export const MODULES: ModuleInfo[] = [
  { id: 'brain', title: 'النواة الذكية (Local AI)', icon: '🧠', description: 'Ollama, Llama 3, Whisper, Lobe Chat, Qwen' },
  { id: 'watchtower', title: 'الاستخبارات (Watchtower)', icon: '🔭', description: 'SearXNG, n8n, SpiderFoot, Sherlock, Maigret, Kepler' },
  { id: 'cleanroom', title: 'التحليل الجنائي (Clean Room)', icon: '🔬', description: 'Sherloq, Ghiro, AV Lab, Joytag, ExifRead' },
  { id: 'warroom', title: 'مراقبة الأزمات (War Room)', icon: '🛰️', description: 'Ushahidi, SORMAS, OpenRouteService' },
  { id: 'vault', title: 'الأرشفة (The Vault)', icon: '🔐', description: 'Aleph, ArchiveBox, PhotoPrism, SiYuan, ToolJet' },
  { id: 'media', title: 'الإنتاج والنشر (Media)', icon: '🎬', description: 'Ghost, Owncast, AzuraCast, Postiz, Payload, FFmpeg' },
  { id: 'shield', title: 'الأمن (The Shield)', icon: '🛡️', description: 'SecureDrop, Nextcloud, Mattermost, Vaultwarden, Kasm' },
  { id: 'hosting', title: 'إدارة البنية (Hosting)', icon: '🏗️', description: 'Coolify, Portainer, Nginx PM, Traefik, Supabase' },
];

export const INITIAL_SERVICES: Service[] = [
  // --- Brain (AI & Processing) ---
  { id: 'b1', name: 'Ollama', module: 'brain', status: 'running', cpu: 12, ram: 4096, description: 'محرك LLM محلي مع GPU Passthrough', image: 'ollama/ollama' },
  { id: 'b2', name: 'Llama 3 (Meta)', module: 'brain', status: 'running', cpu: 45, ram: 8192, description: 'النموذج اللغوي السيادي الأساسي', image: 'meta/llama3' },
  { id: 'b3', name: 'Whisper (OpenAI)', module: 'brain', status: 'running', cpu: 8, ram: 2048, description: 'تفريغ الصوت وتحويل الكلام لنص', image: 'openai/whisper' },
  { id: 'b4', name: 'Lobe Chat', module: 'brain', status: 'running', cpu: 2, ram: 512, description: 'واجهة دردشة عصرية ودعم Plugins', image: 'lobehub/lobe-chat' },
  { id: 'b5', name: 'Faster Whisper XXL', module: 'brain', status: 'stopped', cpu: 0, ram: 0, description: 'نسخة محسنة للتفريغ الصوتي السريع', image: 'cbro33/faster-whisper-xxl' },
  { id: 'b6', name: 'AP Local AI', module: 'brain', status: 'running', cpu: 5, ram: 1024, description: 'نظام إدارة الذكاء الاصطناعي للصحفيين', image: 'ap/local-ai' },
  { id: 'b7', name: 'Qwen2.5-Sex', module: 'brain', status: 'running', cpu: 4, ram: 2048, description: 'تصنيف المحتوى وتحليل التحيز الجندري', image: 'systemsrx/qwen-sex' },
  { id: 'b8', name: 'NextChat', module: 'brain', status: 'running', cpu: 1, ram: 256, description: 'واجهة خفيفة للنماذج اللغوية', image: 'chatgptnextweb/nextchat' },
  { id: 'b9', name: 'Press-to-Talk', module: 'brain', status: 'stopped', cpu: 0, ram: 0, description: 'واجهة تفاعل صوتي فورية مع العقل الرقمي', image: 'aiaicaramba/p2t' },

  // --- Watchtower (OSINT & Intelligence) ---
  { id: 'w1', name: 'SearXNG', module: 'watchtower', status: 'running', cpu: 2, ram: 512, description: 'محرك بحث خصوصي مجمع', image: 'searxng/searxng' },
  { id: 'w2', name: 'n8n', module: 'watchtower', status: 'running', cpu: 2, ram: 1024, description: 'عصب الأتمتة والربط بين الأدوات', image: 'n8nio/n8n' },
  { id: 'w3', name: 'SpiderFoot', module: 'watchtower', status: 'running', cpu: 4, ram: 1024, description: 'أداة استطلاع آلي لجمع المعلومات', image: 'spiderfoot/spiderfoot' },
  { id: 'w4', name: 'Sherlock', module: 'watchtower', status: 'stopped', cpu: 0, ram: 0, description: 'تتبع الهوية الرقمية عبر الشبكات', image: 'sherlock/sherlock' },
  { id: 'w5', name: 'Maigret', module: 'watchtower', status: 'running', cpu: 2, ram: 512, description: 'تحقيق متقدم في الهويات الرقمية', image: 'soxoj/maigret' },
  { id: 'w6', name: 'Kepler.gl', module: 'watchtower', status: 'running', cpu: 3, ram: 1024, description: 'تحليل البيانات الجغرافية وخرائط النزاع', image: 'keplergl/keplergl' },
  { id: 'w7', name: 'Huginn', module: 'watchtower', status: 'running', cpu: 5, ram: 2048, description: 'نظام وكلاء لرصد الويب والتغييرات', image: 'huginn/huginn' },
  { id: 'w8', name: 'TrendRadar', module: 'watchtower', status: 'stopped', cpu: 0, ram: 0, description: 'رصد الاتجاهات والمواضيع الشائعة', image: 'sansan0/trendradar' },

  // --- Clean Room (Forensics) ---
  { id: 'c1', name: 'Ghiro', module: 'cleanroom', status: 'running', cpu: 5, ram: 1024, description: 'تحليل جنائي آلي للصور', image: 'ghiro/ghiro' },
  { id: 'c2', name: 'Sherloq', module: 'cleanroom', status: 'running', cpu: 1, ram: 512, description: 'أدوات فحص ميتاداتا الصور المتقدمة', image: 'revalo/sherloq' },
  { id: 'c3', name: 'AV Processing Lab', module: 'cleanroom', status: 'running', cpu: 10, ram: 2048, description: 'مختبر معالجة الصوت والفيديو بالذكاء الاصطناعي', image: 'dharmendra/av-lab' },
  { id: 'c4', name: 'Joytag', module: 'cleanroom', status: 'stopped', cpu: 0, ram: 0, description: 'تصنيف الصور والوسوم آلياً', image: 'starthua/joytag' },

  // --- Vault (Storage & Archiving) ---
  { id: 'v1', name: 'Aleph (OCCRP)', module: 'vault', status: 'running', cpu: 15, ram: 8192, description: 'الأرشيف المركزي للوثائق المسربة', image: 'alephdata/aleph' },
  { id: 'v2', name: 'ArchiveBox', module: 'vault', status: 'running', cpu: 2, ram: 512, description: 'نظام أرشفة الويب الدائم لحفظ الأدلة', image: 'archivebox/archivebox' },
  { id: 'v3', name: 'PhotoPrism', module: 'vault', status: 'running', cpu: 6, ram: 2048, description: 'خزنة الصور الذكية بالذكاء الاصطناعي', image: 'photoprism/photoprism' },
  { id: 'v4', name: 'SiYuan', module: 'vault', status: 'running', cpu: 2, ram: 1024, description: 'نظام تدوين الملاحظات المعرفي المشفر', image: 'siyuan-note/siyuan' },
  { id: 'v5', name: 'ToolJet', module: 'vault', status: 'stopped', cpu: 0, ram: 0, description: 'بناء أدوات داخلية بدون كود', image: 'tooljet/tooljet' },
  { id: 'v6', name: 'Reactive Resume', module: 'vault', status: 'running', cpu: 1, ram: 512, description: 'بناء وإدارة السير الذاتية المهنية', image: 'amruthpillai/reactive-resume' },

  // --- Media (Production & Newsroom) ---
  { id: 'm1', name: 'Ghost CMS', module: 'media', status: 'running', cpu: 3, ram: 1024, description: 'منصة النشر السيادي والتدوين الاستقصائي', image: 'ghost:latest' },
  { id: 'm2', name: 'Owncast', module: 'media', status: 'stopped', cpu: 0, ram: 0, description: 'خادم بث الفيديو المباشر المستقل', image: 'owncast/owncast' },
  { id: 'm3', name: 'AzuraCast', module: 'media', status: 'stopped', cpu: 0, ram: 0, description: 'إدارة الإذاعات الرقمية والبث الصوتي', image: 'azuracast/azuracast' },
  { id: 'm4', name: 'Postiz', module: 'media', status: 'running', cpu: 2, ram: 512, description: 'إدارة النشر عبر التواصل الاجتماعي', image: 'postiz/postiz' },
  { id: 'm5', name: 'Payload CMS', module: 'media', status: 'running', cpu: 4, ram: 1024, description: 'نظام إدارة محتوى متطور للتطبيقات المخصصة', image: 'payloadcms/payload' },
  { id: 'm6', name: 'FFmpeg Node', module: 'media', status: 'running', cpu: 20, ram: 2048, description: 'محرك معالجة وتحويل الوسائط المتعددة', image: 'ffmpeg/ffmpeg' },

  // --- Shield (Security) ---
  { id: 's1', name: 'Mattermost', module: 'shield', status: 'running', cpu: 4, ram: 2048, description: 'نظام التواصل المشفر للفريق', image: 'mattermost/mattermost-team-edition' },
  { id: 's2', name: 'Vaultwarden', module: 'shield', status: 'running', cpu: 1, ram: 256, description: 'إدارة كلمات المرور المشفرة للمؤسسة', image: 'vaultwarden/server' },
  { id: 's3', name: 'Kasm Workspaces', module: 'shield', status: 'running', cpu: 8, ram: 4096, description: 'بيئة المتصفح المعزول لفتح الروابط المشبوهة', image: 'kasmweb/core' },
  { id: 's4', name: 'SecureDrop', module: 'shield', status: 'running', cpu: 4, ram: 2048, description: 'بوابة استقبال التسريبات والوثائق السرية', image: 'securedrop/securedrop' },
  { id: 's5', name: 'Nextcloud Hub', module: 'shield', status: 'running', cpu: 6, ram: 2048, description: 'السحابة السيادية لتخزين المستندات والتعاون', image: 'nextcloud:latest' },

  // --- Hosting (Infrastructure) ---
  { id: 'h1', name: 'Coolify', module: 'hosting', status: 'running', cpu: 4, ram: 1024, description: 'المحرك الأساسي لإدارة الحاويات والانتشار', image: 'coollabsio/coolify' },
  { id: 'h2', name: 'Portainer CE', module: 'hosting', status: 'running', cpu: 2, ram: 512, description: 'واجهة إدارة Docker الرسومية المتقدمة', image: 'portainer/portainer-ce' },
  { id: 'h3', name: 'Nginx Proxy Manager', module: 'hosting', status: 'running', cpu: 2, ram: 512, description: 'بوابة التوجيه الآمنة وتشفير SSL', image: 'jc21/nginx-proxy-manager' },
  { id: 'h4', name: 'Traefik Proxy', module: 'hosting', status: 'running', cpu: 3, ram: 512, description: 'موازن أحمال وتوجيه سحابي متطور', image: 'traefik:v3.0' },
  { id: 'h5', name: 'Supabase Local', module: 'hosting', status: 'stopped', cpu: 0, ram: 0, description: 'بنية تحتية كاملة لقواعد البيانات (بديل Firebase)', image: 'supabase/supabase' },
  { id: 'h6', name: 'WireGuard / Headscale', module: 'hosting', status: 'running', cpu: 1, ram: 256, description: 'الشبكة المشفرة والربط بين العقد', image: 'linuxserver/wireguard' },
  { id: 'h7', name: 'Technitium DNS', module: 'hosting', status: 'running', cpu: 2, ram: 512, description: 'خادم DNS محلي لإدارة النطاقات ومنع الحجب', image: 'technitium/dns-server' },
];

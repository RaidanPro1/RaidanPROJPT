
import React, { useState } from 'react';
import { Copy, Check, FileCode, ShieldAlert, Layers, CheckCircle2, FileJson, Server } from 'lucide-react';

const ConfigGenerator: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'master' | 'traefik' | 'env'>('master');

  const masterCompose = `version: '3.8'

# YemenJPT Master Sovereign Infrastructure
# Server: hosting.raidan.pro

networks:
  yemenjpt-net:
    driver: bridge
    name: yemenjpt-net

services:
  # --- Core: Reverse Proxy ---
  traefik:
    image: traefik:v3.0
    container_name: yjpt-traefik
    command:
      - "--api.insecure=false"
      - "--providers.docker=true"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.yjpt-resolver.acme.email=admin@raidan.pro"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./traefik/acme.json:/acme.json
    networks: [yemenjpt-net]
    restart: always

  # --- Core: Local Database Stack ---
  postgres:
    image: postgres:16-alpine
    container_name: yjpt-db
    environment:
      POSTGRES_DB: yemenjpt_central
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
    networks: [yemenjpt-net]
    deploy:
      resources:
        limits:
          memory: 4096M

  redis:
    image: redis:7-alpine
    container_name: yjpt-cache
    networks: [yemenjpt-net]
    command: redis-server --appendonly yes

  # --- Core: Sovereignty Management ---
  coolify:
    image: ghcr.io/coollabsio/coolify:latest
    container_name: yjpt-manager
    networks: [yemenjpt-net]
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    labels:
      - "traefik.http.routers.coolify.rule=Host(\`hosting.raidan.pro\`)"

secrets:
  db_password:
    file: ./secrets/db_password.txt`;

  const traefikLabels = `# Traefik Labels for YemenJPT Tools
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.aleph.rule=Host(\`vault.raidan.pro\`)"
  - "traefik.http.routers.aleph.entrypoints=websecure"
  - "traefik.http.routers.aleph.tls.certresolver=yjpt-resolver"
  - "traefik.http.middlewares.yjpt-compress.compress=true"`;

  const envFile = `# Central Environment for YemenJPT
SERVER_NAME=hosting.raidan.pro
ADMIN_EMAIL=admin@raidan.pro
LOCAL_AI_URL=http://ollama:11434
YEMEN_TIMEZONE=Asia/Sanaa
BACKUP_PATH=/mnt/secure_backups/yjpt
VPN_GATEWAY=10.8.0.1`;

  const copyToClipboard = () => {
    let text = "";
    if (activeTab === 'master') text = masterCompose;
    else if (activeTab === 'traefik') text = traefikLabels;
    else text = envFile;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Server className="text-yemenBlue" />
            توليد ملفات البنية التحتية (Master Files)
          </h2>
          <p className="text-gray-500 text-sm">توليد ملفات الإعداد الأساسية لخادم raidan.pro.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('master')}
            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'master' ? 'bg-white shadow text-yemenBlue' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Master Compose
          </button>
          <button 
            onClick={() => setActiveTab('traefik')}
            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'traefik' ? 'bg-white shadow text-yemenBlue' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Traefik Labels
          </button>
          <button 
            onClick={() => setActiveTab('env')}
            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'env' ? 'bg-white shadow text-yemenBlue' : 'text-gray-500 hover:text-gray-700'}`}
          >
            .env Config
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-yemenBlue-dark rounded-xl p-4 mb-6 relative group border-4 border-yemenBlue">
          <button 
            onClick={copyToClipboard}
            className="absolute top-4 left-4 bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-all z-10"
          >
            {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
          </button>
          <pre className="text-xs font-mono text-blue-100 overflow-x-auto custom-scrollbar max-h-[500px] leading-relaxed">
            {activeTab === 'master' ? masterCompose : activeTab === 'traefik' ? traefikLabels : envFile}
          </pre>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-4">
          <ShieldAlert className="text-amber-600 mt-1 flex-shrink-0" />
          <div className="text-xs text-amber-800 leading-relaxed">
            <strong>تحذير أمني:</strong> لا تقم بمشاركة ملف <code className="bg-amber-100 px-1 rounded">.env</code> أو ملفات الأسرار (Secrets) على GitHub العام. تأكد من أن ملف <code className="bg-amber-100 px-1 rounded">acme.json</code> لديه صلاحيات <code className="bg-amber-100 px-1 rounded">600</code>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigGenerator;

-- YemenJPT Sovereign SaaS Schema v1.7.2
-- Optimized for PostgreSQL 16+

-- 1. جدول المستأجرين (Tenants)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'maintenance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. مكدس الخدمات السيادية (Service Stacks)
CREATE TABLE IF NOT EXISTS service_stacks (
    tenant_id UUID PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
    enabled_services JSONB NOT NULL DEFAULT '{
        "ollama": true, 
        "ragflow": true, 
        "neo4j": true, 
        "n8n": true,
        "mailu": false,
        "ghost": false
    }'::jsonb,
    config_overrides JSONB DEFAULT '{}'::jsonb
);

-- 3. مفاتيح الربط الخارجية (API Keys)
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL DEFAULT 'cloudflare',
    api_token TEXT NOT NULL, -- يجب تشفيره في الواقع باستخدام AES-256
    zone_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. حصص الموارد (Resource Quotas)
CREATE TABLE IF NOT EXISTS resource_quotas (
    tenant_id UUID PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
    max_cpu FLOAT DEFAULT 2.0,
    max_ram_mb INTEGER DEFAULT 4096,
    max_storage_gb INTEGER DEFAULT 50,
    max_users INTEGER DEFAULT 5
);

-- 5. NEW: سجل هوية الوحدات (System Modules Registry)
CREATE TABLE IF NOT EXISTS system_modules_registry (
    module_key VARCHAR(50) PRIMARY KEY,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50) NOT NULL, -- Storing Lucide icon name string
    is_active BOOLEAN DEFAULT true,
    route_path VARCHAR(100) NOT NULL UNIQUE
);

-- إدراج البيانات الافتراضية لسجل الوحدات
INSERT INTO system_modules_registry (module_key, display_name, description, icon_name, is_active, route_path) VALUES
    ('dashboard', 'الرئيسية (System Hub)', 'نظرة عامة على حالة النظام والوحدات.', 'LayoutDashboard', true, 'dashboard'),
    ('root_command', 'برج المراقبة (Root)', 'إدارة البنية التحتية والسيادة.', 'TowerControl', true, 'root_command'),
    ('governance', 'عقيدة النظام', 'إدارة أخلاقيات وسلوك الذكاء الاصطناعي.', 'BookText', true, 'governance'),
    ('smart_newsroom', 'غرفة الأخبار الذكية', 'إدارة النشر والتقارير الاستقصائية.', 'Newspaper', true, 'smart_newsroom'),
    ('forensics_lab', 'مختبر الجنايات الرقمية', 'كشف التزييف العميق وتحليل الصور.', 'Fingerprint', true, 'forensics_lab'),
    ('predictive_center', 'مركز الاستبصار', 'رصد الأحداث والإنذار المبكر.', 'Radar', true, 'predictive_center'),
    ('geo_int_station', 'محطة الاستقصاء الجغرافي', 'تحليل الصور الفضائية Sentinel-2.', 'Map', true, 'geo_int_station'),
    ('dialect_engine', 'محرك "مُنصت" الصوتي', 'تفريغ XXL وعزل الصوت عبر VR-Arch.', 'Mic2', true, 'dialect_engine'),
    ('data_journalism', 'كاشف الفساد', 'رسم العلاقات والبحث في Aleph.', 'Share2', true, 'data_journalism'),
    ('branding', 'تخصيص الواجهة', 'إدارة الهوية البصرية والعلامة التجارية.', 'Palette', true, 'branding'),
    ('tenants', 'إدارة المستأجرين', 'إدارة الكيانات السيادية والوصول.', 'Users', true, 'tenants'),
    ('tool_identity', 'هوية الأدوات', 'تخصيص أسماء وأيقونات الوحدات.', 'Wrench', true, 'tool_identity'),
    ('core_settings', 'الإعدادات المتقدمة', 'إعدادات النواة والتكاملات.', 'Sliders', true, 'core_settings'),
    ('terminal', 'Terminal', 'واجهة الأوامر للتحكم المباشر.', 'Terminal', true, 'terminal')
ON CONFLICT (module_key) DO NOTHING;


-- الفهارس لسرعة الاستعلام (Indices)
CREATE INDEX IF NOT EXISTS idx_tenants_domain ON tenants(domain);
CREATE INDEX IF NOT EXISTS idx_api_keys_tenant ON api_keys(tenant_id);

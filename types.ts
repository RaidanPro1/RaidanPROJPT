
export type ServiceStatus = 'running' | 'stopped' | 'restarting' | 'error';

export interface Service {
  id: string;
  name: string;
  module: string;
  status: ServiceStatus;
  cpu: number;
  ram: number;
  description: string;
  image: string;
  requirements?: {
    minRam: string;
    minCpu: string;
    storage: string;
  };
}

export type DomainStatus = 'pending_dns' | 'active' | 'suspended' | 'maintenance' | 'error';

export interface Domain {
  id: string;
  domain_name: string;
  client_name: string;
  status: DomainStatus;
  service_stack: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: DomainStatus;
  cf_status: 'connected' | 'error' | 'verifying';
  cpu_usage: number;
  ram_usage: number;
  services: string[];
  created_at: string;
  email_config?: {
    enabled: boolean;
    inbound_address: string[];
    forward_to: string;
    smtp_server: string;
    smtp_user: string;
    smtp_port: number;
    dns_status: 'verified' | 'pending' | 'failed';
  };
  // NEW: Publishing Settings
  publishing_config?: {
    wordpress_url?: string;
    wordpress_api_key?: string;
    ghost_url?: string;
    ghost_admin_key?: string;
    social_connections?: {
      facebook: boolean;
      twitter: boolean;
      linkedin: boolean;
    };
  };
  // NEW: Hosting & DNS Specs
  hosting_spec?: {
    plan: string;
    storage_limit: string;
    bandwidth_limit: string;
    region: string;
  };
}

export interface SystemMetrics {
  totalCpu: number;
  totalRam: number;
  diskSpace: number;
  uptime: string;
  temp: number;
}

export type ActiveModule = 
  | 'dashboard' 
  | 'root_command' 
  | 'smart_newsroom' 
  | 'forensics_lab' 
  | 'predictive_center' 
  | 'dialect_engine' 
  | 'geo_int_station' 
  | 'data_journalism' 
  | 'branding' 
  | 'tenants' 
  | 'core_settings'
  | 'terminal'
  | 'tool_identity'
  | 'data_feeds'
  | 'governance'
  | 'profile'
  | 'public_chat'
  | 'predictive_hub'
  | 'seo_manager'
  | 'marketing_editor'; // NEW

export interface ModuleInfo {
  id: ActiveModule;
  title: string;
  icon: string;
  description: string;
}

export interface ModuleRegistryInfo {
  module_key: string;
  display_name: string;
  description: string;
  icon_name: string; 
  is_active: boolean;
  route_path: string;
}

export interface DataSource {
  id: number;
  name: string;
  is_active: boolean;
  fetch_frequency: string;
  auth_type: 'no_auth' | 'api_key' | 'bearer_token';
  last_status: string | null;
  last_run_log: string | null;
  last_crawled_at: string | null;
}

export interface SeoConfig {
  siteTitle: string;
  description: string;
  keywords: string[];
  ogImage: string;
  twitterHandle?: string;
  robotsTxt: string;
  sitemapEnabled: boolean;
}

// NEW: Marketing Landing Page Config
export interface LandingPageConfig {
  heroTitle: { ar: string; en: string };
  heroSubtitle: { ar: string; en: string };
  features: Array<{ title: { ar: string; en: string }; desc: { ar: string; en: string }; icon: string }>;
  videoUrl?: string;
  showPricing: boolean;
}

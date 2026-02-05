

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
  | 'data_feeds' // New module for the Data Feeds Manager
  | 'governance'
  | 'profile'; // NEW: For User Profile Page

export interface ModuleInfo {
  // FIX: Replaced undefined type 'ModuleType' with 'ActiveModule'.
  id: ActiveModule;
  title: string;
  icon: string;
  description: string;
}

// NEW: Type for dynamic module/tool identity from backend
export interface ModuleRegistryInfo {
  module_key: string;
  display_name: string;
  description: string;
  icon_name: string; // Can be a Lucide icon name or a URL path
  is_active: boolean;
  route_path: string;
}

// Type for the Data Feeds Manager
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

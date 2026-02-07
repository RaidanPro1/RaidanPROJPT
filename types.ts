
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

export interface ModuleInfo {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export interface Domain {
  id: string;
  domain_name: string;
  client_name: string;
  status: DomainStatus;
  service_stack: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}

export interface DataSource {
  id: number;
  name: string;
  is_active: boolean;
  fetch_frequency: string;
  auth_type: string;
  last_status: string;
  last_run_log: string;
  last_crawled_at: string;
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
  publishing_config?: {
    ghost_api_key?: string;
    ghost_url?: string;
    wordpress_url?: string;
    wordpress_user?: string;
    wordpress_app_password?: string;
    social_channels: {
      x_twitter: boolean;
      facebook: boolean;
      telegram: boolean;
      whatsapp_channel: boolean;
    };
    webhook_notify_url?: string;
  };
  email_config?: {
    enabled?: boolean;
    inbound_address: string[];
    forward_to: string;
    smtp_server: string;
    smtp_user: string;
    smtp_port: number;
    dns_status: 'verified' | 'pending' | 'failed';
  };
}

export type ActiveModule = 
  | 'dashboard' 
  | 'root_command' 
  | 'smart_newsroom' 
  | 'forensics_lab' 
  | 'dialect_engine' 
  | 'geo_int_station' 
  | 'branding' 
  | 'tenants' 
  | 'core_settings'
  | 'terminal'
  | 'tool_identity'
  | 'data_feeds'
  | 'governance'
  | 'profile'
  | 'public_chat'
  | 'predictive_center'
  | 'predictive_hub'
  | 'seo_manager'
  | 'marketing_editor'
  | 'model_forge'
  | 'recovery_vault';

export interface ModuleRegistryInfo {
  module_key: string;
  display_name: string;
  description: string;
  icon_name: string; 
  is_active: boolean;
  route_path: string;
  settings?: any;
}

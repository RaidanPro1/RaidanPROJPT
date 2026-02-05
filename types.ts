
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
}

export interface SystemMetrics {
  totalCpu: number;
  totalRam: number;
  diskSpace: number;
  uptime: string;
}

export type ModuleType = 'brain' | 'watchtower' | 'cleanroom' | 'warroom' | 'vault' | 'shield' | 'hosting' | 'media';

export interface ModuleInfo {
  id: ModuleType;
  title: string;
  icon: string;
  description: string;
}

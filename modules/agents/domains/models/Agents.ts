// Generated model interfaces for Agents

// Common response wrapper
interface ResponseObject<T> {
  data: T;
}

// Pagination parameters
interface PaginationParams {
  page?: number;
  page_size?: number;
}

// Paginated response
interface PaginationList<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Response interfaces
interface AgentsListResponseItem {
  id: number;
  user: Record<string, any>;
  created_at: string;
  updated_at: string;
  name: string;
  mac_address: string;
  status?: 'up' | 'down';
  ip_address: string;
  access_port?: number;
  extra_info?: Record<string, any>;
  period?: number;
  type?: 'subnet' | 'dns' | 'vm';
  registered?: boolean;
  cpu_usage?: number;
  total_mem?: number;
  mem_usage?: number;
  total_disk?: number;
  disk_usage?: number;
}

interface AgentsCreateResponse {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  mac_address: string;
  status?: 'up' | 'down';
  ip_address: string;
  access_port?: number;
  extra_info?: Record<string, any>;
  period?: number;
  type?: 'subnet' | 'dns' | 'vm';
  registered?: boolean;
  cpu_usage?: number;
  total_mem?: number;
  mem_usage?: number;
  total_disk?: number;
  disk_usage?: number;
  user: number;
}

interface AgentsRetrieveResponse {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  mac_address: string;
  status?: 'up' | 'down';
  ip_address: string;
  access_port?: number;
  extra_info?: Record<string, any>;
  period?: number;
  type?: 'subnet' | 'dns' | 'vm';
  registered?: boolean;
  cpu_usage?: number;
  total_mem?: number;
  mem_usage?: number;
  total_disk?: number;
  disk_usage?: number;
  user: number;
}

interface AgentsUpdateResponse {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  mac_address: string;
  status?: 'up' | 'down';
  ip_address: string;
  access_port?: number;
  extra_info?: Record<string, any>;
  period?: number;
  type?: 'subnet' | 'dns' | 'vm';
  registered?: boolean;
  cpu_usage?: number;
  total_mem?: number;
  mem_usage?: number;
  total_disk?: number;
  disk_usage?: number;
  user: number;
}

interface AgentsAllSubnetsRetrieveResponse {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  mac_address: string;
  status?: 'up' | 'down';
  ip_address: string;
  access_port?: number;
  extra_info?: Record<string, any>;
  period?: number;
  type?: 'subnet' | 'dns' | 'vm';
  registered?: boolean;
  cpu_usage?: number;
  total_mem?: number;
  mem_usage?: number;
  total_disk?: number;
  disk_usage?: number;
  user: number;
}

interface AgentsHealthRetrieveResponse {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  mac_address: string;
  status?: 'up' | 'down';
  ip_address: string;
  access_port?: number;
  extra_info?: Record<string, any>;
  period?: number;
  type?: 'subnet' | 'dns' | 'vm';
  registered?: boolean;
  cpu_usage?: number;
  total_mem?: number;
  mem_usage?: number;
  total_disk?: number;
  disk_usage?: number;
  user: number;
}

interface AgentsAgentConfigRetrieveResponse {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  mac_address: string;
  status?: 'up' | 'down';
  ip_address: string;
  access_port?: number;
  extra_info?: Record<string, any>;
  period?: number;
  type?: 'subnet' | 'dns' | 'vm';
  registered?: boolean;
  cpu_usage?: number;
  total_mem?: number;
  mem_usage?: number;
  total_disk?: number;
  disk_usage?: number;
  user: number;
}

interface AgentsRecentSubnetsRetrieveResponse {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  mac_address: string;
  status?: 'up' | 'down';
  ip_address: string;
  access_port?: number;
  extra_info?: Record<string, any>;
  period?: number;
  type?: 'subnet' | 'dns' | 'vm';
  registered?: boolean;
  cpu_usage?: number;
  total_mem?: number;
  mem_usage?: number;
  total_disk?: number;
  disk_usage?: number;
  user: number;
}

interface AgentsUpdateAgentUpdateResponse {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  mac_address: string;
  status?: 'up' | 'down';
  ip_address: string;
  access_port?: number;
  extra_info?: Record<string, any>;
  period?: number;
  static_token: string;
  type?: 'subnet' | 'dns' | 'vm';
  registered?: boolean;
  cpu_usage?: number;
  total_mem?: number;
  mem_usage?: number;
  total_disk?: number;
  disk_usage?: number;
  user: number;
}

// Model interfaces

// Parameter interfaces
interface AgentsListParams {
  advance_filter?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  q?: string;
}

interface AgentsRecentSubnetsRetrieveParams {
  last_scan_time: number;
}

// Request body interfaces
interface AgentsCreateRequest {
  name: string;
  mac_address: string;
  status?: 'up' | 'down';
  ip_address: string;
  access_port?: number;
  extra_info?: Record<string, any>;
  period?: number;
  type?: 'subnet' | 'dns' | 'vm';
  registered?: boolean;
  cpu_usage?: number;
  total_mem?: number;
  mem_usage?: number;
  total_disk?: number;
  disk_usage?: number;
  user: number;
}

interface AgentsUpdateRequest {
  name: string;
  mac_address: string;
  status?: 'up' | 'down';
  ip_address: string;
  access_port?: number;
  extra_info?: Record<string, any>;
  period?: number;
  type?: 'subnet' | 'dns' | 'vm';
  registered?: boolean;
  cpu_usage?: number;
  total_mem?: number;
  mem_usage?: number;
  total_disk?: number;
  disk_usage?: number;
  user: number;
}

interface AgentsUpdateAgentUpdateRequest {
  name: string;
  mac_address: string;
  status?: 'up' | 'down';
  ip_address: string;
  access_port?: number;
  extra_info?: Record<string, any>;
  period?: number;
  type?: 'subnet' | 'dns' | 'vm';
  registered?: boolean;
  cpu_usage?: number;
  total_mem?: number;
  mem_usage?: number;
  total_disk?: number;
  disk_usage?: number;
}



// Export all model interfaces
export {
  ResponseObject,
  PaginationParams,
  PaginationList,
  AgentsListResponseItem,
  AgentsCreateResponse,
  AgentsRetrieveResponse,
  AgentsUpdateResponse,
  AgentsAllSubnetsRetrieveResponse,
  AgentsHealthRetrieveResponse,
  AgentsAgentConfigRetrieveResponse,
  AgentsRecentSubnetsRetrieveResponse,
  AgentsUpdateAgentUpdateResponse,
  AgentsListParams,
  AgentsRecentSubnetsRetrieveParams,
  AgentsCreateRequest,
  AgentsUpdateRequest,
  AgentsUpdateAgentUpdateRequest
};
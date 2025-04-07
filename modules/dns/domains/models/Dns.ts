// Generated model interfaces for Dns

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
interface DnsARecordsListResponseItem {
  id: number;
  name: string;
  ttl?: number;
  zone: number;
  subnet_id: number;
  created_at: string;
  updated_at: string;
  type: string;
}

interface DnsARecordsCreateResponse {
  id: number;
  name: string;
  ttl?: number;
  zone: number;
  subnet_id: number;
  created_at: string;
  updated_at: string;
  type: string;
}

interface DnsARecordsRetrieveResponse {
  id: number;
  name: string;
  ttl?: number;
  zone: number;
  subnet_id: number;
  created_at: string;
  updated_at: string;
  type: string;
}

interface DnsARecordsUpdateResponse {
  id: number;
  name: string;
  ttl?: number;
  zone: number;
  subnet_id: number;
  created_at: string;
  updated_at: string;
  type: string;
}

interface DnsAaaaRecordsListResponseItem {
  id: number;
  subnet_id: number;
  type: string;
  zone: number;
  ttl?: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface DnsAaaaRecordsCreateResponse {
  id: number;
  subnet_id: number;
  type: string;
  zone: number;
  ttl?: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface DnsAaaaRecordsRetrieveResponse {
  id: number;
  subnet_id: number;
  type: string;
  zone: number;
  ttl?: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface DnsAaaaRecordsUpdateResponse {
  id: number;
  subnet_id: number;
  type: string;
  zone: number;
  ttl?: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface DnsPtrRecordsListResponseItem {
  id: number;
  name: string;
  ttl?: number;
  target: string;
  zone: number;
  subnet_id: number;
  created_at: string;
  updated_at: string;
  type: string;
}

interface DnsPtrRecordsCreateResponse {
  id: number;
  name: string;
  ttl?: number;
  target: string;
  zone: number;
  subnet_id: number;
  created_at: string;
  updated_at: string;
  type: string;
}

interface DnsPtrRecordsRetrieveResponse {
  id: number;
  name: string;
  ttl?: number;
  target: string;
  zone: number;
  subnet_id: number;
  created_at: string;
  updated_at: string;
  type: string;
}

interface DnsPtrRecordsUpdateResponse {
  id: number;
  name: string;
  ttl?: number;
  target: string;
  zone: number;
  subnet_id: number;
  created_at: string;
  updated_at: string;
  type: string;
}

interface DnsQueryIpCreateResponse {
  subnet_id: number;
  ip_address: string;
  zone_id: number;
}

interface DnsQueryListIpsCreateResponse {
  zone_id: number;
  value_type: 'ip' | 'subnet';
  subnet_id: number;
  ip_list?: string[];
}

interface DnsQueryResultCreateResponse {
  zone_id: number;
  subnet_id: number;
  ip_results: Record<string, any>[];
}

interface DnsZonesListResponseItem {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  ip_address: string;
  port: number;
}

interface DnsZonesCreateResponse {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  ip_address: string;
  port: number;
}

interface DnsZonesRetrieveResponse {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  ip_address: string;
  port: number;
}

interface DnsZonesUpdateResponse {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  ip_address: string;
  port: number;
}

interface DnsZonesCsvCreateResponse {
  file: string;
}

// Model interfaces

// Parameter interfaces
interface DnsARecordsListParams {
  advance_filter?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  q?: string;
  zone?: number;
}

interface DnsAaaaRecordsListParams {
  advance_filter?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  q?: string;
  zone?: number;
}

interface DnsPtrRecordsListParams {
  advance_filter?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  q?: string;
  zone?: number;
}

interface DnsZonesListParams {
  advance_filter?: string;
  ip_address?: string;
  name?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  port?: number;
  q?: string;
}

// Request body interfaces
interface DnsARecordsCreateRequest {
  name: string;
  ttl?: number;
  zone: number;
  address: string;
  subnet_id: number;
}

interface DnsARecordsUpdateRequest {
  name: string;
  ttl?: number;
  zone: number;
  address: string;
  subnet_id: number;
}

interface DnsAaaaRecordsCreateRequest {
  address: string;
  subnet_id: number;
  zone: number;
  ttl?: number;
  name: string;
}

interface DnsAaaaRecordsUpdateRequest {
  address: string;
  subnet_id: number;
  zone: number;
  ttl?: number;
  name: string;
}

interface DnsPtrRecordsCreateRequest {
  name: string;
  ttl?: number;
  target: string;
  zone: number;
  address: string;
  subnet_id: number;
}

interface DnsPtrRecordsUpdateRequest {
  name: string;
  ttl?: number;
  target: string;
  zone: number;
  address: string;
  subnet_id: number;
}

interface DnsQueryIpCreateRequest {
  subnet_id: number;
  ip_address: string;
  zone_id: number;
}

interface DnsQueryListIpsCreateRequest {
  zone_id: number;
  value_type: 'ip' | 'subnet';
  subnet_id: number;
  ip_list?: string[];
}

interface DnsQueryResultCreateRequest {
  zone_id: number;
  subnet_id: number;
  ip_results: Record<string, any>[];
}

interface DnsZonesCreateRequest {
  name: string;
  ip_address: string;
  port: number;
}

interface DnsZonesUpdateRequest {
  name: string;
  ip_address: string;
  port: number;
}

interface DnsZonesCsvCreateRequest {
  file: string;
}



// Export all model interfaces
export {
  ResponseObject,
  PaginationParams,
  PaginationList,
  DnsARecordsListResponseItem,
  DnsARecordsCreateResponse,
  DnsARecordsRetrieveResponse,
  DnsARecordsUpdateResponse,
  DnsAaaaRecordsListResponseItem,
  DnsAaaaRecordsCreateResponse,
  DnsAaaaRecordsRetrieveResponse,
  DnsAaaaRecordsUpdateResponse,
  DnsPtrRecordsListResponseItem,
  DnsPtrRecordsCreateResponse,
  DnsPtrRecordsRetrieveResponse,
  DnsPtrRecordsUpdateResponse,
  DnsQueryIpCreateResponse,
  DnsQueryListIpsCreateResponse,
  DnsQueryResultCreateResponse,
  DnsZonesListResponseItem,
  DnsZonesCreateResponse,
  DnsZonesRetrieveResponse,
  DnsZonesUpdateResponse,
  DnsZonesCsvCreateResponse,
  DnsARecordsListParams,
  DnsAaaaRecordsListParams,
  DnsPtrRecordsListParams,
  DnsZonesListParams,
  DnsARecordsCreateRequest,
  DnsARecordsUpdateRequest,
  DnsAaaaRecordsCreateRequest,
  DnsAaaaRecordsUpdateRequest,
  DnsPtrRecordsCreateRequest,
  DnsPtrRecordsUpdateRequest,
  DnsQueryIpCreateRequest,
  DnsQueryListIpsCreateRequest,
  DnsQueryResultCreateRequest,
  DnsZonesCreateRequest,
  DnsZonesUpdateRequest,
  DnsZonesCsvCreateRequest
};
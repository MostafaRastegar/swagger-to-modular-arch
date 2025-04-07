// Generated model interfaces for Vlan

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
interface VlanListResponseItem {
  id: number;
  service_name?: string;
  description?: string;
  network_view: Record<string, any>;
  office: Record<string, any>;
  main_office: Record<string, any>;
  device_type: Record<string, any>;
  region: Record<string, any>[];
  device_name: Record<string, any>[];
  ranges: Record<string, any>[];
  extensible_attributes: string;
}

interface VlanCreateResponse {
  main_office: number;
  office: number;
  description?: string;
  service_name?: string;
  vlan_infos: Record<string, any>[];
}

interface VlanRetrieveResponse {
  id: number;
  extensible_attributes: string;
  ranges: Record<string, any>[];
  created_at: string;
  updated_at: string;
  ticket_id?: string;
  service_name?: string;
  description?: string;
  user: number;
  network_view: number;
  office: number;
  main_office: number;
  device_type?: number;
  region: number[];
  device_name: number[];
}

interface VlanUpdateResponse {
  id: number;
  extensible_attributes?: Record<string, any>[];
  ranges: Record<string, any>[];
  created_at: string;
  updated_at: string;
  ticket_id?: string;
  service_name?: string;
  description?: string;
  user: number;
  network_view: number;
  office: number;
  main_office: number;
  device_type?: number;
  region: number[];
  device_name: number[];
}

interface VlanRangeListResponseItem {
  id: number;
  created_at: string;
  updated_at: string;
  start_range: number;
  end_range: number;
  range_type: 'vlan' | 'network_view';
  vlan?: number;
  network_view?: number;
}

interface VlanRangeCreateResponse {
  id: number;
  created_at: string;
  updated_at: string;
  start_range: number;
  end_range: number;
  range_type: 'vlan' | 'network_view';
  vlan?: number;
  network_view?: number;
}

interface VlanRangeRetrieveResponse {
  id: number;
  created_at: string;
  updated_at: string;
  start_range: number;
  end_range: number;
  range_type: 'vlan' | 'network_view';
  vlan?: number;
  network_view?: number;
}

interface VlanRangeUpdateResponse {
  id: number;
  created_at: string;
  updated_at: string;
  start_range: number;
  end_range: number;
  range_type: 'vlan' | 'network_view';
  vlan?: number;
  network_view?: number;
}

interface VlanRangeBulkCreateCreateResponse {
  range_type: 'vlan' | 'network_view';
  network_view?: number;
  vlan?: number;
  ranges: Record<string, any>[];
}

// Model interfaces

// Parameter interfaces
interface VlanListParams {
  advance_filter?: string;
  description?: string;
  device_name?: number[];
  device_type?: number;
  main_office?: number;
  network_view?: number;
  office?: number;
  ordering?: string;
  page?: number;
  page_size?: number;
  q?: string;
  region?: number[];
  service_name?: string;
}

interface VlanExportRetrieveParams {
  type?: string;
}

interface VlanRangeListParams {
  advance_filter?: string;
  network_view?: number;
  ordering?: string;
  page?: number;
  page_size?: number;
  q?: string;
  range_type?: 'network_view' | 'vlan';
  vlan?: number;
}

// Request body interfaces
interface VlanCreateRequest {
  main_office: number;
  office: number;
  description?: string;
  service_name?: string;
  vlan_infos: Record<string, any>[];
}

interface VlanUpdateRequest {
  extensible_attributes?: Record<string, any>[];
  ranges: Record<string, any>[];
  ticket_id?: string;
  service_name?: string;
  description?: string;
  user: number;
  network_view: number;
  office: number;
  main_office: number;
  device_type?: number;
  region: number[];
  device_name: number[];
}

interface VlanRangeCreateRequest {
  start_range: number;
  end_range: number;
  range_type: 'vlan' | 'network_view';
  vlan?: number;
  network_view?: number;
}

interface VlanRangeUpdateRequest {
  start_range: number;
  end_range: number;
  range_type: 'vlan' | 'network_view';
  vlan?: number;
  network_view?: number;
}

interface VlanRangeBulkCreateCreateRequest {
  range_type: 'vlan' | 'network_view';
  network_view?: number;
  vlan?: number;
  ranges: Record<string, any>[];
}



// Export all model interfaces
export {
  ResponseObject,
  PaginationParams,
  PaginationList,
  VlanListResponseItem,
  VlanCreateResponse,
  VlanRetrieveResponse,
  VlanUpdateResponse,
  VlanRangeListResponseItem,
  VlanRangeCreateResponse,
  VlanRangeRetrieveResponse,
  VlanRangeUpdateResponse,
  VlanRangeBulkCreateCreateResponse,
  VlanListParams,
  VlanExportRetrieveParams,
  VlanRangeListParams,
  VlanCreateRequest,
  VlanUpdateRequest,
  VlanRangeCreateRequest,
  VlanRangeUpdateRequest,
  VlanRangeBulkCreateCreateRequest
};
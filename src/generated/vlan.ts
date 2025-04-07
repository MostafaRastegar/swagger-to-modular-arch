// Generated file for vlan - Unified implementation
import { serviceHandler } from '../utils/serviceHandler';
import request from '../utils/request';
import { useQuery, useMutation } from 'react-query';

// ===== ENDPOINTS =====
const endpoints = {
  VLAN: {
    GET_VLAN: () => `${HOST_URL_API}/api/vlan/`,
    POST_VLAN: () => `${HOST_URL_API}/api/vlan/`,
    GET_VLAN_ID: (id: string | number) => `${HOST_URL_API}/api/vlan/${id}/`,
    PUT_VLAN_ID: (id: string | number) => `${HOST_URL_API}/api/vlan/${id}/`,
    DELETE_VLAN_ID: (id: string | number) => `${HOST_URL_API}/api/vlan/${id}/`,
    GET_VLAN_EXPORT: () => `${HOST_URL_API}/api/vlan/export/`,
    GET_VLAN_RANGE: () => `${HOST_URL_API}/api/vlan/range/`,
    POST_VLAN_RANGE: () => `${HOST_URL_API}/api/vlan/range/`,
    GET_VLAN_RANGE_ID: (id: string | number) => `${HOST_URL_API}/api/vlan/range/${id}/`,
    PUT_VLAN_RANGE_ID: (id: string | number) => `${HOST_URL_API}/api/vlan/range/${id}/`,
    DELETE_VLAN_RANGE_ID: (id: string | number) => `${HOST_URL_API}/api/vlan/range/${id}/`,
    POST_VLAN_RANGE_BULK_CREATE: () => `${HOST_URL_API}/api/vlan/range/bulk-create/`,
  },
};


// ===== INTERFACES =====
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
// Model interfaces
interface PaginatedVlanListList {
  count: number;
  next?: string;
  previous?: string;
  results: VlanList[];
}

interface VlanCreate {
  main_office: number;
  office: number;
  description?: string;
  service_name?: string;
  vlan_infos: VlanSingleInfoReq[];
}

interface VlanCreateRequest {
  main_office: number;
  office: number;
  description?: string;
  service_name?: string;
  vlan_infos: VlanSingleInfoReqRequest[];
}

interface Vlan {
  id: number;
  extensible_attributes: string;
  ranges: RangeVlan[];
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

interface VlanUpdate {
  id: number;
  extensible_attributes?: AttributeValue[];
  ranges: RangeVlan[];
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

interface VlanUpdateRequest {
  extensible_attributes?: AttributeValueRequest[];
  ranges: RangeVlanRequest[];
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

interface PaginatedRangeList {
  count: number;
  next?: string;
  previous?: string;
  results: Range[];
}

interface Range {
  id: number;
  created_at: string;
  updated_at: string;
  start_range: number;
  end_range: number;
  range_type: RangeTypeEnum;
  vlan?: number;
  network_view?: number;
}

interface RangeRequest {
  start_range: number;
  end_range: number;
  range_type: RangeTypeEnum;
  vlan?: number;
  network_view?: number;
}

interface RangeBulkCreate {
  range_type: RangeTypeEnum;
  network_view?: number;
  vlan?: number;
  ranges: RangeVlan[];
}

interface RangeBulkCreateRequest {
  range_type: RangeTypeEnum;
  network_view?: number;
  vlan?: number;
  ranges: RangeVlanRequest[];
}


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
type VlanRangeCreateRequest = RangeRequest;

type VlanRangeUpdateRequest = RangeRequest;

type VlanRangeBulkCreateCreateRequest = RangeBulkCreateRequest;

// Service interface
interface IVlanService {
  vlanList(params: VlanListParams): Promise<ResponseObject<PaginatedVlanListList>>;
  vlanCreate(): Promise<ResponseObject<VlanCreate>>;
  vlanRetrieve(id: number): Promise<ResponseObject<Vlan>>;
  vlanUpdate(id: number): Promise<ResponseObject<VlanUpdate>>;
  vlanDestroy(id: number): Promise<void>;
  vlanExportRetrieve(params: VlanExportRetrieveParams): Promise<ResponseObject<any>>;
  vlanRangeList(params: VlanRangeListParams): Promise<ResponseObject<PaginatedRangeList>>;
  vlanRangeCreate(body: VlanRangeCreateRequest): Promise<ResponseObject<Range>>;
  vlanRangeRetrieve(id: number): Promise<ResponseObject<Range>>;
  vlanRangeUpdate(id: number, body: VlanRangeUpdateRequest): Promise<ResponseObject<Range>>;
  vlanRangeDestroy(id: number): Promise<void>;
  vlanRangeBulkCreateCreate(body: VlanRangeBulkCreateCreateRequest): Promise<ResponseObject<RangeBulkCreate>>;
}


// ===== SERVICE IMPLEMENTATION =====
function VlanService(): IVlanService {
  return {
    vlanList: (params) => 
      serviceHandler(() => 
        request().get(endpoints.VLAN.GET_VLAN(), { params })
      ),
    vlanCreate: (body) => 
      serviceHandler(() => 
        request().post(endpoints.VLAN.POST_VLAN(), body)
      ),
    vlanRetrieve: (id) => 
      serviceHandler(() => 
        request().get(endpoints.VLAN.GET_VLAN_ID(id))
      ),
    vlanUpdate: (id, body) => 
      serviceHandler(() => 
        request().put(endpoints.VLAN.PUT_VLAN_ID(id), body)
      ),
    vlanDestroy: (id) => 
      serviceHandler(() => 
        request().delete(endpoints.VLAN.DELETE_VLAN_ID(id))
      ),
    vlanExportRetrieve: (params) => 
      serviceHandler(() => 
        request().get(endpoints.VLAN.GET_VLAN_EXPORT(), { params })
      ),
    vlanRangeList: (params) => 
      serviceHandler(() => 
        request().get(endpoints.VLAN.GET_VLAN_RANGE(), { params })
      ),
    vlanRangeCreate: (body) => 
      serviceHandler(() => 
        request().post(endpoints.VLAN.POST_VLAN_RANGE(), body)
      ),
    vlanRangeRetrieve: (id) => 
      serviceHandler(() => 
        request().get(endpoints.VLAN.GET_VLAN_RANGE_ID(id))
      ),
    vlanRangeUpdate: (id, body) => 
      serviceHandler(() => 
        request().put(endpoints.VLAN.PUT_VLAN_RANGE_ID(id), body)
      ),
    vlanRangeDestroy: (id) => 
      serviceHandler(() => 
        request().delete(endpoints.VLAN.DELETE_VLAN_RANGE_ID(id))
      ),
    vlanRangeBulkCreateCreate: (body) => 
      serviceHandler(() => 
        request().post(endpoints.VLAN.POST_VLAN_RANGE_BULK_CREATE(), body)
      )
  };
}


// ===== PRESENTATION LAYER =====
// React Query hooks for vlan
function VlanPresentation() {
  const Service = VlanService();

  return {
    useVlanList: (params) => {
      return useQuery({
        queryKey: ['vlan-vlanList', ...Object.values(params)],
        queryFn: () => Service.vlanList(params),
      });
    },

    useVlanCreate: () => {
      return useMutation({
        mutationFn: (params: any) => {
          return Service.vlanCreate(params);
        },
      });
    },

    useVlanRetrieve: (id) => {
      return useQuery({
        queryKey: ['vlan-vlanRetrieve', id],
        queryFn: () => Service.vlanRetrieve(id),
      });
    },

    useVlanUpdate: () => {
      return useMutation({
        mutationFn: (params: { id: number, body: any }) => {
          return Service.vlanUpdate(params.id, params.body);
        },
      });
    },

    useVlanDestroy: () => {
      return useMutation({
        mutationFn: (id: number) => {
          return Service.vlanDestroy(id);
        },
      });
    },

    useVlanExportRetrieve: (params) => {
      return useQuery({
        queryKey: ['vlan-vlanExportRetrieve', ...Object.values(params)],
        queryFn: () => Service.vlanExportRetrieve(params),
      });
    },

    useVlanRangeList: (params) => {
      return useQuery({
        queryKey: ['vlan-vlanRangeList', ...Object.values(params)],
        queryFn: () => Service.vlanRangeList(params),
      });
    },

    useVlanRangeCreate: () => {
      return useMutation({
        mutationFn: (body: VlanRangeCreateRequest) => {
          return Service.vlanRangeCreate(body);
        },
      });
    },

    useVlanRangeRetrieve: (id) => {
      return useQuery({
        queryKey: ['vlan-vlanRangeRetrieve', id],
        queryFn: () => Service.vlanRangeRetrieve(id),
      });
    },

    useVlanRangeUpdate: () => {
      return useMutation({
        mutationFn: (params: { id: number, body: any }) => {
          return Service.vlanRangeUpdate(params.id, params.body);
        },
      });
    },

    useVlanRangeDestroy: () => {
      return useMutation({
        mutationFn: (id: number) => {
          return Service.vlanRangeDestroy(id);
        },
      });
    },

    useVlanRangeBulkCreateCreate: () => {
      return useMutation({
        mutationFn: (body: VlanRangeBulkCreateCreateRequest) => {
          return Service.vlanRangeBulkCreateCreate(body);
        },
      });
    },

  };
}


// Export everything
export { VlanService, VlanPresentation, endpoints };
// Generated service interface for Vlan
import {
  ResponseObject,
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
  VlanRangeBulkCreateCreateRequest,
  interface
} from './models/Vlan';

// Service interface
interface IVlanService {
  vlanList(params: VlanListParams): Promise<ResponseObject<PaginationList<VlanListResponseItem>>>;
  vlanCreate(body: VlanCreateRequest): Promise<ResponseObject<VlanCreateResponse>>;
  vlanRetrieve(id: number): Promise<ResponseObject<VlanRetrieveResponse>>;
  vlanUpdate(id: number, body: VlanUpdateRequest): Promise<ResponseObject<VlanUpdateResponse>>;
  vlanDestroy(id: number): Promise<void>;
  vlanExportRetrieve(params: VlanExportRetrieveParams): Promise<ResponseObject<any>>;
  vlanRangeList(params: VlanRangeListParams): Promise<ResponseObject<PaginationList<VlanRangeListResponseItem>>>;
  vlanRangeCreate(body: VlanRangeCreateRequest): Promise<ResponseObject<VlanRangeCreateResponse>>;
  vlanRangeRetrieve(id: number): Promise<ResponseObject<VlanRangeRetrieveResponse>>;
  vlanRangeUpdate(id: number, body: VlanRangeUpdateRequest): Promise<ResponseObject<VlanRangeUpdateResponse>>;
  vlanRangeDestroy(id: number): Promise<void>;
  vlanRangeBulkCreateCreate(body: VlanRangeBulkCreateCreateRequest): Promise<ResponseObject<VlanRangeBulkCreateCreateResponse>>;
}


export { IVlanService };
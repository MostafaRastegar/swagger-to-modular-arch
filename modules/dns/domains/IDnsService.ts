// Generated service interface for Dns
import {
  ResponseObject,
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
  DnsZonesCsvCreateRequest,
  interface
} from './models/Dns';

// Service interface
interface IDnsService {
  dnsARecordsList(params: DnsARecordsListParams): Promise<ResponseObject<PaginationList<DnsARecordsListResponseItem>>>;
  dnsARecordsCreate(body: DnsARecordsCreateRequest): Promise<ResponseObject<DnsARecordsCreateResponse>>;
  dnsARecordsRetrieve(id: number): Promise<ResponseObject<DnsARecordsRetrieveResponse>>;
  dnsARecordsUpdate(id: number, body: DnsARecordsUpdateRequest): Promise<ResponseObject<DnsARecordsUpdateResponse>>;
  dnsARecordsDestroy(id: number): Promise<void>;
  dnsAaaaRecordsList(params: DnsAaaaRecordsListParams): Promise<ResponseObject<PaginationList<DnsAaaaRecordsListResponseItem>>>;
  dnsAaaaRecordsCreate(body: DnsAaaaRecordsCreateRequest): Promise<ResponseObject<DnsAaaaRecordsCreateResponse>>;
  dnsAaaaRecordsRetrieve(id: number): Promise<ResponseObject<DnsAaaaRecordsRetrieveResponse>>;
  dnsAaaaRecordsUpdate(id: number, body: DnsAaaaRecordsUpdateRequest): Promise<ResponseObject<DnsAaaaRecordsUpdateResponse>>;
  dnsAaaaRecordsDestroy(id: number): Promise<void>;
  dnsPtrRecordsList(params: DnsPtrRecordsListParams): Promise<ResponseObject<PaginationList<DnsPtrRecordsListResponseItem>>>;
  dnsPtrRecordsCreate(body: DnsPtrRecordsCreateRequest): Promise<ResponseObject<DnsPtrRecordsCreateResponse>>;
  dnsPtrRecordsRetrieve(id: number): Promise<ResponseObject<DnsPtrRecordsRetrieveResponse>>;
  dnsPtrRecordsUpdate(id: number, body: DnsPtrRecordsUpdateRequest): Promise<ResponseObject<DnsPtrRecordsUpdateResponse>>;
  dnsPtrRecordsDestroy(id: number): Promise<void>;
  dnsQueryIpCreate(body: DnsQueryIpCreateRequest): Promise<ResponseObject<DnsQueryIpCreateResponse>>;
  dnsQueryListIpsCreate(body: DnsQueryListIpsCreateRequest): Promise<ResponseObject<DnsQueryListIpsCreateResponse>>;
  dnsQueryResultCreate(body: DnsQueryResultCreateRequest): Promise<ResponseObject<DnsQueryResultCreateResponse>>;
  dnsZonesList(params: DnsZonesListParams): Promise<ResponseObject<PaginationList<DnsZonesListResponseItem>>>;
  dnsZonesCreate(body: DnsZonesCreateRequest): Promise<ResponseObject<DnsZonesCreateResponse>>;
  dnsZonesRetrieve(id: number): Promise<ResponseObject<DnsZonesRetrieveResponse>>;
  dnsZonesUpdate(id: number, body: DnsZonesUpdateRequest): Promise<ResponseObject<DnsZonesUpdateResponse>>;
  dnsZonesDestroy(id: number): Promise<void>;
  dnsZonesCsvCreate(body: DnsZonesCsvCreateRequest): Promise<ResponseObject<DnsZonesCsvCreateResponse>>;
}


export { IDnsService };
// Generated file for dns - Unified implementation
import { serviceHandler } from '../utils/serviceHandler';
import request from '../utils/request';
import { useQuery, useMutation } from 'react-query';

// ===== ENDPOINTS =====
const endpoints = {
  DNS: {
    GET_DNS_A_RECORDS: () => `${HOST_URL_API}/api/dns/a-records/`,
    POST_DNS_A_RECORDS: () => `${HOST_URL_API}/api/dns/a-records/`,
    GET_DNS_A_RECORDS_ID: (id: string | number) => `${HOST_URL_API}/api/dns/a-records/${id}/`,
    PUT_DNS_A_RECORDS_ID: (id: string | number) => `${HOST_URL_API}/api/dns/a-records/${id}/`,
    DELETE_DNS_A_RECORDS_ID: (id: string | number) => `${HOST_URL_API}/api/dns/a-records/${id}/`,
    GET_DNS_AAAA_RECORDS: () => `${HOST_URL_API}/api/dns/aaaa-records/`,
    POST_DNS_AAAA_RECORDS: () => `${HOST_URL_API}/api/dns/aaaa-records/`,
    GET_DNS_AAAA_RECORDS_ID: (id: string | number) => `${HOST_URL_API}/api/dns/aaaa-records/${id}/`,
    PUT_DNS_AAAA_RECORDS_ID: (id: string | number) => `${HOST_URL_API}/api/dns/aaaa-records/${id}/`,
    DELETE_DNS_AAAA_RECORDS_ID: (id: string | number) => `${HOST_URL_API}/api/dns/aaaa-records/${id}/`,
    GET_DNS_PTR_RECORDS: () => `${HOST_URL_API}/api/dns/ptr-records/`,
    POST_DNS_PTR_RECORDS: () => `${HOST_URL_API}/api/dns/ptr-records/`,
    GET_DNS_PTR_RECORDS_ID: (id: string | number) => `${HOST_URL_API}/api/dns/ptr-records/${id}/`,
    PUT_DNS_PTR_RECORDS_ID: (id: string | number) => `${HOST_URL_API}/api/dns/ptr-records/${id}/`,
    DELETE_DNS_PTR_RECORDS_ID: (id: string | number) => `${HOST_URL_API}/api/dns/ptr-records/${id}/`,
    POST_DNS_QUERY_IP: () => `${HOST_URL_API}/api/dns/query-ip/`,
    POST_DNS_QUERY_LIST_IPS: () => `${HOST_URL_API}/api/dns/query-list-ips/`,
    POST_DNS_QUERY_RESULT: () => `${HOST_URL_API}/api/dns/query-result/`,
    GET_DNS_ZONES: () => `${HOST_URL_API}/api/dns/zones/`,
    POST_DNS_ZONES: () => `${HOST_URL_API}/api/dns/zones/`,
    GET_DNS_ZONES_ID: (id: string | number) => `${HOST_URL_API}/api/dns/zones/${id}/`,
    PUT_DNS_ZONES_ID: (id: string | number) => `${HOST_URL_API}/api/dns/zones/${id}/`,
    DELETE_DNS_ZONES_ID: (id: string | number) => `${HOST_URL_API}/api/dns/zones/${id}/`,
    POST_DNS_ZONES_CSV: () => `${HOST_URL_API}/api/dns/zones/csv/`,
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
interface PaginatedARecordList {
  count: number;
  next?: string;
  previous?: string;
  results: ARecord[];
}

interface ARecord {
  id: number;
  name: string;
  ttl?: number;
  zone: number;
  subnet_id: number;
  created_at: string;
  updated_at: string;
  type: string;
}

interface ARecordRequest {
  name: string;
  ttl?: number;
  zone: number;
  address: string;
  subnet_id: number;
}

interface PaginatedAAAARecordList {
  count: number;
  next?: string;
  previous?: string;
  results: AAAARecord[];
}

interface AAAARecord {
  id: number;
  subnet_id: number;
  type: string;
  zone: number;
  ttl?: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface AAAARecordRequest {
  address: string;
  subnet_id: number;
  zone: number;
  ttl?: number;
  name: string;
}

interface PaginatedPTRRecordList {
  count: number;
  next?: string;
  previous?: string;
  results: PTRRecord[];
}

interface PTRRecord {
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

interface PTRRecordRequest {
  name: string;
  ttl?: number;
  target: string;
  zone: number;
  address: string;
  subnet_id: number;
}

interface QuerySingleIp {
  subnet_id: number;
  ip_address: string;
  zone_id: number;
}

interface QuerySingleIpRequest {
  subnet_id: number;
  ip_address: string;
  zone_id: number;
}

interface QueryMultipleIP {
  zone_id: number;
  value_type: ValueTypeEnum;
  subnet_id: number;
  ip_list?: string[];
}

interface QueryMultipleIPRequest {
  zone_id: number;
  value_type: ValueTypeEnum;
  subnet_id: number;
  ip_list?: string[];
}

interface Result {
  zone_id: number;
  subnet_id: number;
  ip_results: SingleResult[];
}

interface ResultRequest {
  zone_id: number;
  subnet_id: number;
  ip_results: SingleResultRequest[];
}

interface PaginatedZoneList {
  count: number;
  next?: string;
  previous?: string;
  results: Zone[];
}

interface Zone {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  ip_address: string;
  port: number;
}

interface ZoneRequest {
  name: string;
  ip_address: string;
  port: number;
}

interface CsvSerailizer {
  file: string;
}

interface CsvSerailizerRequest {
  file: string;
}


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
type DnsARecordsCreateRequest = ARecordRequest;

type DnsARecordsUpdateRequest = ARecordRequest;

type DnsAaaaRecordsCreateRequest = AAAARecordRequest;

type DnsAaaaRecordsUpdateRequest = AAAARecordRequest;

type DnsPtrRecordsCreateRequest = PTRRecordRequest;

type DnsPtrRecordsUpdateRequest = PTRRecordRequest;

type DnsQueryIpCreateRequest = QuerySingleIpRequest;

type DnsQueryListIpsCreateRequest = QueryMultipleIPRequest;

type DnsQueryResultCreateRequest = ResultRequest;

type DnsZonesCreateRequest = ZoneRequest;

type DnsZonesUpdateRequest = ZoneRequest;

type DnsZonesCsvCreateRequest = CsvSerailizerRequest;

// Service interface
interface IDnsService {
  dnsARecordsList(params: DnsARecordsListParams): Promise<ResponseObject<PaginatedARecordList>>;
  dnsARecordsCreate(body: DnsARecordsCreateRequest): Promise<ResponseObject<ARecord>>;
  dnsARecordsRetrieve(id: number): Promise<ResponseObject<ARecord>>;
  dnsARecordsUpdate(id: number, body: DnsARecordsUpdateRequest): Promise<ResponseObject<ARecord>>;
  dnsARecordsDestroy(id: number): Promise<void>;
  dnsAaaaRecordsList(params: DnsAaaaRecordsListParams): Promise<ResponseObject<PaginatedAAAARecordList>>;
  dnsAaaaRecordsCreate(body: DnsAaaaRecordsCreateRequest): Promise<ResponseObject<AAAARecord>>;
  dnsAaaaRecordsRetrieve(id: number): Promise<ResponseObject<AAAARecord>>;
  dnsAaaaRecordsUpdate(id: number, body: DnsAaaaRecordsUpdateRequest): Promise<ResponseObject<AAAARecord>>;
  dnsAaaaRecordsDestroy(id: number): Promise<void>;
  dnsPtrRecordsList(params: DnsPtrRecordsListParams): Promise<ResponseObject<PaginatedPTRRecordList>>;
  dnsPtrRecordsCreate(body: DnsPtrRecordsCreateRequest): Promise<ResponseObject<PTRRecord>>;
  dnsPtrRecordsRetrieve(id: number): Promise<ResponseObject<PTRRecord>>;
  dnsPtrRecordsUpdate(id: number, body: DnsPtrRecordsUpdateRequest): Promise<ResponseObject<PTRRecord>>;
  dnsPtrRecordsDestroy(id: number): Promise<void>;
  dnsQueryIpCreate(body: DnsQueryIpCreateRequest): Promise<ResponseObject<QuerySingleIp>>;
  dnsQueryListIpsCreate(body: DnsQueryListIpsCreateRequest): Promise<ResponseObject<QueryMultipleIP>>;
  dnsQueryResultCreate(body: DnsQueryResultCreateRequest): Promise<ResponseObject<Result>>;
  dnsZonesList(params: DnsZonesListParams): Promise<ResponseObject<PaginatedZoneList>>;
  dnsZonesCreate(body: DnsZonesCreateRequest): Promise<ResponseObject<Zone>>;
  dnsZonesRetrieve(id: number): Promise<ResponseObject<Zone>>;
  dnsZonesUpdate(id: number, body: DnsZonesUpdateRequest): Promise<ResponseObject<Zone>>;
  dnsZonesDestroy(id: number): Promise<void>;
  dnsZonesCsvCreate(body: DnsZonesCsvCreateRequest): Promise<ResponseObject<CsvSerailizer>>;
}


// ===== SERVICE IMPLEMENTATION =====
function DnsService(): IDnsService {
  return {
    dnsARecordsList: (params) => 
      serviceHandler(() => 
        request().get(endpoints.DNS.GET_DNS_A_RECORDS(), { params })
      ),
    dnsARecordsCreate: (body) => 
      serviceHandler(() => 
        request().post(endpoints.DNS.POST_DNS_A_RECORDS(), body)
      ),
    dnsARecordsRetrieve: (id) => 
      serviceHandler(() => 
        request().get(endpoints.DNS.GET_DNS_A_RECORDS_ID(id))
      ),
    dnsARecordsUpdate: (id, body) => 
      serviceHandler(() => 
        request().put(endpoints.DNS.PUT_DNS_A_RECORDS_ID(id), body)
      ),
    dnsARecordsDestroy: (id) => 
      serviceHandler(() => 
        request().delete(endpoints.DNS.DELETE_DNS_A_RECORDS_ID(id))
      ),
    dnsAaaaRecordsList: (params) => 
      serviceHandler(() => 
        request().get(endpoints.DNS.GET_DNS_AAAA_RECORDS(), { params })
      ),
    dnsAaaaRecordsCreate: (body) => 
      serviceHandler(() => 
        request().post(endpoints.DNS.POST_DNS_AAAA_RECORDS(), body)
      ),
    dnsAaaaRecordsRetrieve: (id) => 
      serviceHandler(() => 
        request().get(endpoints.DNS.GET_DNS_AAAA_RECORDS_ID(id))
      ),
    dnsAaaaRecordsUpdate: (id, body) => 
      serviceHandler(() => 
        request().put(endpoints.DNS.PUT_DNS_AAAA_RECORDS_ID(id), body)
      ),
    dnsAaaaRecordsDestroy: (id) => 
      serviceHandler(() => 
        request().delete(endpoints.DNS.DELETE_DNS_AAAA_RECORDS_ID(id))
      ),
    dnsPtrRecordsList: (params) => 
      serviceHandler(() => 
        request().get(endpoints.DNS.GET_DNS_PTR_RECORDS(), { params })
      ),
    dnsPtrRecordsCreate: (body) => 
      serviceHandler(() => 
        request().post(endpoints.DNS.POST_DNS_PTR_RECORDS(), body)
      ),
    dnsPtrRecordsRetrieve: (id) => 
      serviceHandler(() => 
        request().get(endpoints.DNS.GET_DNS_PTR_RECORDS_ID(id))
      ),
    dnsPtrRecordsUpdate: (id, body) => 
      serviceHandler(() => 
        request().put(endpoints.DNS.PUT_DNS_PTR_RECORDS_ID(id), body)
      ),
    dnsPtrRecordsDestroy: (id) => 
      serviceHandler(() => 
        request().delete(endpoints.DNS.DELETE_DNS_PTR_RECORDS_ID(id))
      ),
    dnsQueryIpCreate: (body) => 
      serviceHandler(() => 
        request().post(endpoints.DNS.POST_DNS_QUERY_IP(), body)
      ),
    dnsQueryListIpsCreate: (body) => 
      serviceHandler(() => 
        request().post(endpoints.DNS.POST_DNS_QUERY_LIST_IPS(), body)
      ),
    dnsQueryResultCreate: (body) => 
      serviceHandler(() => 
        request().post(endpoints.DNS.POST_DNS_QUERY_RESULT(), body)
      ),
    dnsZonesList: (params) => 
      serviceHandler(() => 
        request().get(endpoints.DNS.GET_DNS_ZONES(), { params })
      ),
    dnsZonesCreate: (body) => 
      serviceHandler(() => 
        request().post(endpoints.DNS.POST_DNS_ZONES(), body)
      ),
    dnsZonesRetrieve: (id) => 
      serviceHandler(() => 
        request().get(endpoints.DNS.GET_DNS_ZONES_ID(id))
      ),
    dnsZonesUpdate: (id, body) => 
      serviceHandler(() => 
        request().put(endpoints.DNS.PUT_DNS_ZONES_ID(id), body)
      ),
    dnsZonesDestroy: (id) => 
      serviceHandler(() => 
        request().delete(endpoints.DNS.DELETE_DNS_ZONES_ID(id))
      ),
    dnsZonesCsvCreate: (body) => 
      serviceHandler(() => 
        request().post(endpoints.DNS.POST_DNS_ZONES_CSV(), body)
      )
  };
}


// ===== PRESENTATION LAYER =====
// React Query hooks for dns
function DnsPresentation() {
  const Service = DnsService();

  return {
    useDnsARecordsList: (params) => {
      return useQuery({
        queryKey: ['dns-dnsARecordsList', ...Object.values(params)],
        queryFn: () => Service.dnsARecordsList(params),
      });
    },

    useDnsARecordsCreate: () => {
      return useMutation({
        mutationFn: (body: DnsARecordsCreateRequest) => {
          return Service.dnsARecordsCreate(body);
        },
      });
    },

    useDnsARecordsRetrieve: (id) => {
      return useQuery({
        queryKey: ['dns-dnsARecordsRetrieve', id],
        queryFn: () => Service.dnsARecordsRetrieve(id),
      });
    },

    useDnsARecordsUpdate: () => {
      return useMutation({
        mutationFn: (params: { id: number, body: any }) => {
          return Service.dnsARecordsUpdate(params.id, params.body);
        },
      });
    },

    useDnsARecordsDestroy: () => {
      return useMutation({
        mutationFn: (id: number) => {
          return Service.dnsARecordsDestroy(id);
        },
      });
    },

    useDnsAaaaRecordsList: (params) => {
      return useQuery({
        queryKey: ['dns-dnsAaaaRecordsList', ...Object.values(params)],
        queryFn: () => Service.dnsAaaaRecordsList(params),
      });
    },

    useDnsAaaaRecordsCreate: () => {
      return useMutation({
        mutationFn: (body: DnsAaaaRecordsCreateRequest) => {
          return Service.dnsAaaaRecordsCreate(body);
        },
      });
    },

    useDnsAaaaRecordsRetrieve: (id) => {
      return useQuery({
        queryKey: ['dns-dnsAaaaRecordsRetrieve', id],
        queryFn: () => Service.dnsAaaaRecordsRetrieve(id),
      });
    },

    useDnsAaaaRecordsUpdate: () => {
      return useMutation({
        mutationFn: (params: { id: number, body: any }) => {
          return Service.dnsAaaaRecordsUpdate(params.id, params.body);
        },
      });
    },

    useDnsAaaaRecordsDestroy: () => {
      return useMutation({
        mutationFn: (id: number) => {
          return Service.dnsAaaaRecordsDestroy(id);
        },
      });
    },

    useDnsPtrRecordsList: (params) => {
      return useQuery({
        queryKey: ['dns-dnsPtrRecordsList', ...Object.values(params)],
        queryFn: () => Service.dnsPtrRecordsList(params),
      });
    },

    useDnsPtrRecordsCreate: () => {
      return useMutation({
        mutationFn: (body: DnsPtrRecordsCreateRequest) => {
          return Service.dnsPtrRecordsCreate(body);
        },
      });
    },

    useDnsPtrRecordsRetrieve: (id) => {
      return useQuery({
        queryKey: ['dns-dnsPtrRecordsRetrieve', id],
        queryFn: () => Service.dnsPtrRecordsRetrieve(id),
      });
    },

    useDnsPtrRecordsUpdate: () => {
      return useMutation({
        mutationFn: (params: { id: number, body: any }) => {
          return Service.dnsPtrRecordsUpdate(params.id, params.body);
        },
      });
    },

    useDnsPtrRecordsDestroy: () => {
      return useMutation({
        mutationFn: (id: number) => {
          return Service.dnsPtrRecordsDestroy(id);
        },
      });
    },

    useDnsQueryIpCreate: () => {
      return useMutation({
        mutationFn: (body: DnsQueryIpCreateRequest) => {
          return Service.dnsQueryIpCreate(body);
        },
      });
    },

    useDnsQueryListIpsCreate: () => {
      return useMutation({
        mutationFn: (body: DnsQueryListIpsCreateRequest) => {
          return Service.dnsQueryListIpsCreate(body);
        },
      });
    },

    useDnsQueryResultCreate: () => {
      return useMutation({
        mutationFn: (body: DnsQueryResultCreateRequest) => {
          return Service.dnsQueryResultCreate(body);
        },
      });
    },

    useDnsZonesList: (params) => {
      return useQuery({
        queryKey: ['dns-dnsZonesList', ...Object.values(params)],
        queryFn: () => Service.dnsZonesList(params),
      });
    },

    useDnsZonesCreate: () => {
      return useMutation({
        mutationFn: (body: DnsZonesCreateRequest) => {
          return Service.dnsZonesCreate(body);
        },
      });
    },

    useDnsZonesRetrieve: (id) => {
      return useQuery({
        queryKey: ['dns-dnsZonesRetrieve', id],
        queryFn: () => Service.dnsZonesRetrieve(id),
      });
    },

    useDnsZonesUpdate: () => {
      return useMutation({
        mutationFn: (params: { id: number, body: any }) => {
          return Service.dnsZonesUpdate(params.id, params.body);
        },
      });
    },

    useDnsZonesDestroy: () => {
      return useMutation({
        mutationFn: (id: number) => {
          return Service.dnsZonesDestroy(id);
        },
      });
    },

    useDnsZonesCsvCreate: () => {
      return useMutation({
        mutationFn: (body: DnsZonesCsvCreateRequest) => {
          return Service.dnsZonesCsvCreate(body);
        },
      });
    },

  };
}


// Export everything
export { DnsService, DnsPresentation, endpoints };
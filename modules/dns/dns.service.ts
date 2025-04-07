// Generated service implementation for dns
import { serviceHandler } from '../utils/serviceHandler';
import request from '../utils/request';
import { IDnsService } from './domains/IDnsService';

// ENDPOINTS
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


// SERVICE IMPLEMENTATION
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


export { DnsService, endpoints };
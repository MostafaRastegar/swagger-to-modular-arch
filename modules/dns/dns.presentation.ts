// Generated presentation layer for dns
import { useQuery, useMutation } from 'react-query';
import { DnsService } from './dns.service';

// PRESENTATION LAYER
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


export { DnsPresentation };
// Generated presentation layer for vlan
import { useQuery, useMutation } from 'react-query';
import { VlanService } from './vlan.service';

// PRESENTATION LAYER
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
        mutationFn: (body: VlanCreateRequest) => {
          return Service.vlanCreate(body);
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


export { VlanPresentation };
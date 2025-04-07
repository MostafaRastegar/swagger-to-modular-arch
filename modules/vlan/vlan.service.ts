// Generated service implementation for vlan
import { serviceHandler } from '../utils/serviceHandler';
import request from '../utils/request';
import { IVlanService } from './domains/IVlanService';

// ENDPOINTS
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


// SERVICE IMPLEMENTATION
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


export { VlanService, endpoints };
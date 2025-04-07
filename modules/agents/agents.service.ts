// Generated service implementation for agents
import { serviceHandler } from '../utils/serviceHandler';
import request from '../utils/request';
import { IAgentsService } from './domains/IAgentsService';

// ENDPOINTS
const endpoints = {
  AGENTS: {
    GET_AGENTS: () => `${HOST_URL_API}/api/agents/`,
    POST_AGENTS: () => `${HOST_URL_API}/api/agents/`,
    GET_AGENTS_ID: (agent_id: string | number) => `${HOST_URL_API}/api/agents/${agent_id}/`,
    PUT_AGENTS_ID: (agent_id: string | number) => `${HOST_URL_API}/api/agents/${agent_id}/`,
    DELETE_AGENTS_ID: (agent_id: string | number) => `${HOST_URL_API}/api/agents/${agent_id}/`,
    GET_AGENTS_ID_ALL_SUBNETS: (agent_id: string | number) => `${HOST_URL_API}/api/agents/${agent_id}/all-subnets/`,
    GET_AGENTS_ID_HEALTH: (agent_id: string | number) => `${HOST_URL_API}/api/agents/${agent_id}/health/`,
    GET_AGENTS_AGENT_CONFIG: () => `${HOST_URL_API}/api/agents/agent-config/`,
    GET_AGENTS_RECENT_SUBNETS: () => `${HOST_URL_API}/api/agents/recent-subnets/`,
    PUT_AGENTS_UPDATE_AGENT: () => `${HOST_URL_API}/api/agents/update_agent/`,
  },
};


// SERVICE IMPLEMENTATION
function AgentsService(): IAgentsService {
  return {
    agentsList: (params) => 
      serviceHandler(() => 
        request().get(endpoints.AGENTS.GET_AGENTS(), { params })
      ),
    agentsCreate: (body) => 
      serviceHandler(() => 
        request().post(endpoints.AGENTS.POST_AGENTS(), body)
      ),
    agentsRetrieve: (agent_id) => 
      serviceHandler(() => 
        request().get(endpoints.AGENTS.GET_AGENTS_ID(agent_id))
      ),
    agentsUpdate: (agent_id, body) => 
      serviceHandler(() => 
        request().put(endpoints.AGENTS.PUT_AGENTS_ID(agent_id), body)
      ),
    agentsDestroy: (agent_id) => 
      serviceHandler(() => 
        request().delete(endpoints.AGENTS.DELETE_AGENTS_ID(agent_id))
      ),
    agentsAllSubnetsRetrieve: (agent_id) => 
      serviceHandler(() => 
        request().get(endpoints.AGENTS.GET_AGENTS_ID_ALL_SUBNETS(agent_id))
      ),
    agentsHealthRetrieve: (agent_id) => 
      serviceHandler(() => 
        request().get(endpoints.AGENTS.GET_AGENTS_ID_HEALTH(agent_id))
      ),
    agentsAgentConfigRetrieve: (params) => 
      serviceHandler(() => 
        request().get(endpoints.AGENTS.GET_AGENTS_AGENT_CONFIG(), { params })
      ),
    agentsRecentSubnetsRetrieve: (params) => 
      serviceHandler(() => 
        request().get(endpoints.AGENTS.GET_AGENTS_RECENT_SUBNETS(), { params })
      ),
    agentsUpdateAgentUpdate: (body) => 
      serviceHandler(() => 
        request().put(endpoints.AGENTS.PUT_AGENTS_UPDATE_AGENT(), body)
      )
  };
}


export { AgentsService, endpoints };
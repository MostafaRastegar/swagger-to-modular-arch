// Generated file for agents - Unified implementation
import { serviceHandler } from '../utils/serviceHandler';
import request from '../utils/request';
import { useQuery, useMutation } from 'react-query';

// ===== ENDPOINTS =====
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
interface PaginatedGetAgentList {
  count: number;
  next?: string;
  previous?: string;
  results: GetAgent[];
}

interface Agent {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  mac_address: string;
  status?: Status9acEnum;
  ip_address: string;
  access_port?: number;
  extra_info?: Record<string, any>;
  period?: number;
  type?: Type5a3Enum;
  registered?: boolean;
  cpu_usage?: number;
  total_mem?: number;
  mem_usage?: number;
  total_disk?: number;
  disk_usage?: number;
  user: number;
}

interface AgentRequest {
  name: string;
  mac_address: string;
  status?: Status9acEnum;
  ip_address: string;
  access_port?: number;
  extra_info?: Record<string, any>;
  period?: number;
  type?: Type5a3Enum;
  registered?: boolean;
  cpu_usage?: number;
  total_mem?: number;
  mem_usage?: number;
  total_disk?: number;
  disk_usage?: number;
  user: number;
}

interface AgentSerializerForAgent {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  mac_address: string;
  status?: Status9acEnum;
  ip_address: string;
  access_port?: number;
  extra_info?: Record<string, any>;
  period?: number;
  static_token: string;
  type?: Type5a3Enum;
  registered?: boolean;
  cpu_usage?: number;
  total_mem?: number;
  mem_usage?: number;
  total_disk?: number;
  disk_usage?: number;
  user: number;
}

interface AgentSerializerForAgentRequest {
  name: string;
  mac_address: string;
  status?: Status9acEnum;
  ip_address: string;
  access_port?: number;
  extra_info?: Record<string, any>;
  period?: number;
  type?: Type5a3Enum;
  registered?: boolean;
  cpu_usage?: number;
  total_mem?: number;
  mem_usage?: number;
  total_disk?: number;
  disk_usage?: number;
}


// Parameter interfaces
interface AgentsListParams {
  advance_filter?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
  q?: string;
}

interface AgentsRecentSubnetsRetrieveParams {
  last_scan_time: number;
}

// Request body interfaces
type AgentsCreateRequest = AgentRequest;

type AgentsUpdateRequest = AgentRequest;

type AgentsUpdateAgentUpdateRequest = AgentSerializerForAgentRequest;

// Service interface
interface IAgentsService {
  agentsList(params: AgentsListParams): Promise<ResponseObject<PaginatedGetAgentList>>;
  agentsCreate(body: AgentsCreateRequest): Promise<ResponseObject<Agent>>;
  agentsRetrieve(agent_id: number): Promise<ResponseObject<Agent>>;
  agentsUpdate(agent_id: number, body: AgentsUpdateRequest): Promise<ResponseObject<Agent>>;
  agentsDestroy(agent_id: number): Promise<void>;
  agentsAllSubnetsRetrieve(agent_id: number): Promise<ResponseObject<Agent>>;
  agentsHealthRetrieve(agent_id: number): Promise<ResponseObject<Agent>>;
  agentsAgentConfigRetrieve(): Promise<ResponseObject<Agent>>;
  agentsRecentSubnetsRetrieve(params: AgentsRecentSubnetsRetrieveParams): Promise<ResponseObject<Agent>>;
  agentsUpdateAgentUpdate(body: AgentsUpdateAgentUpdateRequest): Promise<ResponseObject<AgentSerializerForAgent>>;
}


// ===== SERVICE IMPLEMENTATION =====
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


// ===== PRESENTATION LAYER =====
// React Query hooks for agents
function AgentsPresentation() {
  const Service = AgentsService();

  return {
    useAgentsList: (params) => {
      return useQuery({
        queryKey: ['agents-agentsList', ...Object.values(params)],
        queryFn: () => Service.agentsList(params),
      });
    },

    useAgentsCreate: () => {
      return useMutation({
        mutationFn: (body: AgentsCreateRequest) => {
          return Service.agentsCreate(body);
        },
      });
    },

    useAgentsRetrieve: (agent_id) => {
      return useQuery({
        queryKey: ['agents-agentsRetrieve', agent_id],
        queryFn: () => Service.agentsRetrieve(agent_id),
      });
    },

    useAgentsUpdate: () => {
      return useMutation({
        mutationFn: (params: { agent_id: number, body: any }) => {
          return Service.agentsUpdate(params.agent_id, params.body);
        },
      });
    },

    useAgentsDestroy: () => {
      return useMutation({
        mutationFn: (agent_id: number) => {
          return Service.agentsDestroy(agent_id);
        },
      });
    },

    useAgentsAllSubnetsRetrieve: (agent_id) => {
      return useQuery({
        queryKey: ['agents-agentsAllSubnetsRetrieve', agent_id],
        queryFn: () => Service.agentsAllSubnetsRetrieve(agent_id),
      });
    },

    useAgentsHealthRetrieve: (agent_id) => {
      return useQuery({
        queryKey: ['agents-agentsHealthRetrieve', agent_id],
        queryFn: () => Service.agentsHealthRetrieve(agent_id),
      });
    },

    useAgentsAgentConfigRetrieve: () => {
      return useQuery({
        queryKey: ['agents-agentsAgentConfigRetrieve'],
        queryFn: () => Service.agentsAgentConfigRetrieve(),
      });
    },

    useAgentsRecentSubnetsRetrieve: (params) => {
      return useQuery({
        queryKey: ['agents-agentsRecentSubnetsRetrieve', ...Object.values(params)],
        queryFn: () => Service.agentsRecentSubnetsRetrieve(params),
      });
    },

    useAgentsUpdateAgentUpdate: () => {
      return useMutation({
        mutationFn: (body: AgentsUpdateAgentUpdateRequest) => {
          return Service.agentsUpdateAgentUpdate(body);
        },
      });
    },

  };
}


// Export everything
export { AgentsService, AgentsPresentation, endpoints };
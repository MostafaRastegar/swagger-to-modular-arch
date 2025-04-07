// Generated service interface for Agents
import {
  ResponseObject,
  PaginationList,
  AgentsListResponseItem,
  AgentsCreateResponse,
  AgentsRetrieveResponse,
  AgentsUpdateResponse,
  AgentsAllSubnetsRetrieveResponse,
  AgentsHealthRetrieveResponse,
  AgentsAgentConfigRetrieveResponse,
  AgentsRecentSubnetsRetrieveResponse,
  AgentsUpdateAgentUpdateResponse,
  AgentsListParams,
  AgentsRecentSubnetsRetrieveParams,
  AgentsCreateRequest,
  AgentsUpdateRequest,
  AgentsUpdateAgentUpdateRequest,
  interface
} from './models/Agents';

// Service interface
interface IAgentsService {
  agentsList(params: AgentsListParams): Promise<ResponseObject<PaginationList<AgentsListResponseItem>>>;
  agentsCreate(body: AgentsCreateRequest): Promise<ResponseObject<AgentsCreateResponse>>;
  agentsRetrieve(agent_id: number): Promise<ResponseObject<AgentsRetrieveResponse>>;
  agentsUpdate(agent_id: number, body: AgentsUpdateRequest): Promise<ResponseObject<AgentsUpdateResponse>>;
  agentsDestroy(agent_id: number): Promise<void>;
  agentsAllSubnetsRetrieve(agent_id: number): Promise<ResponseObject<AgentsAllSubnetsRetrieveResponse>>;
  agentsHealthRetrieve(agent_id: number): Promise<ResponseObject<AgentsHealthRetrieveResponse>>;
  agentsAgentConfigRetrieve(): Promise<ResponseObject<AgentsAgentConfigRetrieveResponse>>;
  agentsRecentSubnetsRetrieve(params: AgentsRecentSubnetsRetrieveParams): Promise<ResponseObject<AgentsRecentSubnetsRetrieveResponse>>;
  agentsUpdateAgentUpdate(body: AgentsUpdateAgentUpdateRequest): Promise<ResponseObject<AgentsUpdateAgentUpdateResponse>>;
}


export { IAgentsService };
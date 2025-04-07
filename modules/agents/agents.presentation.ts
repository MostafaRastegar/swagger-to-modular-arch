// Generated presentation layer for agents
import { useQuery, useMutation } from 'react-query';
import { AgentsService } from './agents.service';

// PRESENTATION LAYER
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


export { AgentsPresentation };
export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  status: 'offline' | 'online' | 'simulated';
}

export const ceoAgent: Agent = {
  id: 'ceo',
  name: 'CEO Intelligence',
  role: 'Strategic Alignment & Executive Decisions',
  description: 'Formulates corporate goals, coordinates agent workflows, and provides executive decision guidance.',
  status: 'simulated'
};

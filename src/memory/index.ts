export interface BusinessMemoryEntry {
  id: string;
  key: string;
  value: string;
  category: 'profile' | 'kpi' | 'market_research' | 'operational_blueprint';
  updatedAt: string;
}

export const mockBusinessMemory: BusinessMemoryEntry[] = [
  {
    id: 'mem_1',
    key: 'company_mission',
    value: 'Empower growth teams with autonomous operational intelligence.',
    category: 'profile',
    updatedAt: new Date().toISOString()
  }
];

export const BusinessMemoryManager = {
  async search(query: string, organizationId: string): Promise<BusinessMemoryEntry[]> {
    console.log(`Searching Business Memory for "${query}" in org ${organizationId}... (Simulated)`);
    return mockBusinessMemory;
  },

  async store(entry: Omit<BusinessMemoryEntry, 'id' | 'updatedAt'>, organizationId: string): Promise<BusinessMemoryEntry> {
    console.log(`Storing key "${entry.key}" in Business Memory for org ${organizationId}... (Simulated)`);
    return {
      ...entry,
      id: 'mem_' + Math.random().toString(36).substring(2, 9),
      updatedAt: new Date().toISOString()
    };
  }
};

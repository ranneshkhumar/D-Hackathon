import { Organization, OrgState } from '@/types';

const LOCAL_STORAGE_KEY = 'savorit_business_os_org_state';

const getInitialState = (): OrgState => {
  if (typeof window === 'undefined') {
    return { organizations: [], activeOrganizationId: null };
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.organizations)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse org state from localStorage:', e);
  }
  return { organizations: [], activeOrganizationId: null };
};

export const OrgManager = {
  getOrgState(): OrgState {
    return getInitialState();
  },

  saveOrgState(state: OrgState): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save org state to localStorage:', e);
    }
  },

  getOrganizations(): Organization[] {
    return this.getOrgState().organizations;
  },

  getActiveOrganization(): Organization | null {
    const state = this.getOrgState();
    if (!state.activeOrganizationId) return null;
    return state.organizations.find(org => org.id === state.activeOrganizationId) || null;
  },

  createOrganization(name: string): Organization {
    const state = this.getOrgState();
    const newOrg: Organization = {
      id: 'org_' + Math.random().toString(36).substring(2, 11),
      name,
      createdAt: new Date().toISOString(),
      onboarded: false,
    };
    state.organizations.push(newOrg);
    state.activeOrganizationId = newOrg.id;
    this.saveOrgState(state);
    return newOrg;
  },

  deleteOrganization(id: string): void {
    const state = this.getOrgState();
    state.organizations = state.organizations.filter(org => org.id !== id);
    if (state.activeOrganizationId === id) {
      state.activeOrganizationId = state.organizations.length > 0 ? state.organizations[0].id : null;
    }
    this.saveOrgState(state);
  },

  setOnboarded(id: string, onboarded: boolean): void {
    const state = this.getOrgState();
    const org = state.organizations.find(o => o.id === id);
    if (org) {
      org.onboarded = onboarded;
      this.saveOrgState(state);
    }
  },

  setActiveOrganization(id: string): void {
    const state = this.getOrgState();
    const exists = state.organizations.some(org => org.id === id);
    if (exists) {
      state.activeOrganizationId = id;
      this.saveOrgState(state);
    }
  },

  clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
};

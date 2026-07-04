import { BusinessData } from '@/engine/agents';

const BACKEND_BASE_URL = 'http://localhost:5000/api';

class ApiClientClass {
  private token: string | null = null;
  private backendAvailable: boolean | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('aegis_jwt_token');
    }
  }

  /**
   * Healthcheck to see if the Express + PostgreSQL backend is online
   */
  async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:5000/health');
      if (response.ok) {
        const data = await response.json();
        this.backendAvailable = data.status === 'healthy';
        return this.backendAvailable;
      }
    } catch (e) {
      this.backendAvailable = false;
    }
    return false;
  }

  /**
   * Silent login/registration on the backend to authenticate the hackathon user
   */
  async authenticate(): Promise<boolean> {
    const isHealthy = await this.checkBackendHealth();
    if (!isHealthy) return false;

    try {
      const defaultUser = {
        name: 'Executive Administrator',
        email: 'admin@aegis.ai',
        password: 'Password123!'
      };

      // Try login first
      let res = await fetch(`${BACKEND_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: defaultUser.email, password: defaultUser.password })
      });

      if (!res.ok) {
        // If login fails, try registering the default administrator
        const registerRes = await fetch(`${BACKEND_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(defaultUser)
        });

        if (registerRes.ok) {
          // Retry login
          res = await fetch(`${BACKEND_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: defaultUser.email, password: defaultUser.password })
          });
        }
      }

      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          this.token = data.token;
          if (typeof window !== 'undefined') {
            localStorage.setItem('aegis_jwt_token', data.token);
          }
          return true;
        }
      }
    } catch (e) {
      console.warn('[ApiClient] Authentication failed, falling back to local simulation:', e);
    }
    return false;
  }

  /**
   * Syncs organization creation with the PostgreSQL database
   */
  async createOrganization(name: string): Promise<any | null> {
    const authenticated = await this.authenticate();
    if (!authenticated || !this.token) return null;

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/orgs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ name })
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[ApiClient] Failed to create organization on backend:', e);
    }
    return null;
  }

  /**
   * Syncs updated business profiles/metrics with the PostgreSQL database
   */
  async saveBusinessProfile(orgId: string, businessData: BusinessData): Promise<boolean> {
    const authenticated = await this.authenticate();
    if (!authenticated || !this.token) return false;

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/orgs/${orgId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({
          profile: businessData
        })
      });

      if (res.ok) {
        // Also push the analytical metric records to PostgreSQL
        await fetch(`${BACKEND_BASE_URL}/orgs/${orgId}/metrics`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({
            revenue: businessData.annual_revenue,
            expenses: businessData.annual_revenue * 0.7, // Simulated expenses
            profit: businessData.annual_revenue * 0.3,   // Simulated profit
            employeeCount: parseInt(businessData.team_size) || 10
          })
        });
        return true;
      }
    } catch (e) {
      console.warn('[ApiClient] Failed to save business profile to backend:', e);
    }
    return false;
  }

  /**
   * Executes multi-agent OS strategy run on the backend via Gemini LLM Service
   */
  async executeAgentStrategy(orgId: string, prompt?: string): Promise<any | null> {
    const authenticated = await this.authenticate();
    if (!authenticated || !this.token) return null;

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/strategy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({
          organizationId: orgId,
          customPrompt: prompt
        })
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[ApiClient] Failed to execute strategy on backend:', e);
    }
    return null;
  }

  /**
   * Submits manual onboarding form wizard data to the backend
   */
  async submitOnboarding(orgId: string, onboardingData: any): Promise<any | null> {
    const authenticated = await this.authenticate();
    if (!authenticated || !this.token) return null;

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/discovery/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({
          organizationId: orgId,
          ...onboardingData
        })
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[ApiClient] Failed to submit onboarding data:', e);
    }
    return null;
  }

  /**
   * Uploads a business spreadsheet CSV file to the backend
   */
  async uploadCSV(orgId: string, file: File): Promise<any | null> {
    const authenticated = await this.authenticate();
    if (!authenticated || !this.token) return null;

    try {
      const formData = new FormData();
      formData.append('organizationId', orgId);
      formData.append('file', file);

      const res = await fetch(`${BACKEND_BASE_URL}/discovery/upload-csv`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`
        },
        body: formData
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[ApiClient] Failed to upload CSV file:', e);
    }
    return null;
  }

  /**
   * Fetches the latest generated strategy outputs from the database
   */
  async getLatestStrategy(orgId: string): Promise<any | null> {
    const authenticated = await this.authenticate();
    if (!authenticated || !this.token) return null;

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/strategy?organizationId=${orgId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[ApiClient] Failed to load latest strategy from backend:', e);
    }
    return null;
  }

  /**
   * Fetches calculated KPIs and risk alerts from the backend database summary
   */
  async getDashboardSummary(orgId: string): Promise<any | null> {
    const authenticated = await this.authenticate();
    if (!authenticated || !this.token) return null;

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/dashboard?organizationId=${orgId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[ApiClient] Failed to load dashboard summary from backend:', e);
    }
    return null;
  }
}

export const ApiClient = new ApiClientClass();

/**
 * Production REST API Client for Spring Boot Backend
 * Conforms to the architecture: Vercel (Frontend) -> Render (Spring Boot) -> Supabase (PostgreSQL)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const ACCESS_TOKEN_KEY = 'aura_access_token_v1';
const REFRESH_TOKEN_KEY = 'aura_refresh_token_v1';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  currency: string;
  timezone: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: ApiUser;
}

export const getStoredAccessToken = (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getStoredRefreshToken = (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setAuthTokens = (tokens: { accessToken: string; refreshToken: string }): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
};

export const clearAuthTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers || {});

  headers.set('Content-Type', 'application/json');

  const token = getStoredAccessToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, { ...options, headers });

  // Handle 401 Unauthorized with token refresh and infinite loop prevention
  if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
    const refreshToken = getStoredRefreshToken();

    if (!refreshToken) {
      clearAuthTokens();
      throw new Error('Session expired. Please log in again.');
    }

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshRes.ok) {
          const refreshData: ApiResponse<AuthTokens> = await refreshRes.json();
          setAuthTokens({
            accessToken: refreshData.data.accessToken,
            refreshToken: refreshData.data.refreshToken,
          });
          isRefreshing = false;
          onRefreshed(refreshData.data.accessToken);

          headers.set('Authorization', `Bearer ${refreshData.data.accessToken}`);
          const retryRes = await fetch(url, { ...options, headers });
          const retryJson: ApiResponse<T> = await retryRes.json();
          return retryJson.data;
        } else {
          clearAuthTokens();
          isRefreshing = false;
          throw new Error('Session expired. Please sign in again.');
        }
      } catch (err) {
        clearAuthTokens();
        isRefreshing = false;
        throw err;
      }
    } else {
      // Queue requests while token is refreshing
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh(async (newToken: string) => {
          headers.set('Authorization', `Bearer ${newToken}`);
          try {
            const retryRes = await fetch(url, { ...options, headers });
            const retryJson: ApiResponse<T> = await retryRes.json();
            resolve(retryJson.data);
          } catch (e) {
            reject(e);
          }
        });
      });
    }
  }

  const json: ApiResponse<T> = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.message || `API error with status ${response.status}`);
  }

  return json.data;
}

export const apiClient = {
  // System Health
  health: () => request<{ status: string; service: string; database: string }>('/health', { method: 'GET' }),

  // Authentication
  auth: {
    register: (name: string, email: string, password: string, currency = 'USD') =>
      request<AuthTokens>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, currency }),
      }),

    login: (email: string, password: string) =>
      request<AuthTokens>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    refresh: (refreshToken: string) =>
      request<AuthTokens>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }),

    logout: (refreshToken?: string) =>
      request<void>('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }),

    getMe: () => request<ApiUser>('/auth/me', { method: 'GET' }),
  },

  // Expenses
  expenses: {
    getAll: (params?: { page?: number; size?: number; search?: string; categoryId?: string; startDate?: string; endDate?: string }) => {
      const query = new URLSearchParams();
      if (params?.page !== undefined) query.set('page', params.page.toString());
      if (params?.size !== undefined) query.set('size', params.size.toString());
      if (params?.search) query.set('search', params.search);
      if (params?.categoryId) query.set('categoryId', params.categoryId);
      if (params?.startDate) query.set('startDate', params.startDate);
      if (params?.endDate) query.set('endDate', params.endDate);
      const qs = query.toString();
      return request<any>(`/expenses${qs ? `?${qs}` : ''}`, { method: 'GET' });
    },
    getById: (id: string) => request<any>(`/expenses/${id}`, { method: 'GET' }),
    create: (data: { title: string; amount: number; categoryId?: string; date: string; description?: string; paymentMethod?: string; notes?: string; tags?: string; recurring?: boolean }) =>
      request<any>('/expenses', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<{ title: string; amount: number; categoryId?: string; date: string; description?: string; paymentMethod?: string; notes?: string; tags?: string; recurring?: boolean }>) =>
      request<any>(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/expenses/${id}`, { method: 'DELETE' }),
  },

  // Income
  income: {
    getAll: (params?: { page?: number; size?: number; search?: string; startDate?: string; endDate?: string }) => {
      const query = new URLSearchParams();
      if (params?.page !== undefined) query.set('page', params.page.toString());
      if (params?.size !== undefined) query.set('size', params.size.toString());
      if (params?.search) query.set('search', params.search);
      if (params?.startDate) query.set('startDate', params.startDate);
      if (params?.endDate) query.set('endDate', params.endDate);
      const qs = query.toString();
      return request<any>(`/income${qs ? `?${qs}` : ''}`, { method: 'GET' });
    },
    getById: (id: string) => request<any>(`/income/${id}`, { method: 'GET' }),
    create: (data: { source: string; amount: number; categoryId?: string; date: string; description?: string; notes?: string }) =>
      request<any>('/income', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<{ source: string; amount: number; categoryId?: string; date: string; description?: string; notes?: string }>) =>
      request<any>(`/income/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/income/${id}`, { method: 'DELETE' }),
  },

  // Categories
  categories: {
    getAll: () => request<any[]>('/categories', { method: 'GET' }),
    create: (data: { name: string; icon?: string; color?: string; type?: string }) =>
      request<any>('/categories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: { name: string; icon?: string; color?: string; type?: string }) =>
      request<any>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/categories/${id}`, { method: 'DELETE' }),
  },

  // Budgets
  budgets: {
    getAll: () => request<any[]>('/budgets', { method: 'GET' }),
    getById: (id: string) => request<any>(`/budgets/${id}`, { method: 'GET' }),
    create: (data: { categoryId: string; amount: number; period?: string; startDate: string; endDate: string; alertThreshold?: number }) =>
      request<any>('/budgets', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<{ categoryId: string; amount: number; period?: string; startDate: string; endDate: string; alertThreshold?: number }>) =>
      request<any>(`/budgets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/budgets/${id}`, { method: 'DELETE' }),
  },

  // Savings Goals
  goals: {
    getAll: () => request<any[]>('/goals', { method: 'GET' }),
    getById: (id: string) => request<any>(`/goals/${id}`, { method: 'GET' }),
    create: (data: { title: string; targetAmount: number; currentAmount?: number; deadline?: string; color?: string; icon?: string }) =>
      request<any>('/goals', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<{ title: string; targetAmount: number; currentAmount?: number; deadline?: string; color?: string; icon?: string }>) =>
      request<any>(`/goals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deposit: (id: string, amount: number) =>
      request<any>(`/goals/${id}/deposit`, { method: 'POST', body: JSON.stringify({ amount }) }),
    withdraw: (id: string, amount: number) =>
      request<any>(`/goals/${id}/withdraw`, { method: 'POST', body: JSON.stringify({ amount }) }),
    delete: (id: string) => request<void>(`/goals/${id}`, { method: 'DELETE' }),
  },

  // Subscriptions
  subscriptions: {
    getAll: () => request<any[]>('/subscriptions', { method: 'GET' }),
    getById: (id: string) => request<any>(`/subscriptions/${id}`, { method: 'GET' }),
    create: (data: { name: string; amount: number; categoryId?: string; billingCycle?: string; renewalDate: string; color?: string; icon?: string; status?: string }) =>
      request<any>('/subscriptions', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<{ name: string; amount: number; categoryId?: string; billingCycle?: string; renewalDate: string; color?: string; icon?: string; status?: string }>) =>
      request<any>(`/subscriptions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: 'ACTIVE' | 'PAUSED' | 'CANCELLED') =>
      request<any>(`/subscriptions/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    delete: (id: string) => request<void>(`/subscriptions/${id}`, { method: 'DELETE' }),
  },

  // Dashboard & Analytics
  dashboard: {
    getSummary: () => request<any>('/dashboard/summary', { method: 'GET' }),
    getCategoryBreakdown: (startDate?: string, endDate?: string) => {
      const query = new URLSearchParams();
      if (startDate) query.set('startDate', startDate);
      if (endDate) query.set('endDate', endDate);
      const qs = query.toString();
      return request<any[]>(`/dashboard/category-breakdown${qs ? `?${qs}` : ''}`, { method: 'GET' });
    },
    getMonthlyTrends: (months = 6) => request<any[]>(`/dashboard/monthly-trends?months=${months}`, { method: 'GET' }),
  },

  // Reports
  reports: {
    getSummary: (startDate?: string, endDate?: string) => {
      const query = new URLSearchParams();
      if (startDate) query.set('startDate', startDate);
      if (endDate) query.set('endDate', endDate);
      const qs = query.toString();
      return request<any>(`/reports/summary${qs ? `?${qs}` : ''}`, { method: 'GET' });
    },
  },
};

import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type { User, Vehicle, Service, Case, Provider, Job, AuthResponse, LoginDto, RegisterDto, CreateCaseDto, CreateJobDto, AcceptJobDto, VerifyOtpDto, UpdateLocationDto, UpdateStatusDto, CancelCaseDto, CancelJobDto, EscalateJobDto, UpdateTransitDto, PaginatedResponse, Notification, Payment } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/v1';

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: any) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return this.client(originalRequest);
          } catch {
            this.clearAuth();
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );

    this.loadToken();
  }

  private loadToken() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.accessToken = token;
    }
  }

  private saveToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('accessToken', token);
  }

  private clearAuth() {
    this.accessToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }

  private async refreshToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      const response = await axios.post<{ access_token: string }>(
        `${API_BASE_URL}/auth/refresh`,
        {},
        { headers: { Authorization: `Bearer ${this.accessToken}` } }
      );
      this.saveToken(response.data.access_token);
      return response.data.access_token;
    })();

    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  setAuth(auth: AuthResponse) {
    this.saveToken(auth.accessToken);
    localStorage.setItem('user', JSON.stringify(auth.user));
  }

  getToken(): string | null {
    return this.accessToken;
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  logout() {
    this.clearAuth();
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const response = await this.client.post<{ access_token: string; user: User }>('/auth/login', dto);
    const auth: AuthResponse = { user: response.data.user, accessToken: response.data.access_token };
    this.setAuth(auth);
    return auth;
  }

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const response = await this.client.post<{ access_token: string; user: User }>('/auth/register', dto);
    const auth: AuthResponse = { user: response.data.user, accessToken: response.data.access_token };
    this.setAuth(auth);
    return auth;
  }

  async getProfile() {
    const response = await this.client.get('/auth/profile');
    return response.data;
  }

  async getServices(params?: { vehicleCategory?: string; fuelType?: string }) {
    const response = await this.client.get('/catalog', { params });
    return response.data;
  }

  async getServiceById(id: string) {
    const response = await this.client.get(`/catalog/${id}`);
    return response.data;
  }

  async getServicesByCategory(category: string) {
    const response = await this.client.get(`/catalog/category/${category}`);
    return response.data;
  }

  async getEligibleServices(vehicleCategory: string, fuelType: string) {
    const response = await this.client.get('/catalog/eligible', {
      params: { vehicleCategory, fuelType },
    });
    return response.data;
  }

  async createCase(data: CreateCaseDto) {
    const response = await this.client.post('/cases', data);
    return response.data;
  }

  async getCases(customerId?: string) {
    const response = await this.client.get('/cases', { params: { customerId } });
    return response.data;
  }

  async getCaseById(id: string) {
    const response = await this.client.get(`/cases/${id}`);
    return response.data;
  }

  async cancelCase(id: string, reason: string) {
    const response = await this.client.post(`/cases/${id}/cancel`, { reason });
    return response.data;
  }

  async createJob(data: CreateJobDto) {
    const response = await this.client.post('/jobs', data);
    return response.data;
  }

  async getJobs(caseId?: string) {
    const response = await this.client.get('/jobs', { params: { caseId } });
    return response.data;
  }

  async getJobById(id: string) {
    const response = await this.client.get(`/jobs/${id}`);
    return response.data;
  }

  async acceptJob(id: string, providerId: string) {
    const response = await this.client.post(`/jobs/${id}/accept`, { providerId });
    return response.data;
  }

  async updateJobEnRoute(id: string, providerId?: string) {
    const response = await this.client.post(`/jobs/${id}/en-route`, { providerId });
    return response.data;
  }

  async updateJobArrived(id: string, providerId?: string) {
    const response = await this.client.post(`/jobs/${id}/arrived`, { providerId });
    return response.data;
  }

  async startJobService(id: string, otp: string, providerId?: string) {
    const response = await this.client.post(`/jobs/${id}/start`, { otp, providerId });
    return response.data;
  }

  async completeJob(id: string, providerId?: string) {
    const response = await this.client.post(`/jobs/${id}/complete`, { providerId });
    return response.data;
  }

  async cancelJob(id: string, reason: string) {
    const response = await this.client.post(`/jobs/${id}/cancel`, { reason });
    return response.data;
  }

  async escalateJob(id: string, reason: string) {
    const response = await this.client.post(`/jobs/${id}/escalate`, { reason });
    return response.data;
  }

  async createProvider(data: { userId?: string; name: string; description?: string; serviceCategories: string[]; coverageRadiusKm: number; baseLocation: { latitude: number; longitude: number; address: string } }) {
    const response = await this.client.post('/providers', data);
    return response.data;
  }

  async getProviders() {
    const response = await this.client.get('/providers');
    return response.data;
  }

  async getProviderById(id: string) {
    const response = await this.client.get(`/providers/${id}`);
    return response.data;
  }

  async updateProviderLocation(id: string, data: UpdateLocationDto) {
    const response = await this.client.post(`/providers/${id}/location`, data);
    return response.data;
  }

  async updateProviderStatus(id: string, status: string) {
    const response = await this.client.patch(`/providers/${id}/status`, { status });
    return response.data;
  }

  async getUsers() {
    const response = await this.client.get('/users');
    return response.data;
  }

  async getUserById(id: string) {
    const response = await this.client.get(`/users/${id}`);
    return response.data;
  }

  async createUser(data: { email: string; password: string; name: string; role: string }) {
    const response = await this.client.post('/users', data);
    return response.data;
  }
}

export const api = new ApiClient();

export type { User, Vehicle, Service, Case, Provider, Job, AuthResponse, LoginDto, RegisterDto, CreateCaseDto, CreateJobDto, AcceptJobDto, VerifyOtpDto, UpdateLocationDto, UpdateStatusDto, CancelCaseDto, CancelJobDto, EscalateJobDto, UpdateTransitDto, PaginatedResponse, Notification, Payment };
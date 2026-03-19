const rawApiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, "");
const HEALTH_BASE_URL = API_BASE_URL.endsWith("/api/v1")
  ? API_BASE_URL.slice(0, -"/api/v1".length)
  : API_BASE_URL;

// Types based on backend entities
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
  is_verified: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface Experience {
  company: string;
  role: string;
  start_date: string;
  end_date?: string;
  description: string;
  location: string;
  is_current: boolean;
}

export interface Education {
  school: string;
  degree: string;
  field: string;
  start_date: string;
  end_date?: string;
  gpa?: string;
  description: string;
}

export interface Project {
  name: string;
  description: string;
  tech_stack: string[];
  link: string;
  github_link: string;
  image_url: string;
  start_date: string;
  end_date?: string;
  featured: boolean;
}

export interface Portfolio {
  id: string;
  user_id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
  template: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface CreatePortfolioRequest {
  name: string;
  title: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  experience?: Experience[];
  education?: Education[];
  projects?: Project[];
  skills?: string[];
  template?: string;
  is_public?: boolean;
}

export interface UpdatePortfolioRequest {
  name?: string;
  title?: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  experience?: Experience[];
  education?: Education[];
  projects?: Project[];
  skills?: string[];
  template?: string;
  is_public?: boolean;
}

class ApiService {
  private getStoredToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem("access_token");
  }

  private setStoredToken(token: string) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("access_token", token);
    }
  }

  private clearStoredToken() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("access_token");
    }
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.getStoredToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Network error" }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || data;
  }

  private async request<T>(
    path: string,
    init: RequestInit = {},
    retryOnAuth = true
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...this.getAuthHeaders(),
        ...init.headers,
      },
      credentials: "include",
    });

    if (response.status === 401 && retryOnAuth && this.getStoredToken()) {
      try {
        await this.refreshToken();
        return this.request<T>(path, init, false);
      } catch {
        this.clearStoredToken();
      }
    }

    return this.handleResponse<T>(response);
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const result = await this.request<LoginResponse>(
      "/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      },
      false
    );

    if (result.access_token) {
      this.setStoredToken(result.access_token);
    }

    return result;
  }

  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const result = await this.request<LoginResponse>(
      "/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      },
      false
    );

    if (result.access_token) {
      this.setStoredToken(result.access_token);
    }

    return result;
  }

  async logout(): Promise<void> {
    try {
      await this.request<void>(
        "/auth/logout",
        {
          method: "POST",
        },
        false
      );
    } finally {
      this.clearStoredToken();
    }
  }

  async getProfile(): Promise<User> {
    return this.request<User>("/auth/profile");
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    return this.request<User>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async changePassword(payload: ChangePasswordRequest): Promise<void> {
    await this.request<void>("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  async refreshToken(): Promise<{ access_token: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    const result = await this.handleResponse<{ access_token: string }>(response);

    if (result.access_token) {
      this.setStoredToken(result.access_token);
    }

    return result;
  }

  async getUserPortfolios(): Promise<Portfolio[]> {
    return this.request<Portfolio[]>("/portfolios/user");
  }

  async getPortfolio(id: string): Promise<Portfolio> {
    return this.request<Portfolio>(`/portfolios/${id}`);
  }

  async createPortfolio(portfolioData: CreatePortfolioRequest): Promise<Portfolio> {
    return this.request<Portfolio>("/portfolios", {
      method: "POST",
      body: JSON.stringify(portfolioData),
    });
  }

  async updatePortfolio(id: string, updates: UpdatePortfolioRequest): Promise<Portfolio> {
    return this.request<Portfolio>(`/portfolios/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deletePortfolio(id: string): Promise<void> {
    await this.request<void>(`/portfolios/${id}`, {
      method: "DELETE",
    });
  }

  async getPublicPortfolios(limit = 10, offset = 0): Promise<Portfolio[]> {
    const response = await fetch(
      `${API_BASE_URL}/portfolios/public?limit=${limit}&offset=${offset}`
    );

    return this.handleResponse<Portfolio[]>(response);
  }

  async searchPortfolios(query: string, limit = 10, offset = 0): Promise<Portfolio[]> {
    const response = await fetch(
      `${API_BASE_URL}/portfolios/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`
    );

    return this.handleResponse<Portfolio[]>(response);
  }

  async enhanceWithAI(portfolioId: string, fields: string[], context?: unknown): Promise<Portfolio> {
    return this.request<Portfolio>("/portfolios/enhance", {
      method: "POST",
      body: JSON.stringify({
        portfolio_id: portfolioId,
        fields,
        context,
      }),
    });
  }

  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${HEALTH_BASE_URL}/health`);
    return this.handleResponse<{ status: string; message: string }>(response);
  }

  getGoogleLoginUrl(): string {
    return `${API_BASE_URL}/auth/google/login`;
  }
}

export const apiService = new ApiService();

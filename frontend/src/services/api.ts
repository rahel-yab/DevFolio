const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

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
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || data;
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });
    
    const result = await this.handleResponse<LoginResponse>(response);
    
    // Store access token
    if (result.access_token) {
      localStorage.setItem('access_token', result.access_token);
    }
    
    return result;
  }

  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
      credentials: 'include',
    });
    
    const result = await this.handleResponse<LoginResponse>(response);
    
    // Store access token
    if (result.access_token) {
      localStorage.setItem('access_token', result.access_token);
    }
    
    return result;
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });
    } finally {
      localStorage.removeItem('access_token');
    }
  }

  async getProfile(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: this.getAuthHeaders(),
      credentials: 'include',
    });
    
    return this.handleResponse<User>(response);
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates),
      credentials: 'include',
    });
    
    return this.handleResponse<User>(response);
  }

  async refreshToken(): Promise<{ access_token: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    
    const result = await this.handleResponse<{ access_token: string }>(response);
    
    if (result.access_token) {
      localStorage.setItem('access_token', result.access_token);
    }
    
    return result;
  }

  // Portfolio endpoints
  async getUserPortfolios(): Promise<Portfolio[]> {
    const response = await fetch(`${API_BASE_URL}/portfolios/user`, {
      headers: this.getAuthHeaders(),
      credentials: 'include',
    });
    
    return this.handleResponse<Portfolio[]>(response);
  }

  async getPortfolio(id: string): Promise<Portfolio> {
    const response = await fetch(`${API_BASE_URL}/portfolios/${id}`, {
      headers: this.getAuthHeaders(),
      credentials: 'include',
    });
    
    return this.handleResponse<Portfolio>(response);
  }

  async createPortfolio(portfolioData: CreatePortfolioRequest): Promise<Portfolio> {
    const response = await fetch(`${API_BASE_URL}/portfolios`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(portfolioData),
      credentials: 'include',
    });
    
    return this.handleResponse<Portfolio>(response);
  }

  async updatePortfolio(id: string, updates: UpdatePortfolioRequest): Promise<Portfolio> {
    const response = await fetch(`${API_BASE_URL}/portfolios/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates),
      credentials: 'include',
    });
    
    return this.handleResponse<Portfolio>(response);
  }

  async deletePortfolio(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/portfolios/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      credentials: 'include',
    });
    
    await this.handleResponse<void>(response);
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

  async enhanceWithAI(portfolioId: string, fields: string[], context?: any): Promise<Portfolio> {
    const response = await fetch(`${API_BASE_URL}/portfolios/enhance`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        portfolio_id: portfolioId,
        fields,
        context,
      }),
      credentials: 'include',
    });
    
    return this.handleResponse<Portfolio>(response);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await fetch(`${API_BASE_URL.replace('/api/v1', '')}/health`);
    return this.handleResponse<{ status: string; message: string }>(response);
  }
}

export const apiService = new ApiService();

// API Configuration
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export const apiClient = {
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T | void> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || response.statusText);
    }

    // ✅ Handle 204 No Content
    if (response.status === 204) {
      return;
    }

    return response.json();
  },


  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }) as Promise<T>;
  },

  post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<T>;
  },

  put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }) as Promise<T>;
  },

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }) as Promise<T>;
  },
};

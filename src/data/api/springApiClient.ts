import axios from 'axios';
import type { AxiosInstance } from 'axios';

// Types basados en tu API Spring Boot
export interface LoginRequest {
    username: string;
    password: string;
}

export interface TokenResponse {
    token: string;
    firstLogin: boolean;
    username: string;
    role: string;
}

export interface UserResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: 'ADMIN' | 'CUSTOMER' | 'SELLER';
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ProductResponse {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    active: boolean;
    available: boolean;
    imageData?: string;
    imageContentType?: string;
    imageDataUrl?: string;
    seller: {
        id: number;
        fullName: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface ProductCreateRequest {
    name: string;
    description: string;
    price: number;
    stock: number;
    sellerId: number;
    imageData?: string;
    imageContentType?: string;
}

export interface ProductUpdateRequest {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    active?: boolean;
    imageData?: string;
    imageContentType?: string;
}

export interface UserCreateRequest {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    phone?: string;
    role?: 'ADMIN' | 'CUSTOMER' | 'SELLER';
}

class SpringApiClient {
    private client: AxiosInstance;
    private token: string | null = null;

    constructor() {
        this.client = axios.create({
            baseURL: 'http://localhost:8080/api',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
        this.loadTokenFromStorage();
    }

    private setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                if (this.token) {
                    config.headers.Authorization = `Bearer ${this.token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    this.clearAuth();
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    private loadTokenFromStorage() {
        const token = localStorage.getItem('auth-token');
        if (token) {
            this.token = token;
        }
    }

    setAuth(token: string) {
        this.token = token;
        localStorage.setItem('auth-token', token);
    }

    clearAuth() {
        this.token = null;
        localStorage.removeItem('auth-token');
        localStorage.removeItem('auth-user');
    }

    // Auth endpoints
    async login(data: LoginRequest): Promise<TokenResponse> {
        const response = await this.client.post<TokenResponse>('/users/login', data);
        return response.data;
    }

    async getCurrentUser(): Promise<UserResponse> {
        const response = await this.client.get<UserResponse>('/users/me');
        return response.data;
    }

    // User endpoints
    async getAllUsers(): Promise<UserResponse[]> {
        const response = await this.client.get<UserResponse[]>('/users');
        return response.data;
    }

    async getUserById(id: number): Promise<UserResponse> {
        const response = await this.client.get<UserResponse>(`/users/${id}`);
        return response.data;
    }

    async createUser(data: UserCreateRequest): Promise<UserResponse> {
        const response = await this.client.post<UserResponse>('/users', data);
        return response.data;
    }

    async updateUser(id: number, data: Partial<UserCreateRequest>): Promise<UserResponse> {
        const response = await this.client.put<UserResponse>(`/users/${id}`, data);
        return response.data;
    }

    async deleteUser(id: number): Promise<void> {
        await this.client.delete(`/users/${id}`);
    }

    async getUsersByRole(role: string): Promise<UserResponse[]> {
        const response = await this.client.get<UserResponse[]>(`/users/role/${role}`);
        return response.data;
    }

    // Product endpoints
    async getAllProducts(): Promise<ProductResponse[]> {
        const response = await this.client.get<ProductResponse[]>('/products');
        return response.data;
    }

    async getAvailableProducts(): Promise<ProductResponse[]> {
        const response = await this.client.get<ProductResponse[]>('/products/available');
        return response.data;
    }

    async getProductById(id: number): Promise<ProductResponse> {
        const response = await this.client.get<ProductResponse>(`/products/${id}`);
        return response.data;
    }

    async getProductsBySeller(sellerId: number): Promise<ProductResponse[]> {
        const response = await this.client.get<ProductResponse[]>(`/products/seller/${sellerId}`);
        return response.data;
    }

    async searchProducts(name: string): Promise<ProductResponse[]> {
        const response = await this.client.get<ProductResponse[]>(`/products/search?name=${encodeURIComponent(name)}`);
        return response.data;
    }

    async createProduct(data: ProductCreateRequest): Promise<ProductResponse> {
        const response = await this.client.post<ProductResponse>('/products', data);
        return response.data;
    }

    async updateProduct(id: number, data: ProductUpdateRequest): Promise<ProductResponse> {
        const response = await this.client.put<ProductResponse>(`/products/${id}`, data);
        return response.data;
    }

    async deleteProduct(id: number): Promise<void> {
        await this.client.delete(`/products/${id}`);
    }
}

export const springApiClient = new SpringApiClient();
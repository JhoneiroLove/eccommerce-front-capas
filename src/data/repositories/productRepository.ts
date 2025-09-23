import { apiClient } from '../api/apiClient';
import type { Product, ApiResponse, PaginatedResponse, SearchParams } from '../../types';

export class ProductRepository {
  private readonly basePath = '/products';

  async getProducts(params?: SearchParams): Promise<PaginatedResponse<Product>> {
    const searchParams = new URLSearchParams();
    
    if (params?.query) {
      searchParams.append('q', params.query);
    }
    
    if (params?.filters?.category) {
      searchParams.append('category', params.filters.category);
    }
    
    if (params?.filters?.minPrice !== undefined) {
      searchParams.append('minPrice', params.filters.minPrice.toString());
    }
    
    if (params?.filters?.maxPrice !== undefined) {
      searchParams.append('maxPrice', params.filters.maxPrice.toString());
    }
    
    if (params?.filters?.rating !== undefined) {
      searchParams.append('rating', params.filters.rating.toString());
    }
    
    if (params?.filters?.sortBy) {
      searchParams.append('sortBy', params.filters.sortBy);
    }
    
    if (params?.filters?.sortOrder) {
      searchParams.append('sortOrder', params.filters.sortOrder);
    }
    
    if (params?.page) {
      searchParams.append('page', params.page.toString());
    }
    
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString());
    }

    const queryString = searchParams.toString();
    const url = queryString ? `${this.basePath}?${queryString}` : this.basePath;
    
    return apiClient.get<PaginatedResponse<Product>>(url);
  }

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    return apiClient.get<ApiResponse<Product>>(`${this.basePath}/${id}`);
  }

  async getProductsByCategory(category: string, params?: Omit<SearchParams, 'filters'>): Promise<PaginatedResponse<Product>> {
    const searchParams = new URLSearchParams();
    searchParams.append('category', category);
    
    if (params?.page) {
      searchParams.append('page', params.page.toString());
    }
    
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString());
    }

    return apiClient.get<PaginatedResponse<Product>>(`${this.basePath}?${searchParams.toString()}`);
  }

  async getFeaturedProducts(limit = 8): Promise<ApiResponse<Product[]>> {
    return apiClient.get<ApiResponse<Product[]>>(`${this.basePath}/featured?limit=${limit}`);
  }

  async getRelatedProducts(productId: string, limit = 4): Promise<ApiResponse<Product[]>> {
    return apiClient.get<ApiResponse<Product[]>>(`${this.basePath}/${productId}/related?limit=${limit}`);
  }

  async searchProducts(query: string, params?: Omit<SearchParams, 'query'>): Promise<PaginatedResponse<Product>> {
    const searchParams = new URLSearchParams();
    searchParams.append('q', query);
    
    if (params?.filters?.category) {
      searchParams.append('category', params.filters.category);
    }
    
    if (params?.page) {
      searchParams.append('page', params.page.toString());
    }
    
    if (params?.limit) {
      searchParams.append('limit', params.limit.toString());
    }

    return apiClient.get<PaginatedResponse<Product>>(`${this.basePath}/search?${searchParams.toString()}`);
  }

  async getCategories(): Promise<ApiResponse<string[]>> {
    return apiClient.get<ApiResponse<string[]>>('/categories');
  }
}

export const productRepository = new ProductRepository();
import type { Product, ApiResponse, PaginatedResponse, SearchParams } from '../../types';
import { productRepository } from '../../data/repositories/productRepository';

export class ProductService {
  async getProducts(params?: SearchParams): Promise<PaginatedResponse<Product>> {
    try {
      return await productRepository.getProducts(params);
    } catch (error) {
      throw new Error('Failed to fetch products. Please try again later.');
    }
  }

  async getProductById(id: string): Promise<Product> {
    if (!id) {
      throw new Error('Product ID is required');
    }

    try {
      const response: ApiResponse<Product> = await productRepository.getProductById(id);
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        throw new Error('Product not found');
      }
      throw new Error('Failed to fetch product details. Please try again later.');
    }
  }

  async getProductsByCategory(category: string, params?: Omit<SearchParams, 'filters'>): Promise<PaginatedResponse<Product>> {
    if (!category) {
      throw new Error('Category is required');
    }

    try {
      return await productRepository.getProductsByCategory(category, params);
    } catch (error) {
      throw new Error('Failed to fetch products for this category. Please try again later.');
    }
  }

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    try {
      const response: ApiResponse<Product[]> = await productRepository.getFeaturedProducts(limit);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch featured products. Please try again later.');
    }
  }

  async getRelatedProducts(productId: string, limit = 4): Promise<Product[]> {
    if (!productId) {
      throw new Error('Product ID is required');
    }

    try {
      const response: ApiResponse<Product[]> = await productRepository.getRelatedProducts(productId, limit);
      return response.data;
    } catch (error) {
      // Return empty array instead of throwing error for related products
      // This is not critical functionality
      return [];
    }
  }

  async searchProducts(query: string, params?: Omit<SearchParams, 'query'>): Promise<PaginatedResponse<Product>> {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query is required');
    }

    if (query.trim().length < 2) {
      throw new Error('Search query must be at least 2 characters long');
    }

    try {
      return await productRepository.searchProducts(query.trim(), params);
    } catch (error) {
      throw new Error('Failed to search products. Please try again later.');
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const response: ApiResponse<string[]> = await productRepository.getCategories();
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch categories. Please try again later.');
    }
  }

  // Business logic methods
  
  /**
   * Calculate discount percentage for a product
   */
  calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number {
    if (originalPrice <= 0 || discountedPrice <= 0) {
      return 0;
    }
    if (discountedPrice >= originalPrice) {
      return 0;
    }
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  }

  /**
   * Check if a product is in stock
   */
  isProductInStock(product: Product): boolean {
    return product.stock > 0;
  }

  /**
   * Get stock status text
   */
  getStockStatus(product: Product): { status: string; color: string } {
    if (product.stock === 0) {
      return { status: 'Out of Stock', color: 'text-red-600' };
    } else if (product.stock < 5) {
      return { status: 'Low Stock', color: 'text-orange-600' };
    } else {
      return { status: 'In Stock', color: 'text-green-600' };
    }
  }

  /**
   * Format product rating with stars
   */
  formatRating(rating: number): { fullStars: number; halfStars: number; emptyStars: number } {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;
    
    return { fullStars, halfStars, emptyStars };
  }

  /**
   * Validate if a product can be added to cart
   */
  canAddToCart(product: Product, requestedQuantity: number = 1): { canAdd: boolean; message?: string } {
    if (!this.isProductInStock(product)) {
      return { canAdd: false, message: 'Product is out of stock' };
    }

    if (requestedQuantity <= 0) {
      return { canAdd: false, message: 'Quantity must be greater than 0' };
    }

    if (requestedQuantity > product.stock) {
      return { canAdd: false, message: `Only ${product.stock} items available` };
    }

    return { canAdd: true };
  }
}

export const productService = new ProductService();
import { useState, useEffect, useCallback } from 'react';
import type { Product, PaginatedResponse, SearchParams } from '../../types';
import { productRepository } from '../../data/repositories/productRepository';
import { PAGINATION } from '../../shared/constants';

interface UseProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UseProductsActions {
  fetchProducts: (params?: SearchParams) => Promise<void>;
  resetState: () => void;
  setPage: (page: number) => void;
}

export const useProducts = (initialParams?: SearchParams): UseProductsState & UseProductsActions => {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    isLoading: false,
    error: null,
    pagination: {
      page: initialParams?.page || PAGINATION.DEFAULT_PAGE,
      limit: initialParams?.limit || PAGINATION.DEFAULT_LIMIT,
      total: 0,
      totalPages: 0,
    },
  });

  const fetchProducts = useCallback(async (params?: SearchParams) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const searchParams: SearchParams = {
        ...initialParams,
        ...params,
        page: params?.page || state.pagination.page,
        limit: params?.limit || state.pagination.limit,
      };

      const response: PaginatedResponse<Product> = await productRepository.getProducts(searchParams);
      
      setState(prev => ({
        ...prev,
        products: response.data,
        pagination: {
          page: response.meta.page,
          limit: response.meta.limit,
          total: response.meta.total,
          totalPages: response.meta.totalPages,
        },
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        isLoading: false,
      }));
    }
  }, [initialParams, state.pagination.page, state.pagination.limit]);

  const resetState = useCallback(() => {
    setState({
      products: [],
      isLoading: false,
      error: null,
      pagination: {
        page: PAGINATION.DEFAULT_PAGE,
        limit: PAGINATION.DEFAULT_LIMIT,
        total: 0,
        totalPages: 0,
      },
    });
  }, []);

  const setPage = useCallback((page: number) => {
    setState(prev => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        page,
      },
    }));
  }, []);

  // Auto-fetch on mount if no initial fetch is needed
  useEffect(() => {
    if (initialParams?.query || initialParams?.filters) {
      fetchProducts(initialParams);
    }
  }, []);

  return {
    ...state,
    fetchProducts,
    resetState,
    setPage,
  };
};
import { create } from 'zustand';
import {
    springApiClient,
    type ProductResponse,
    type ProductCreateRequest,
    type ProductUpdateRequest
} from '../../data/api/springApiClient';

interface ProductState {
    products: ProductResponse[];
    currentProduct: ProductResponse | null;
    isLoading: boolean;
    error: string | null;
    // Agregar cache para evitar llamadas repetidas
    lastFetchedSellerId: number | null;
    isFetching: boolean;
}

interface ProductActions {
    // Fetch actions
    fetchAllProducts: () => Promise<void>;
    fetchAvailableProducts: () => Promise<void>;
    fetchProductById: (id: number) => Promise<void>;
    fetchProductsBySeller: (sellerId: number) => Promise<void>;
    searchProducts: (name: string) => Promise<void>;

    // CRUD actions
    createProduct: (data: ProductCreateRequest) => Promise<ProductResponse>;
    updateProduct: (id: number, data: ProductUpdateRequest) => Promise<ProductResponse>;
    deleteProduct: (id: number) => Promise<void>;

    // State management
    setCurrentProduct: (product: ProductResponse | null) => void;
    clearError: () => void;
    clearProducts: () => void;
}

type ProductStore = ProductState & ProductActions;

export const useProductStore = create<ProductStore>((set, get) => ({
    products: [],
    currentProduct: null,
    isLoading: false,
    error: null,
    lastFetchedSellerId: null,
    isFetching: false,

    fetchAllProducts: async () => {
        const state = get();
        if (state.isFetching) return; // Evitar llamadas concurrentes

        set({ isLoading: true, error: null, isFetching: true });
        try {
            const products = await springApiClient.getAllProducts();
            set({ products, isLoading: false, isFetching: false });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Failed to fetch products';
            set({ error: errorMessage, isLoading: false, isFetching: false });
        }
    },

    fetchAvailableProducts: async () => {
        const state = get();
        if (state.isFetching) return;

        set({ isLoading: true, error: null, isFetching: true });
        try {
            const products = await springApiClient.getAvailableProducts();
            set({ products, isLoading: false, isFetching: false });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Failed to fetch available products';
            set({ error: errorMessage, isLoading: false, isFetching: false });
        }
    },

    fetchProductById: async (id: number) => {
        const state = get();
        if (state.isFetching) return;

        set({ isLoading: true, error: null, isFetching: true });
        try {
            const product = await springApiClient.getProductById(id);
            set({ currentProduct: product, isLoading: false, isFetching: false });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Product not found';
            set({ error: errorMessage, isLoading: false, isFetching: false });
        }
    },

    fetchProductsBySeller: async (sellerId: number) => {
        const state = get();

        // Evitar llamadas repetidas para el mismo seller
        if (state.isFetching || (state.lastFetchedSellerId === sellerId && state.products.length > 0)) {
            console.log('🚫 Skipping duplicate request for seller:', sellerId);
            return;
        }

        console.log('📦 Fetching products for seller:', sellerId);
        set({ isLoading: true, error: null, isFetching: true });

        try {
            const products = await springApiClient.getProductsBySeller(sellerId);
            set({
                products,
                isLoading: false,
                isFetching: false,
                lastFetchedSellerId: sellerId
            });
            console.log('✅ Products fetched successfully:', products.length);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Failed to fetch seller products';
            console.error('❌ Error fetching products:', errorMessage);
            set({ error: errorMessage, isLoading: false, isFetching: false });
        }
    },

    searchProducts: async (name: string) => {
        if (!name.trim()) {
            set({ products: [] });
            return;
        }

        const state = get();
        if (state.isFetching) return;

        set({ isLoading: true, error: null, isFetching: true });
        try {
            const products = await springApiClient.searchProducts(name);
            set({ products, isLoading: false, isFetching: false });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Search failed';
            set({ error: errorMessage, isLoading: false, isFetching: false });
        }
    },

    createProduct: async (data: ProductCreateRequest) => {
        set({ isLoading: true, error: null });
        try {
            const product = await springApiClient.createProduct(data);
            set(state => ({
                products: [...state.products, product],
                isLoading: false
            }));
            return product;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Failed to create product';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    updateProduct: async (id: number, data: ProductUpdateRequest) => {
        set({ isLoading: true, error: null });
        try {
            const updatedProduct = await springApiClient.updateProduct(id, data);
            set(state => ({
                products: state.products.map(p => p.id === id ? updatedProduct : p),
                currentProduct: state.currentProduct?.id === id ? updatedProduct : state.currentProduct,
                isLoading: false
            }));
            return updatedProduct;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Failed to update product';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    deleteProduct: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            await springApiClient.deleteProduct(id);
            set(state => ({
                products: state.products.filter(p => p.id !== id),
                currentProduct: state.currentProduct?.id === id ? null : state.currentProduct,
                isLoading: false
            }));
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Failed to delete product';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    setCurrentProduct: (product: ProductResponse | null) => {
        set({ currentProduct: product });
    },

    clearError: () => set({ error: null }),

    clearProducts: () => set({
        products: [],
        currentProduct: null,
        lastFetchedSellerId: null,
        isFetching: false
    }),
}));
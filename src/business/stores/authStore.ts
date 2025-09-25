import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { springApiClient, type UserResponse, type LoginRequest } from '../../data/api/springApiClient';

interface AuthState {
    user: UserResponse | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

interface AuthActions {
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    getCurrentUser: () => Promise<void>;
    clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (credentials: LoginRequest) => {
                set({ isLoading: true, error: null });

                try {
                    console.log('🚀 Attempting login with:', {
                        username: credentials.username,
                        apiUrl: 'http://localhost:8080/api/users/login'
                    });

                    const tokenResponse = await springApiClient.login(credentials);
                    console.log('✅ Login successful, token received');

                    springApiClient.setAuth(tokenResponse.token);

                    // Get current user data
                    const user = await springApiClient.getCurrentUser();
                    console.log('✅ User data retrieved:', {
                        id: user.id,
                        role: user.role,
                        firstName: user.firstName
                    });

                    set({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                } catch (error: unknown) {
                    console.error('❌ Login failed:', error);

                    let errorMessage = 'Login failed';

                    if (error && typeof error === 'object' && 'response' in error) {
                        const axiosError = error as any;
                        if (axiosError.response?.status === 401) {
                            errorMessage = 'Invalid credentials';
                        } else if (axiosError.response?.status === 403) {
                            errorMessage = 'Account is disabled';
                        } else if (axiosError.response?.data?.message) {
                            errorMessage = axiosError.response.data.message;
                        } else if (axiosError.code === 'ERR_NETWORK') {
                            errorMessage = 'Cannot connect to server. Please check if the backend is running.';
                        }
                    } else if (error instanceof Error) {
                        errorMessage = error.message;
                    }

                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: errorMessage,
                    });
                    throw error;
                }
            },

            logout: () => {
                console.log('🚪 Logging out');
                springApiClient.clearAuth();
                set({
                    user: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            getCurrentUser: async () => {
                if (!get().isAuthenticated) return;

                set({ isLoading: true });

                try {
                    const user = await springApiClient.getCurrentUser();
                    set({ user, isLoading: false });
                } catch (error) {
                    console.error('❌ Failed to get current user:', error);
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: 'Failed to get user data'
                    });
                }
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);
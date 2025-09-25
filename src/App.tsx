import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './business/stores/authStore';
import LoginForm from './presentation/components/auth/LoginForm';
import CustomerDashboard from './presentation/pages/CustomerDashboard';
import SellerDashboard from './presentation/pages/SellerDashboard';
import AdminDashboard from './presentation/pages/AdminDashboard';

// Loading component
const LoadingScreen: React.FC = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
        </div>
    </div>
);

// Protected Route component
interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};

// Unauthorized component
const Unauthorized: React.FC = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.18 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">
                You don't have permission to access this page.
            </p>
            <button
                onClick={() => window.location.href = '/'}
                className="btn-primary"
            >
                Go Home
            </button>
        </div>
    </div>
);

// Login Page component
const LoginPage: React.FC = () => {
    const { isAuthenticated, user } = useAuthStore();

    // Redirect if already authenticated
    if (isAuthenticated && user) {
        const redirectPath = user.role === 'ADMIN'
            ? '/admin'
            : user.role === 'SELLER'
                ? '/seller'
                : '/customer';
        return <Navigate to={redirectPath} replace />;
    }

    const handleLoginSuccess = () => {
        // Navigation will be handled by the redirect logic above
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-md w-full px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary-600 mb-2">EcommerceCapas</h1>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>
                <LoginForm onSuccess={handleLoginSuccess} />
            </div>
        </div>
    );
};

// Navigation Header for authenticated users
const AppHeader: React.FC = () => {
    const { user, logout } = useAuthStore();

    if (!user) return null;

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="container max-w-7xl">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-primary-600">EcommerceCapas</h1>
                        <span className="ml-4 text-sm text-gray-500">
              {user.role === 'ADMIN' ? 'Admin Panel' :
                  user.role === 'SELLER' ? 'Seller Dashboard' :
                      'Customer Portal'}
            </span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-sm">
                            <span className="text-gray-600">Welcome, </span>
                            <span className="font-medium text-gray-900">{user.firstName}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                                user.role === 'SELLER' ? 'bg-orange-100 text-orange-800' :
                                    'bg-blue-100 text-blue-800'
                        }`}>
              {user.role}
            </span>
                        <button
                            onClick={logout}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

// Main App component
function App() {
    const { isAuthenticated, user, getCurrentUser } = useAuthStore();
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        // Check if user is already authenticated on app start
        const checkAuth = async () => {
            if (isAuthenticated && user) {
                try {
                    await getCurrentUser();
                } catch (error) {
                    console.error('Failed to get current user:', error);
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, [isAuthenticated, user, getCurrentUser]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                {isAuthenticated && <AppHeader />}

                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    {/* Protected routes */}
                    <Route
                        path="/customer"
                        element={
                            <ProtectedRoute allowedRoles={['CUSTOMER']}>
                                <CustomerDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/seller"
                        element={
                            <ProtectedRoute allowedRoles={['SELLER']}>
                                <SellerDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Default redirects */}
                    <Route
                        path="/"
                        element={
                            isAuthenticated && user ? (
                                <Navigate
                                    to={
                                        user.role === 'ADMIN' ? '/admin' :
                                            user.role === 'SELLER' ? '/seller' :
                                                '/customer'
                                    }
                                    replace
                                />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />

                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
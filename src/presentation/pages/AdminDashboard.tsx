import React, { useState, useEffect } from 'react';
import { springApiClient, type UserResponse } from '../../data/api/springApiClient';
import { useAuthStore } from '../../business/stores/authStore';
import { useProductStore } from '../../business/stores/productStore';
import { formatCurrency } from '../../shared/utils';

type TabType = 'overview' | 'users' | 'products';

const AdminDashboard: React.FC = () => {
    const { user } = useAuthStore();
    const { products, fetchAllProducts, deleteProduct } = useProductStore();
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const usersData = await springApiClient.getAllUsers();
            await fetchAllProducts();
            setUsers(usersData);
            setError('');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Failed to load data';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            await springApiClient.deleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Failed to delete user';
            setError(errorMessage);
        }
    };

    const handleDeleteProduct = async (productId: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await deleteProduct(productId);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Failed to delete product';
            setError(errorMessage);
        }
    };

    const getUserStats = () => {
        const stats = users.reduce(
            (acc, user) => {
                acc[user.role] = (acc[user.role] || 0) + 1;
                if (user.active) acc.active++;
                return acc;
            },
            { ADMIN: 0, CUSTOMER: 0, SELLER: 0, active: 0 } as Record<string, number>
        );
        return stats;
    };

    const getProductStats = () => {
        return products.reduce(
            (acc, product) => {
                if (product.active) acc.active++;
                acc.totalValue += product.price * product.stock;
                acc.totalStock += product.stock;
                return acc;
            },
            { active: 0, totalValue: 0, totalStock: 0 }
        );
    };

    const renderOverview = () => {
        const userStats = getUserStats();
        const productStats = getProductStats();

        return (
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                        <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                        <p className="text-sm text-green-600">{userStats.active} active</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
                        <p className="text-3xl font-bold text-gray-900">{products.length}</p>
                        <p className="text-sm text-green-600">{productStats.active} active</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-sm font-medium text-gray-500">Total Stock</h3>
                        <p className="text-3xl font-bold text-blue-600">{productStats.totalStock}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-sm font-medium text-gray-500">Inventory Value</h3>
                        <p className="text-3xl font-bold text-purple-600">{formatCurrency(productStats.totalValue)}</p>
                    </div>
                </div>

                {/* User Role Distribution */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{userStats.ADMIN}</p>
                            <p className="text-sm text-gray-600">Admins</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{userStats.CUSTOMER}</p>
                            <p className="text-sm text-gray-600">Customers</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-orange-600">{userStats.SELLER}</p>
                            <p className="text-sm text-gray-600">Sellers</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderUsers = () => (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">All Users ({users.length})</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((userItem) => (
                        <tr key={userItem.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {userItem.firstName} {userItem.lastName}
                                    </div>
                                    <div className="text-sm text-gray-500">ID: {userItem.id}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{userItem.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                  <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          userItem.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800'
                              : userItem.role === 'SELLER'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-blue-100 text-blue-800'
                      }`}
                  >
                    {userItem.role}
                  </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                  <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          userItem.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {userItem.active ? 'Active' : 'Inactive'}
                  </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(userItem.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {userItem.id !== user?.id && ( // Don't allow deleting self
                                    <button
                                        onClick={() => handleDeleteUser(userItem.id)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderProducts = () => (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">All Products ({products.length})</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Seller
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        {product.imageDataUrl ? (
                                            <img
                                                className="h-10 w-10 rounded-lg object-cover"
                                                src={product.imageDataUrl}
                                                alt={product.name}
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                        <div className="text-sm text-gray-500">ID: {product.id}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{product.seller.fullName}</div>
                                <div className="text-sm text-gray-500">{product.seller.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{formatCurrency(product.price)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{product.stock}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                  <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.active
                              ? product.available
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {product.active
                        ? product.available
                            ? 'Active'
                            : 'Out of Stock'
                        : 'Inactive'}
                  </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container max-w-7xl py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600">Welcome, {user?.firstName}! Manage your platform</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="mb-8 border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {[
                            { key: 'overview', label: 'Overview' },
                            { key: 'users', label: 'Users' },
                            { key: 'products', label: 'Products' },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as TabType)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab.key
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        <p className="mt-2 text-gray-600">Loading data...</p>
                    </div>
                )}

                {/* Tab Content */}
                {!isLoading && (
                    <>
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'users' && renderUsers()}
                        {activeTab === 'products' && renderProducts()}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
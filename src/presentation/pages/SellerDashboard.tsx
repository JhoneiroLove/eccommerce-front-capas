import React, { useState, useEffect, useCallback } from 'react';
import { useProductStore } from '../../business/stores/productStore';
import { useAuthStore } from '../../business/stores/authStore';
import ProductForm from '../components/products/ProductForm';
import { formatCurrency } from '../../shared/utils';
import type { ProductResponse } from '../../data/api/springApiClient';

type ViewMode = 'list' | 'create' | 'edit';

const SellerDashboard: React.FC = () => {
    const { products, isLoading, error, fetchProductsBySeller, deleteProduct, clearError } = useProductStore();
    const { user } = useAuthStore();
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    // Memorizar la función para evitar re-renders innecesarios
    const loadProducts = useCallback(() => {
        if (user?.id) {
            fetchProductsBySeller(user.id);
        }
    }, [user?.id, fetchProductsBySeller]);

    // Solo ejecutar una vez cuando el componente se monta y cuando cambia el user.id
    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const handleCreateProduct = () => {
        clearError();
        setSelectedProduct(null);
        setViewMode('create');
    };

    const handleEditProduct = (product: ProductResponse) => {
        clearError();
        setSelectedProduct(product);
        setViewMode('edit');
    };

    const handleDeleteProduct = async (productId: number) => {
        try {
            await deleteProduct(productId);
            setDeleteConfirm(null);
        } catch (error) {
            // Error handled by store
        }
    };

    const handleFormSuccess = () => {
        setViewMode('list');
        setSelectedProduct(null);
        // Recargar productos solo después de crear/editar
        loadProducts();
    };

    const getTotalValue = () => {
        return products.reduce((total, product) => total + (product.price * product.stock), 0);
    };

    const getActiveProductsCount = () => {
        return products.filter(product => product.active).length;
    };

    const getTotalStock = () => {
        return products.reduce((total, product) => total + product.stock, 0);
    };

    if (viewMode === 'create') {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container max-w-4xl py-8">
                    <div className="mb-6">
                        <button
                            onClick={() => setViewMode('list')}
                            className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Products
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <ProductForm
                            onSuccess={handleFormSuccess}
                            onCancel={() => setViewMode('list')}
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (viewMode === 'edit' && selectedProduct) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container max-w-4xl py-8">
                    <div className="mb-6">
                        <button
                            onClick={() => setViewMode('list')}
                            className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Products
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <ProductForm
                            product={selectedProduct}
                            onSuccess={handleFormSuccess}
                            onCancel={() => setViewMode('list')}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container max-w-7xl py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
                        <p className="text-gray-600">Welcome, {user?.firstName}! Manage your products</p>
                    </div>
                    <button
                        onClick={handleCreateProduct}
                        className="btn-primary"
                        disabled={isLoading}
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        New Product
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
                        <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-sm font-medium text-gray-500">Active Products</h3>
                        <p className="text-2xl font-bold text-green-600">{getActiveProductsCount()}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-sm font-medium text-gray-500">Total Stock</h3>
                        <p className="text-2xl font-bold text-blue-600">{getTotalStock()}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-sm font-medium text-gray-500">Inventory Value</h3>
                        <p className="text-2xl font-bold text-purple-600">{formatCurrency(getTotalValue())}</p>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Products Table */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Your Products</h2>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                            <p className="mt-2 text-gray-600">Loading products...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m4 0h4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                            <p className="text-gray-600 mb-4">Start selling by creating your first product</p>
                            <button
                                onClick={handleCreateProduct}
                                className="btn-primary"
                            >
                                Create Product
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
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
                                                <div className="flex-shrink-0 h-12 w-12">
                                                    {product.imageDataUrl ? (
                                                        <img
                                                            className="h-12 w-12 rounded-lg object-cover"
                                                            src={product.imageDataUrl}
                                                            alt={product.name}
                                                        />
                                                    ) : (
                                                        <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                    <div className="text-sm text-gray-500 max-w-xs truncate">{product.description}</div>
                                                </div>
                                            </div>
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
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEditProduct(product)}
                                                    className="text-primary-600 hover:text-primary-700"
                                                >
                                                    Edit
                                                </button>
                                                {deleteConfirm === product.id ? (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleDeleteProduct(product.id)}
                                                            className="text-red-600 hover:text-red-700"
                                                            disabled={isLoading}
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm(null)}
                                                            className="text-gray-600 hover:text-gray-700"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setDeleteConfirm(product.id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;
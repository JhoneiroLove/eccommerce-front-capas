import React, { useState, useEffect } from 'react';
import { useProductStore } from '../../business/stores/productStore';
import { useCartStore } from '../../business/stores/cartStore';
import { useAuthStore } from '../../business/stores/authStore';
import { formatCurrency } from '../../shared/utils';
import type { ProductResponse } from '../../data/api/springApiClient';

const CustomerDashboard: React.FC = () => {
    const { products, isLoading, error, fetchAvailableProducts, searchProducts } = useProductStore();
    const { addItem } = useCartStore();
    const { user } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        fetchAvailableProducts();
    }, [fetchAvailableProducts]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            fetchAvailableProducts();
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        await searchProducts(searchQuery);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setIsSearching(false);
        fetchAvailableProducts();
    };

    const handleAddToCart = (product: ProductResponse) => {
        // Convert ProductResponse to your Product type for cart
        const cartProduct = {
            id: product.id.toString(),
            name: product.name,
            description: product.description,
            price: product.price,
            category: 'general',
            image: product.imageDataUrl || '/placeholder-product.jpg',
            stock: product.stock,
            rating: 4.5,
            reviews: 10,
            createdAt: new Date(product.createdAt),
            updatedAt: new Date(product.updatedAt),
        };

        addItem(cartProduct, 1);
    };

    const getStockStatus = (product: ProductResponse) => {
        if (product.stock === 0) return { text: 'Out of Stock', color: 'text-red-600' };
        if (product.stock < 5) return { text: 'Low Stock', color: 'text-orange-600' };
        return { text: 'In Stock', color: 'text-green-600' };
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container max-w-7xl py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.firstName}!</h1>
                    <p className="text-gray-600">Discover amazing products from our sellers</p>
                </div>

                {/* Search Bar */}
                <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for products..."
                                className="input-field"
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn-primary px-6"
                            disabled={isLoading}
                        >
                            Search
                        </button>
                        {isSearching && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="btn-secondary px-6"
                            >
                                Clear
                            </button>
                        )}
                    </form>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        <p className="mt-2 text-gray-600">Loading products...</p>
                    </div>
                )}

                {/* Products Grid */}
                {!isLoading && (
                    <>
                        <div className="mb-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {isSearching ? `Search Results (${products.length})` : `Available Products (${products.length})`}
                            </h2>
                        </div>

                        {products.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg border">
                                <div className="text-gray-400 mb-4">
                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m4 0h4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-600">
                                    {isSearching ? 'Try a different search term' : 'No products are currently available'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((product) => {
                                    const stockStatus = getStockStatus(product);

                                    return (
                                        <div key={product.id} className="card overflow-hidden">
                                            {/* Product Image */}
                                            <div className="aspect-w-1 aspect-h-1 w-full h-48 bg-gray-200">
                                                {product.imageDataUrl ? (
                                                    <img
                                                        src={product.imageDataUrl}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                        }}
                                                    />
                                                ) : null}
                                                <div className={`${product.imageDataUrl ? 'hidden' : ''} w-full h-full flex items-center justify-center text-gray-400`}>
                                                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            </div>

                                            {/* Product Info */}
                                            <div className="p-4">
                                                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>

                                                <div className="flex justify-between items-center mb-2">
                          <span className="text-lg font-bold text-primary-600">
                            {formatCurrency(product.price)}
                          </span>
                                                    <span className={`text-sm ${stockStatus.color}`}>
                            {stockStatus.text}
                          </span>
                                                </div>

                                                <p className="text-xs text-gray-500 mb-3">
                                                    Sold by: {product.seller.fullName}
                                                </p>

                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={!product.available}
                                                    className="btn-primary w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {product.available ? 'Add to Cart' : 'Out of Stock'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard;
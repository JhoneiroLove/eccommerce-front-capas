import React from 'react';

const Products: React.FC = () => {
  return (
    <div className="container max-w-7xl py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Products</h1>
        <p className="text-xl text-gray-600 mb-8">Discover our amazing collection of products</p>
        
        <div className="bg-white p-12 rounded-lg shadow-md border border-gray-200">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-gray-600 mb-6">
              We're working hard to bring you an amazing product catalog. 
              This page will soon display all our available products with filtering and search capabilities.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Product grid with images and details</p>
              <p>• Advanced filtering and sorting</p>
              <p>• Search functionality</p>
              <p>• Pagination for better performance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
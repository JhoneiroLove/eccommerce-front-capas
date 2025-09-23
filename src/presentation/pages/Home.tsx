import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../shared/constants';

const Home: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container max-w-7xl py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to EcommerceCapas
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Discover amazing products with our modern, layered architecture approach. 
              Built with React, TypeScript, and the latest technologies.
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Link
                to={ROUTES.PRODUCTS}
                className="btn-primary inline-block text-lg px-8 py-3 bg-white text-primary-600 hover:bg-gray-100"
              >
                Shop Now
              </Link>
              <Link
                to={ROUTES.CATEGORIES}
                className="btn-secondary inline-block text-lg px-8 py-3 bg-primary-500 text-white hover:bg-primary-400 border-2 border-white"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose EcommerceCapas?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We combine modern architecture with exceptional user experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast Performance</h3>
              <p className="text-gray-600">
                Built with Vite and optimized for speed, delivering lightning-fast loading times.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Products</h3>
              <p className="text-gray-600">
                Carefully curated selection of high-quality products from trusted vendors.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Our dedicated support team is always ready to help you with any questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="container max-w-7xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore our wide range of products and find exactly what you're looking for.
          </p>
          <Link
            to={ROUTES.PRODUCTS}
            className="btn-primary inline-block text-lg px-8 py-3"
          >
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Products from '../pages/Products';
import Cart from '../pages/Cart';
import { ROUTES } from '../../shared/constants';

// Placeholder components for routes not yet implemented
const Categories: React.FC = () => (
  <div className="container max-w-7xl py-8 text-center">
    <h1 className="text-4xl font-bold mb-4">Categories</h1>
    <p className="text-gray-600">Categories page coming soon...</p>
  </div>
);

const ProductDetail: React.FC = () => (
  <div className="container max-w-7xl py-8 text-center">
    <h1 className="text-4xl font-bold mb-4">Product Detail</h1>
    <p className="text-gray-600">Product detail page coming soon...</p>
  </div>
);

const Checkout: React.FC = () => (
  <div className="container max-w-7xl py-8 text-center">
    <h1 className="text-4xl font-bold mb-4">Checkout</h1>
    <p className="text-gray-600">Checkout page coming soon...</p>
  </div>
);

const Profile: React.FC = () => (
  <div className="container max-w-7xl py-8 text-center">
    <h1 className="text-4xl font-bold mb-4">Profile</h1>
    <p className="text-gray-600">Profile page coming soon...</p>
  </div>
);

const Search: React.FC = () => (
  <div className="container max-w-7xl py-8 text-center">
    <h1 className="text-4xl font-bold mb-4">Search Results</h1>
    <p className="text-gray-600">Search results page coming soon...</p>
  </div>
);

const NotFound: React.FC = () => (
  <div className="container max-w-7xl py-16 text-center">
    <div className="max-w-md mx-auto">
      <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-8">
        Sorry, the page you are looking for doesn't exist.
      </p>
      <a
        href={ROUTES.HOME}
        className="btn-primary inline-block"
      >
        Go Back Home
      </a>
    </div>
  </div>
);

const AppRouter: React.FC = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.PRODUCTS} element={<Products />} />
          <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetail />} />
          <Route path={ROUTES.CATEGORIES} element={<Categories />} />
          <Route path={ROUTES.CART} element={<Cart />} />
          <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
          <Route path={ROUTES.PROFILE} element={<Profile />} />
          <Route path={ROUTES.SEARCH} element={<Search />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default AppRouter;
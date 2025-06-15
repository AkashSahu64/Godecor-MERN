import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// User Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Context & Redux
import { checkAuth } from './redux/slices/authSlice';

// Routes
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* User Routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="orders" element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } />
          <Route path="orders/:id" element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          } />
          <Route path="wishlist" element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
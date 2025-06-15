import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Heart, User, Menu, X, LogOut, Settings } from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import { setSearchQuery, toggleMobileMenu, closeMobileMenu } from '../../redux/slices/uiSlice';
import useDebounce from '../../hooks/useDebounce';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { mobileMenuOpen, searchQuery } = useSelector((state) => state.ui);
  const { items } = useSelector((state) => state.cart);
  
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch));
    
    if (debouncedSearch && location.pathname !== '/products') {
      navigate('/products');
    }
  }, [debouncedSearch, dispatch, navigate, location.pathname]);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    dispatch(closeMobileMenu());
  }, [location, dispatch]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/products');
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  
  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-dark-800/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-display font-bold text-primary-400">
            Godecor
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-white hover:text-primary-400 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-white hover:text-primary-400 transition-colors"
            >
              Products
            </Link>
            {isAuthenticated && (
              <Link
                to="/orders"
                className="text-white hover:text-primary-400 transition-colors"
              >
                Orders
              </Link>
            )}
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 lg:w-64 bg-dark-700 border border-dark-600 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <Search size={18} />
              </button>
            </form>
            
            <div className="flex items-center space-x-3">
              <Link
                to="/cart"
                className="relative p-2 text-white hover:text-primary-400 transition-colors"
              >
                <ShoppingCart size={20} />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Link>
              
              {isAuthenticated && (
                <Link
                  to="/wishlist"
                  className="p-2 text-white hover:text-primary-400 transition-colors"
                >
                  <Heart size={20} />
                </Link>
              )}
              
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-2 text-white hover:text-primary-400 transition-colors focus:outline-none"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center text-white font-medium">
                      {user?.name.charAt(0)}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 glass-card rounded-lg shadow-lg py-1"
                      >
                        <div className="px-4 py-2 text-sm border-b border-dark-600">
                          Signed in as{' '}
                          <span className="font-semibold">{user?.name}</span>
                        </div>
                        
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm hover:bg-dark-700 flex items-center"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User size={16} className="mr-2" />
                          My Profile
                        </Link>
                        
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm hover:bg-dark-700 flex items-center"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <ShoppingCart size={16} className="mr-2" />
                          My Orders
                        </Link>
                        
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-sm hover:bg-dark-700 flex items-center"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings size={16} className="mr-2" />
                          Settings
                        </Link>
                        
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            handleLogout();
                          }}
                          className="block w-full px-4 py-2 text-sm hover:bg-dark-700 text-left text-red-400 flex items-center"
                        >
                          <LogOut size={16} className="mr-2" />
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="p-2 text-white hover:text-primary-400 transition-colors"
                >
                  <User size={20} />
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setShowSearchBox(!showSearchBox)}
              className="p-2 mr-2 text-white"
            >
              <Search size={20} />
            </button>
            
            <Link
              to="/cart"
              className="relative p-2 mr-4 text-white"
            >
              <ShoppingCart size={20} />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => dispatch(toggleMobileMenu())}
              className="p-2 text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {showSearchBox && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden mt-4 overflow-hidden"
            >
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <Search size={18} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden glass-card"
          >
            <nav className="flex flex-col py-4">
              <Link
                to="/"
                className="px-4 py-3 text-white hover:bg-dark-700"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="px-4 py-3 text-white hover:bg-dark-700"
              >
                Products
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/profile"
                    className="px-4 py-3 text-white hover:bg-dark-700"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="px-4 py-3 text-white hover:bg-dark-700"
                  >
                    Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    className="px-4 py-3 text-white hover:bg-dark-700"
                  >
                    Wishlist
                  </Link>
                </>
              )}
              
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-3 text-left text-red-400 hover:bg-dark-700 flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign out
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-3 text-white hover:bg-dark-700"
                >
                  Sign in
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { login, resetAuthState } from '../redux/slices/authSlice';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error } = useSelector((state) => state.auth);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset any previous auth errors
    dispatch(resetAuthState());
    
    if (validateForm()) {
      try {
        await dispatch(login(formData)).unwrap();
        navigate('/');
      } catch (err) {
        // Error is handled in the thunk and shown from the redux state
      }
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 pb-12 flex items-center justify-center"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto glass-card rounded-xl p-8">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-display font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your account</p>
          </motion.div>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`input w-full ${errors.email ? 'border-red-500' : ''}`}
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className={`input w-full pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            
            <div className="flex justify-end mb-6">
              <Link to="#" className="text-sm text-primary-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                <>
                  <LogIn size={18} className="mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-400 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-dark-700">
            <p className="text-sm text-center text-gray-400 mb-4">
              Demo account: akash@example.com / password123
            </p>
            <p className="text-sm text-center text-gray-400">
              Admin account: admin@example.com / admin123
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage;
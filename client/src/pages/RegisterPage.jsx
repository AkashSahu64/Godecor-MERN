import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { register, resetAuthState } from '../redux/slices/authSlice';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
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
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
        // Remove confirmPassword before sending to API
        const { confirmPassword, ...userData } = formData;
        await dispatch(register(userData)).unwrap();
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
            <h1 className="text-3xl font-display font-bold mb-2">Create Account</h1>
            <p className="text-gray-400">Join PlantHaven today</p>
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
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`input w-full ${errors.name ? 'border-red-500' : ''}`}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            
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
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                className={`input w-full ${errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <span className="animate-pulse">Creating account...</span>
                ) : (
                  <>
                    <UserPlus size={18} className="mr-2" />
                    Create Account
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
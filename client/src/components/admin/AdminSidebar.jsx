import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Users,
  BarChart,
  Tag,
  Settings,
  LogOut,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const AdminSidebar = () => {
  const dispatch = useDispatch();
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  const sidebarLinks = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: <ShoppingBag size={20} />,
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: <ShoppingCart size={20} />,
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: <Users size={20} />,
    },
    {
      name: 'Categories',
      path: '/admin/categories',
      icon: <Tag size={20} />,
    },
    {
      name: 'Analytics',
      path: '/admin/analytics',
      icon: <BarChart size={20} />,
    },
  ];
  
  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="hidden md:flex flex-col w-64 bg-dark-800 border-r border-dark-700 min-h-screen"
    >
      <div className="p-5 border-b border-dark-700">
        <h1 className="text-2xl font-display font-bold text-primary-400">
          Godecor
        </h1>
        <p className="text-gray-400 text-sm">Admin Panel</p>
      </div>
      
      <div className="flex-1 py-5 px-4">
        <div className="space-y-1">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-600/20 text-primary-400'
                    : 'text-gray-400 hover:bg-dark-700 hover:text-white'
                }`
              }
              end={link.path === '/admin'}
            >
              <span className="mr-3">{link.icon}</span>
              <span>{link.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-dark-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 rounded-lg text-red-400 hover:bg-dark-700 transition-colors"
        >
          <LogOut size={20} className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </motion.div>
  );
};

export default AdminSidebar;
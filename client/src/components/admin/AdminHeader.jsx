import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Bell, Menu, X, Search } from 'lucide-react';
import { toggleMobileMenu } from '../../redux/slices/uiSlice';

const AdminHeader = () => {
  const dispatch = useDispatch();
  const { mobileMenuOpen } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);
  
  const [notifications] = useState([
    {
      id: 1,
      message: 'New order received',
      time: '5 minutes ago',
      read: false,
    },
    {
      id: 2,
      message: 'New user registered',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      message: 'Server update completed',
      time: '2 hours ago',
      read: true,
    },
  ]);
  
  const [showNotifications, setShowNotifications] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <header className="bg-dark-800 border-b border-dark-700 py-4 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={() => dispatch(toggleMobileMenu())}
          className="md:hidden mr-4 text-gray-400 hover:text-white"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 bg-dark-700 border border-dark-600 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <Search size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-400 hover:text-white rounded-full hover:bg-dark-700"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          
          {/* Notification dropdown */}
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-72 glass-card rounded-lg shadow-lg z-10"
            >
              <div className="px-4 py-2 border-b border-dark-600 flex justify-between items-center">
                <h3 className="font-medium">Notifications</h3>
                <span className="text-xs text-gray-400">Mark all as read</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 border-b border-dark-600 hover:bg-dark-700 cursor-pointer ${
                        !notification.read ? 'bg-dark-700/50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-sm">{notification.message}</p>
                        {!notification.read && (
                          <span className="bg-primary-500 h-2 w-2 rounded-full flex-shrink-0"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 py-2 text-center text-sm text-primary-400 border-t border-dark-600">
                View all notifications
              </div>
            </motion.div>
          )}
        </div>
        
        {/* User profile */}
        <div className="flex items-center">
          <div className="h-8 w-8 bg-gradient-to-br from-primary-400 to-secondary-600 rounded-full flex items-center justify-center text-white font-medium mr-2">
            {user?.name.charAt(0)}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
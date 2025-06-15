import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit, Check, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success('Profile updated successfully!');
    setIsSaving(false);
    setIsEditing(false);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-24 pb-16"
    >
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your account information</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <motion.div
              className="glass-card rounded-xl overflow-hidden"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="p-6 border-b border-dark-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn-outline flex items-center"
                >
                  {isEditing ? (
                    <>
                      <X size={16} className="mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit size={16} className="mr-2" />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>
              
              <div className="p-6">
                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div className="form-group">
                        <label htmlFor="name" className="form-label">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="input w-full"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="email" className="form-label">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="input w-full"
                          disabled
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="phone" className="form-label">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="input w-full"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="address" className="form-label">
                          Address
                        </label>
                        <textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows="3"
                          className="input w-full"
                        ></textarea>
                      </div>
                      
                      <div className="border-t border-dark-700 pt-6">
                        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                        
                        <div className="space-y-4">
                          <div className="form-group">
                            <label htmlFor="currentPassword" className="form-label">
                              Current Password
                            </label>
                            <input
                              type="password"
                              id="currentPassword"
                              name="currentPassword"
                              value={formData.currentPassword}
                              onChange={handleChange}
                              className="input w-full"
                            />
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="newPassword" className="form-label">
                              New Password
                            </label>
                            <input
                              type="password"
                              id="newPassword"
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleChange}
                              className="input w-full"
                            />
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              id="confirmPassword"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              className="input w-full"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <motion.button
                          type="submit"
                          className="btn-primary flex items-center"
                          disabled={isSaving}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isSaving ? (
                            <>
                              <div className="animate-spin mr-2">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                              </div>
                              Saving Changes...
                            </>
                          ) : (
                            <>
                              <Check size={16} className="mr-2" />
                              Save Changes
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <User className="w-5 h-5 text-primary-400 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-400">Full Name</p>
                        <p className="mt-1">{formData.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Mail className="w-5 h-5 text-primary-400 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-400">Email Address</p>
                        <p className="mt-1">{formData.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="w-5 h-5 text-primary-400 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-400">Phone Number</p>
                        <p className="mt-1">{formData.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-primary-400 mt-1 mr-3" />
                      <div>
                        <p className="text-sm text-gray-400">Address</p>
                        <p className="mt-1">{formData.address || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          
          {/* Activity Summary */}
          <div className="lg:col-span-1">
            <motion.div
              className="glass-card rounded-xl overflow-hidden"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="p-6 border-b border-dark-700">
                <h2 className="text-xl font-semibold">Account Summary</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Member Since</p>
                    <p className="text-lg">January 2024</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Total Orders</p>
                    <p className="text-lg">12</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Wishlist Items</p>
                    <p className="text-lg">5</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Last Login</p>
                    <p className="text-lg">Today at 10:30 AM</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-dark-700">
                  <h3 className="text-sm font-medium text-gray-400 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Link
                      to="/orders"
                      className="block w-full py-2 px-4 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors"
                    >
                      View Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block w-full py-2 px-4 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors"
                    >
                      View Wishlist
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
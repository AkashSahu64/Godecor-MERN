import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Search, X, UserX, UserCheck, ArrowUp, ArrowDown } from 'lucide-react';
import { fetchUsers, updateUserStatus } from '../../redux/slices/userSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const AdminUsersPage = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  
  // Fetch users
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  
  // Filter and sort users
  useEffect(() => {
    let filtered = [...users];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let valueA = a[sortConfig.key];
        let valueB = b[sortConfig.key];
        
        // Date comparison
        if (sortConfig.key === 'createdAt') {
          valueA = new Date(valueA);
          valueB = new Date(valueB);
        }
        
        if (valueA < valueB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredUsers(filtered);
  }, [searchTerm, users, sortConfig]);
  
  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };
  
  const handleToggleUserStatus = (userId, isBlocked) => {
    const newStatus = !isBlocked;
    if (window.confirm(`Are you sure you want to ${newStatus ? 'block' : 'unblock'} this user?`)) {
      dispatch(updateUserStatus({ userId, isBlocked: newStatus }));
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold mb-1">Users</h1>
          <p className="text-gray-400">Manage user accounts</p>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full sm:w-64"
          />
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      
      {loading && !users.length ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-700">
                <tr>
                  <th
                    className="py-4 px-6 text-left cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      {sortConfig.key === 'name' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? (
                            <ArrowUp size={14} />
                          ) : (
                            <ArrowDown size={14} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="py-4 px-6 text-left cursor-pointer"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      Email
                      {sortConfig.key === 'email' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? (
                            <ArrowUp size={14} />
                          ) : (
                            <ArrowDown size={14} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="py-4 px-6 text-left cursor-pointer"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center">
                      Role
                      {sortConfig.key === 'role' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? (
                            <ArrowUp size={14} />
                          ) : (
                            <ArrowDown size={14} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="py-4 px-6 text-left cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Joined
                      {sortConfig.key === 'createdAt' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? (
                            <ArrowUp size={14} />
                          ) : (
                            <ArrowDown size={14} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="py-4 px-6 text-left cursor-pointer"
                    onClick={() => handleSort('isBlocked')}
                  >
                    <div className="flex items-center">
                      Status
                      {sortConfig.key === 'isBlocked' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? (
                            <ArrowUp size={14} />
                          ) : (
                            <ArrowDown size={14} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-4 text-center text-gray-400">
                      {searchTerm
                        ? 'No users found matching your search'
                        : 'No users available'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-dark-700/50"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center text-white font-medium mr-3">
                            {user.name.charAt(0)}
                          </div>
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">{user.email}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'admin'
                              ? 'bg-purple-500/20 text-purple-500'
                              : 'bg-blue-500/20 text-blue-500'
                          }`}
                        >
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">{formatDate(user.createdAt)}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.isBlocked
                              ? 'bg-red-500/20 text-red-500'
                              : 'bg-green-500/20 text-green-500'
                          }`}
                        >
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleUserStatus(user.id, user.isBlocked)}
                            className={`p-2 text-gray-400 hover:${
                              user.isBlocked ? 'text-green-500' : 'text-red-500'
                            } transition-colors`}
                            title={user.isBlocked ? 'Unblock User' : 'Block User'}
                          >
                            {user.isBlocked ? (
                              <UserCheck size={16} />
                            ) : (
                              <UserX size={16} />
                            )}
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
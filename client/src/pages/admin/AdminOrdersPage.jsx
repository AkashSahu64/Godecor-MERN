import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Search, X, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import { fetchAllOrders, updateOrderStatus } from '../../redux/slices/orderSlice';
import { openModal, closeModal } from '../../redux/slices/uiSlice';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const OrderStatusBadge = ({ status }) => {
  let bgColor = '';
  let textColor = '';
  
  switch (status) {
    case 'pending':
      bgColor = 'bg-yellow-500/20';
      textColor = 'text-yellow-500';
      break;
    case 'shipped':
      bgColor = 'bg-blue-500/20';
      textColor = 'text-blue-500';
      break;
    case 'delivered':
      bgColor = 'bg-green-500/20';
      textColor = 'text-green-500';
      break;
    default:
      bgColor = 'bg-gray-500/20';
      textColor = 'text-gray-500';
  }
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const AdminOrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc',
  });
  
  // Fetch all orders
  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);
  
  // Filter and sort orders
  useEffect(() => {
    let filtered = [...orders];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.includes(searchTerm) ||
          order.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let valueA, valueB;
        
        // Handle nested properties
        if (sortConfig.key === 'user.name') {
          valueA = a.user.name;
          valueB = b.user.name;
        } else {
          valueA = a[sortConfig.key];
          valueB = b[sortConfig.key];
        }
        
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
    
    setFilteredOrders(filtered);
  }, [searchTerm, orders, sortConfig]);
  
  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleViewOrderDetails = (order) => {
    dispatch(
      openModal({
        type: 'side',
        content: renderOrderDetails(order),
      })
    );
  };
  
  const handleUpdateStatus = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };
  
  const renderOrderDetails = (order) => (
    <div className="h-full flex flex-col">
      <div className="border-b border-dark-700 pb-4">
        <h2 className="text-xl font-semibold mb-1">Order Details</h2>
        <p className="text-gray-400 text-sm mb-2">
          Placed on {formatDate(order.createdAt)}
        </p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-400">Order ID:</span>
          <span className="font-mono text-sm">#{order.id}</span>
        </div>
      </div>
      
      <div className="py-4 border-b border-dark-700">
        <h3 className="text-sm font-medium mb-3">Customer Information</h3>
        <div className="text-sm">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Name:</span>
            <span>{order.user.name}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">Shipping Address:</span>
            <span className="text-right">{order.shippingAddress.address}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Phone:</span>
            <span>{order.shippingAddress.phone}</span>
          </div>
        </div>
      </div>
      
      <div className="py-4 border-b border-dark-700">
        <h3 className="text-sm font-medium mb-3">Order Status</h3>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-400 text-sm">Current Status:</span>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="space-y-2">
          <button
            onClick={() => handleUpdateStatus(order.id, 'pending')}
            className={`w-full py-2 rounded-lg text-sm ${
              order.status === 'pending'
                ? 'bg-yellow-500/20 text-yellow-500'
                : 'bg-dark-700 hover:bg-dark-600 text-gray-300'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => handleUpdateStatus(order.id, 'shipped')}
            className={`w-full py-2 rounded-lg text-sm ${
              order.status === 'shipped'
                ? 'bg-blue-500/20 text-blue-500'
                : 'bg-dark-700 hover:bg-dark-600 text-gray-300'
            }`}
          >
            Shipped
          </button>
          <button
            onClick={() => handleUpdateStatus(order.id, 'delivered')}
            className={`w-full py-2 rounded-lg text-sm ${
              order.status === 'delivered'
                ? 'bg-green-500/20 text-green-500'
                : 'bg-dark-700 hover:bg-dark-600 text-gray-300'
            }`}
          >
            Delivered
          </button>
        </div>
      </div>
      
      <div className="py-4 border-b border-dark-700 overflow-y-auto flex-grow">
        <h3 className="text-sm font-medium mb-3">Order Items</h3>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex">
              <div className="w-16 h-16 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-400">
                    Qty: {item.quantity}
                  </span>
                  <span className="text-sm">${item.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-auto py-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Subtotal:</span>
            <span>
              ${(order.totalAmount - order.totalAmount * 0.1).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Tax (10%):</span>
            <span>${(order.totalAmount * 0.1).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Shipping:</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between font-semibold pt-2 border-t border-dark-700">
            <span>Total:</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
        
        <button
          onClick={() => dispatch(closeModal())}
          className="w-full mt-6 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold mb-1">Orders</h1>
          <p className="text-gray-400">Manage customer orders</p>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search by order ID or customer..."
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
      
      {loading && !orders.length ? (
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
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center">
                      Order ID
                      {sortConfig.key === 'id' && (
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
                    onClick={() => handleSort('user.name')}
                  >
                    <div className="flex items-center">
                      Customer
                      {sortConfig.key === 'user.name' && (
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
                    onClick={() => handleSort('totalAmount')}
                  >
                    <div className="flex items-center">
                      Total
                      {sortConfig.key === 'totalAmount' && (
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
                      Date
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
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {sortConfig.key === 'status' && (
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
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-4 text-center text-gray-400">
                      {searchTerm
                        ? 'No orders found matching your search'
                        : 'No orders available'}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-dark-700/50"
                    >
                      <td className="py-4 px-6 font-mono">#{order.id}</td>
                      <td className="py-4 px-6">{order.user.name}</td>
                      <td className="py-4 px-6">${order.totalAmount.toFixed(2)}</td>
                      <td className="py-4 px-6">{formatDate(order.createdAt)}</td>
                      <td className="py-4 px-6">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleViewOrderDetails(order)}
                          className="p-2 text-gray-400 hover:text-white transition-colors"
                          title="View Order Details"
                        >
                          <Eye size={16} />
                        </button>
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

export default AdminOrdersPage;
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { fetchUserOrders } from '../redux/slices/orderSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';

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

const OrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userOrders, loading } = useSelector((state) => state.orders);
  
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`);
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
          <h1 className="text-3xl font-display font-bold mb-2">My Orders</h1>
          <p className="text-gray-400">
            {userOrders.length > 0
              ? `You have ${userOrders.length} order${userOrders.length > 1 ? 's' : ''}`
              : 'You have no orders yet'}
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : userOrders.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="flex justify-center mb-6">
              <Package size={64} className="text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No orders found</h2>
            <p className="text-gray-400 mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link to="/products" className="btn-primary inline-block">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => handleOrderClick(order.id)}
                className="glass-card rounded-xl overflow-hidden cursor-pointer hover:bg-dark-700/50 transition-colors"
              >
                <div className="p-6 border-b border-dark-700">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Order ID</p>
                      <p className="font-mono text-sm">#{order.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Placed On</p>
                      <p className="font-medium">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Total Amount</p>
                      <p className="font-medium">₹{order.totalAmount.toFixed(2)}</p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
                
                <div className="divide-y divide-dark-700">
                  {order.items.map((item) => (
                    <div key={item.id} className="p-6 flex items-center">
                      <div className="w-20 h-20 rounded-lg overflow-hidden mr-6">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{item.name}</h3>
                        <p className="text-gray-400 text-sm">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-primary-400 font-medium mt-1">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OrdersPage;
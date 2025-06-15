import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { fetchAllOrders } from '../../redux/slices/orderSlice';
import { fetchProducts } from '../../redux/slices/productSlice';
import { fetchUsers } from '../../redux/slices/userSlice';

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  
  const { orders } = useSelector((state) => state.orders);
  const { products } = useSelector((state) => state.products);
  const { users } = useSelector((state) => state.users);
  
  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchProducts({}));
    dispatch(fetchUsers());
  }, [dispatch]);
  
  // Calculate total revenue
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  
  // Count recent orders (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentOrders = orders.filter(
    (order) => new Date(order.createdAt) > thirtyDaysAgo
  );
  
  // Count orders by status
  const pendingOrders = orders.filter((order) => order.status === 'pending').length;
  const shippedOrders = orders.filter((order) => order.status === 'shipped').length;
  const deliveredOrders = orders.filter((order) => order.status === 'delivered').length;
  
  const statsCards = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: <DollarSign size={24} className="text-white" />,
      iconBg: 'bg-green-500',
      change: '+12.5%',
      positive: true,
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: <Package size={24} className="text-white" />,
      iconBg: 'bg-blue-500',
      change: '+8.2%',
      positive: true,
    },
    {
      title: 'Total Products',
      value: products.length,
      icon: <ShoppingBag size={24} className="text-white" />,
      iconBg: 'bg-purple-500',
      change: '+5.0%',
      positive: true,
    },
    {
      title: 'Total Customers',
      value: users.length,
      icon: <Users size={24} className="text-white" />,
      iconBg: 'bg-orange-500',
      change: '+15.3%',
      positive: true,
    },
  ];
  
  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome to your admin dashboard</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="glass-card p-6 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <h3 className="text-2xl font-semibold mt-1">{stat.value}</h3>
              </div>
              <div className={`${stat.iconBg} p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span
                className={`${
                  stat.positive ? 'text-green-500' : 'text-red-500'
                } flex items-center`}
              >
                <TrendingUp size={14} className="mr-1" />
                {stat.change}
              </span>
              <span className="text-gray-400 ml-2">vs. last month</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Order Status */}
        <motion.div
          className="glass-card p-6 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-lg font-semibold mb-4">Order Status</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">Pending</span>
                <span className="text-sm">{pendingOrders}</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{
                    width: `${(pendingOrders / orders.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">Shipped</span>
                <span className="text-sm">{shippedOrders}</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${(shippedOrders / orders.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-400">Delivered</span>
                <span className="text-sm">{deliveredOrders}</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${(deliveredOrders / orders.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Recent Orders */}
        <motion.div
          className="glass-card p-6 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left text-xs text-gray-400 uppercase pb-2">Order ID</th>
                  <th className="text-left text-xs text-gray-400 uppercase pb-2">Customer</th>
                  <th className="text-left text-xs text-gray-400 uppercase pb-2">Amount</th>
                  <th className="text-left text-xs text-gray-400 uppercase pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {recentOrders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 text-sm font-mono">#{order.id}</td>
                    <td className="py-3 text-sm">{order.user.name}</td>
                    <td className="py-3 text-sm">${order.totalAmount.toFixed(2)}</td>
                    <td className="py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : order.status === 'shipped'
                            ? 'bg-blue-500/20 text-blue-500'
                            : 'bg-green-500/20 text-green-500'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-gray-400">
                      No recent orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      
      {/* Stock Alerts */}
      <motion.div
        className="glass-card p-6 rounded-xl mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Low Stock Alerts</h2>
          <span className="bg-red-500/20 text-red-500 text-xs px-2 py-1 rounded-full">
            {products.filter((p) => p.countInStock <= 5).length} Products
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase">
                <th className="pb-2">Product</th>
                <th className="pb-2">ID</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Price</th>
                <th className="pb-2">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {products
                .filter((p) => p.countInStock <= 5)
                .slice(0, 5)
                .map((product) => (
                  <tr key={product.id}>
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm font-mono text-gray-400">
                      #{product.id}
                    </td>
                    <td className="py-3 text-sm capitalize">{product.category}</td>
                    <td className="py-3 text-sm">${product.price.toFixed(2)}</td>
                    <td className="py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          product.countInStock === 0
                            ? 'bg-red-500/20 text-red-500'
                            : product.countInStock <= 3
                            ? 'bg-orange-500/20 text-orange-500'
                            : 'bg-yellow-500/20 text-yellow-500'
                        }`}
                      >
                        {product.countInStock} left
                      </span>
                    </td>
                  </tr>
                ))}
              {products.filter((p) => p.countInStock <= 5).length === 0 && (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-400">
                    No low stock products
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
      
      {/* Activity Log */}
      <motion.div
        className="glass-card p-6 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {/* This would be real activity data in a production app */}
          {[
            {
              action: 'New order received',
              time: '5 minutes ago',
              icon: <Package size={16} />,
              iconBg: 'bg-blue-500',
            },
            {
              action: 'User John Doe registered',
              time: '2 hours ago',
              icon: <Users size={16} />,
              iconBg: 'bg-green-500',
            },
            {
              action: 'Product "Japanese Bonsai" updated',
              time: '3 hours ago',
              icon: <ShoppingBag size={16} />,
              iconBg: 'bg-purple-500',
            },
            {
              action: 'Order #2 status changed to "shipped"',
              time: '5 hours ago',
              icon: <Package size={16} />,
              iconBg: 'bg-yellow-500',
            },
          ].map((activity, index) => (
            <div key={index} className="flex">
              <div className="mr-4 mt-1">
                <div
                  className={`${activity.iconBg} p-2 rounded-full flex items-center justify-center text-white`}
                >
                  {activity.icon}
                </div>
              </div>
              <div>
                <p className="text-white">{activity.action}</p>
                <p className="text-gray-400 text-sm flex items-center">
                  <Clock size={12} className="mr-1" />
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboardPage;
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { fetchAllOrders } from '../../redux/slices/orderSlice';
import { fetchProducts } from '../../redux/slices/productSlice';
import { fetchUsers } from '../../redux/slices/userSlice';
import { fetchCategories } from '../../redux/slices/categorySlice';

const AdminAnalyticsPage = () => {
  const dispatch = useDispatch();
  
  const { orders } = useSelector((state) => state.orders);
  const { products } = useSelector((state) => state.products);
  const { users } = useSelector((state) => state.users);
  const { categories } = useSelector((state) => state.categories);
  
  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchProducts({}));
    dispatch(fetchUsers());
    dispatch(fetchCategories());
  }, [dispatch]);
  
  // Prepare data for monthly sales chart
  const monthlySalesData = () => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    
    const monthlyData = Array(12).fill(0);
    
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const month = date.getMonth();
      monthlyData[month] += order.totalAmount;
    });
    
    return months.map((month, index) => ({
      name: month,
      amount: monthlyData[index].toFixed(2),
    }));
  };
  
  // Prepare data for category distribution chart
  const categoryDistribution = () => {
    const categoryMap = {};
    
    // Initialize with all categories
    categories.forEach((category) => {
      categoryMap[category.slug] = 0;
    });
    
    // Count products in each category
    products.forEach((product) => {
      if (categoryMap[product.category] !== undefined) {
        categoryMap[product.category]++;
      }
    });
    
    // Convert to array
    return Object.entries(categoryMap).map(([category, count]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: count,
    }));
  };
  
  // Prepare data for order status chart
  const orderStatusData = () => {
    const statusCounts = {
      pending: 0,
      shipped: 0,
      delivered: 0,
    };
    
    orders.forEach((order) => {
      statusCounts[order.status]++;
    });
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    }));
  };
  
  // Colors for charts
  const COLORS = ['#22c55e', '#2da788', '#d9821f', '#833a17'];
  
  // Custom tooltip for area chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-dark-600">
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-sm text-primary-400">
            ${parseFloat(payload[0].value).toFixed(2)}
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold mb-2">Analytics</h1>
        <p className="text-gray-400">Track your business performance with data insights</p>
      </div>
      
      {/* Sales Overview */}
      <motion.div
        className="glass-card rounded-xl overflow-hidden mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6 border-b border-dark-700">
          <div className="flex items-center">
            <LineChartIcon size={20} className="text-primary-400 mr-2" />
            <h2 className="text-lg font-semibold">Monthly Sales</h2>
          </div>
        </div>
        <div className="p-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlySalesData()}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#22c55e"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="#22c55e"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2b3137" />
              <XAxis
                dataKey="name"
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af' }}
              />
              <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#22c55e"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Category Distribution */}
        <motion.div
          className="glass-card rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="p-6 border-b border-dark-700">
            <div className="flex items-center">
              <PieChartIcon size={20} className="text-primary-400 mr-2" />
              <h2 className="text-lg font-semibold">Products by Category</h2>
            </div>
          </div>
          <div className="p-4 h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution()}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {categoryDistribution().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* Order Status */}
        <motion.div
          className="glass-card rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-6 border-b border-dark-700">
            <div className="flex items-center">
              <BarChartIcon size={20} className="text-primary-400 mr-2" />
              <h2 className="text-lg font-semibold">Order Status</h2>
            </div>
          </div>
          <div className="p-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={orderStatusData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2b3137" />
                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af' }}
                />
                <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1d21',
                    border: '1px solid #2b3137',
                  }}
                />
                <Bar dataKey="value">
                  {orderStatusData().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
      
      {/* Key Stats */}
      <motion.div
        className="glass-card rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="p-6 border-b border-dark-700">
          <div className="flex items-center">
            <TrendingUp size={20} className="text-primary-400 mr-2" />
            <h2 className="text-lg font-semibold">Key Performance Metrics</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-dark-700">
          {[
            {
              label: 'Total Revenue',
              value: `$${orders
                .reduce((sum, order) => sum + order.totalAmount, 0)
                .toFixed(2)}`,
            },
            {
              label: 'Average Order Value',
              value: `$${
                orders.length
                  ? (
                      orders.reduce((sum, order) => sum + order.totalAmount, 0) /
                      orders.length
                    ).toFixed(2)
                  : '0.00'
              }`,
            },
            {
              label: 'Total Orders',
              value: orders.length,
            },
            {
              label: 'Total Customers',
              value: users.filter((user) => user.role === 'user').length,
            },
          ].map((stat, index) => (
            <div key={index} className="p-6 text-center">
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAnalyticsPage;
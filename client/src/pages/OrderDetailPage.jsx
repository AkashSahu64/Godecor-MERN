import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, CheckCircle } from 'lucide-react';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userOrders } = useSelector((state) => state.orders);
  const order = userOrders.find(o => o.id === id);

  useEffect(() => {
    if (!order) {
      navigate('/orders');
    }
  }, [order, navigate]);

  if (!order) return null;

  const getStatusStep = (status) => {
    switch (status) {
      case 'delivered': return 3;
      case 'shipped': return 2;
      case 'pending': return 1;
      default: return 0;
    }
  };

  const currentStep = getStatusStep(order.status);

  const steps = [
    { icon: Package, label: 'Order Placed', date: new Date(order.createdAt).toLocaleDateString() },
    { icon: Truck, label: 'Shipped', date: 'Estimated 2-3 days' },
    { icon: CheckCircle, label: 'Delivered', date: 'Pending' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-16"
    >
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Orders
        </button>

        <div className="glass-card rounded-xl overflow-hidden mb-8">
          <div className="p-6 border-b border-dark-700">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold mb-1">Order #{order.id}</h1>
                <p className="text-gray-400">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Total Amount</p>
                <p className="text-xl font-semibold">₹{order.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="relative flex justify-between mb-8">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-dark-600 -translate-y-1/2"></div>
              {steps.map((Step, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col items-center ${
                    index < currentStep ? 'text-primary-400' : 'text-gray-500'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index < currentStep ? 'bg-primary-500' : 'bg-dark-600'
                  }`}>
                    <Step.icon size={20} />
                  </div>
                  <p className="mt-2 font-medium">{Step.label}</p>
                  <p className="text-sm">{Step.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="p-6 border-b border-dark-700">
                <h2 className="text-xl font-semibold">Order Items</h2>
              </div>
              <div className="divide-y divide-dark-700">
                {order.items.map((item) => (
                  <div key={item.id} className="p-6 flex items-center">
                    <div className="w-24 h-24 rounded-lg overflow-hidden mr-6">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-1">{item.name}</h3>
                      <p className="text-gray-400">Quantity: {item.quantity}</p>
                      <p className="text-primary-400 font-medium mt-2">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="glass-card rounded-xl overflow-hidden sticky top-24">
              <div className="p-6 border-b border-dark-700">
                <h2 className="text-xl font-semibold">Delivery Details</h2>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <p className="text-gray-400">{order.shippingAddress.name}</p>
                  <p className="text-gray-400">{order.shippingAddress.address}</p>
                  <p className="text-gray-400">{order.shippingAddress.phone}</p>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-2">Payment Method</h3>
                  <p className="text-gray-400 capitalize">{order.paymentMethod}</p>
                </div>

                <div className="border-t border-dark-700 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Subtotal</span>
                    <span>₹{(order.totalAmount - order.totalAmount * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Tax (10%)</span>
                    <span>₹{(order.totalAmount * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-dark-700 mt-2">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderDetailPage;
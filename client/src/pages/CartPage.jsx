import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Trash, Minus, Plus, ShoppingCart, ChevronRight, ArrowLeft } from 'lucide-react';
import { fetchCart, updateCartItem, removeFromCart } from '../redux/slices/cartSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { items, total, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  // Fetch cart data
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);
  
  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartItem({ productId, quantity }));
  };
  
  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };
  
  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login', { state: { from: '/checkout' } });
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }
  
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
          <h1 className="text-3xl font-display font-bold mb-2">Your Cart</h1>
          <p className="text-gray-400">
            {items.length > 0
              ? `You have ${items.length} item${items.length > 1 ? 's' : ''} in your cart`
              : 'Your cart is empty'}
          </p>
        </div>
        
        {items.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="flex justify-center mb-6">
              <ShoppingCart size={64} className="text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">
              Looks like you haven't added any plants to your cart yet.
            </p>
            <Link to="/products" className="btn-primary inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="glass-card rounded-xl overflow-hidden">
                <div className="p-6 border-b border-dark-700">
                  <h2 className="text-xl font-semibold">Cart Items</h2>
                </div>
                <ul className="divide-y divide-dark-700">
                  {items.map((item) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-6"
                    >
                      <div className="flex items-center">
                        <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg mr-4">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-white truncate">
                            {item.name}
                          </h3>
                          <p className="text-gray-400 text-sm">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 bg-dark-700 flex items-center justify-center rounded-l-lg"
                            >
                              <Minus size={14} />
                            </button>
                            <div className="w-10 h-8 bg-dark-600 flex items-center justify-center text-white">
                              {item.quantity}
                            </div>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-dark-700 flex items-center justify-center rounded-r-lg"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
                <div className="p-6 border-t border-dark-700">
                  <Link
                    to="/products"
                    className="text-primary-400 hover:underline flex items-center"
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-xl overflow-hidden sticky top-24">
                <div className="p-6 border-b border-dark-700">
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tax</span>
                      <span>${(total * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-dark-700 pt-4 mt-4">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${(total + total * 0.1).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <button
                      onClick={handleCheckout}
                      className="btn-primary w-full flex items-center justify-center"
                    >
                      Proceed to Checkout
                      <ChevronRight size={16} className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CartPage;
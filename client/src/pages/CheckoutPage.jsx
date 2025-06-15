import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { createOrder } from '../redux/slices/orderSlice';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { items, total } = useSelector((state) => state.cart);
  const { loading } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    paymentMethod: 'razorpay',
  });
  
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateAddressForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleAddressSubmit = (e) => {
    e.preventDefault();
    
    if (validateAddressForm()) {
      setStep(2);
    }
  };
  
  const handlePayment = () => {
    const orderData = {
      user: {
        id: user.id,
        name: user.name,
      },
      items: items,
      shippingAddress: {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      },
      paymentMethod: formData.paymentMethod,
      paymentId: 'pay_' + Math.random().toString(36).substring(2, 15),
      totalAmount: total + total * 0.1,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    dispatch(createOrder(orderData))
      .unwrap()
      .then(() => {
        navigate('/orders');
      })
      .catch((error) => {
        console.error('Order creation failed', error);
      });
  };
  
  const renderAddressForm = () => (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-6 border-b border-dark-700">
        <h2 className="text-xl font-semibold">Shipping Address</h2>
      </div>
      <form onSubmit={handleAddressSubmit} className="p-6">
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
              className={`input w-full ${errors.name ? 'border-red-500' : ''}`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
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
              className={`input w-full ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="123-456-7890"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Full Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={4}
              className={`input w-full ${errors.address ? 'border-red-500' : ''}`}
              placeholder="Street address, city, state, zip code"
            ></textarea>
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
          </div>
        </div>
        
        <div className="mt-8">
          <button type="submit" className="btn-primary w-full">
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
  
  const renderPaymentForm = () => (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-6 border-b border-dark-700">
        <h2 className="text-xl font-semibold">Payment Method</h2>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          <div className="form-group">
            <label className="form-label">Select Payment Method</label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="razorpay"
                  name="paymentMethod"
                  value="razorpay"
                  checked={formData.paymentMethod === 'razorpay'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-600 bg-dark-700"
                />
                <label htmlFor="razorpay" className="ml-3 block text-white">
                  Razorpay (Credit/Debit Card, UPI, etc.)
                </label>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 border-dark-600 bg-dark-700/50">
            <p className="text-sm text-gray-300 mb-2">
              This is a demo checkout page. No real payment will be processed.
            </p>
            <p className="text-sm text-gray-300">
              In a real application, this would integrate with Razorpay's payment gateway.
            </p>
          </div>
          
          <div className="border-t border-dark-700 pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal:</span>
                <span>
                  ${(total - total * 0.1).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tax (10%):</span>
                <span>${(total * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t border-dark-700">
                <span>Total:</span>
                <span>${(total + total * 0.1).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="btn-outline sm:w-1/2"
          >
            Back to Shipping
          </button>
          <button
            type="button"
            onClick={handlePayment}
            className="btn-primary sm:w-1/2"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
  
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
          <h1 className="text-3xl font-display font-bold mb-2">Checkout</h1>
          <p className="text-gray-400">Complete your order</p>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                step >= 1 ? 'border-primary-500 bg-primary-500/20' : 'border-dark-500'
              }`}
            >
              1
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary-500' : 'bg-dark-600'}`}></div>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                step >= 2 ? 'border-primary-500 bg-primary-500/20' : 'border-dark-500'
              }`}
            >
              2
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <div className="text-center w-10">
              <span className={step >= 1 ? 'text-primary-400' : 'text-gray-500'}>Shipping</span>
            </div>
            <div className="text-center w-10">
              <span className={step >= 2 ? 'text-primary-400' : 'text-gray-500'}>Payment</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 ? renderAddressForm() : renderPaymentForm()}
          </div>
          
          <div className="lg:col-span-1">
            <div className="glass-card rounded-xl overflow-hidden sticky top-24">
              <div className="p-6 border-b border-dark-700">
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </div>
              <div className="p-6">
                <ul className="divide-y divide-dark-700 mb-6">
                  {items.map((item) => (
                    <li key={item.id} className="py-4 flex">
                      <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{item.name}</h3>
                        <p className="text-gray-400 text-sm">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tax (10%)</span>
                    <span>${(total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-dark-700 pt-4 mt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${(total + total * 0.1).toFixed(2)}</span>
                    </div>
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

export default CheckoutPage;
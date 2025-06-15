import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Minus, Plus, ArrowLeft } from 'lucide-react';
import { fetchProductById } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ProductCard from '../components/products/ProductCard';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [quantity, setQuantity] = useState(1);
  
  const { currentProduct, loading, error, products } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  
  const isInWishlist = wishlistItems.some((item) => item.id === id);
  
  // Fetch product details
  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [id, dispatch]);
  
  // Get related products (same category)
  const relatedProducts = products.filter(
    (product) => product.category === currentProduct?.category && product.id !== id
  ).slice(0, 3);
  
  const handleAddToCart = () => {
    if (currentProduct) {
      dispatch(addToCart({ ...currentProduct, quantity }));
    }
  };
  
  const handleToggleWishlist = () => {
    if (isAuthenticated) {
      if (isInWishlist) {
        dispatch(removeFromWishlist(id));
      } else {
        dispatch(addToWishlist(id));
      }
    } else {
      // Redirect to login or show login modal
      // This would be implemented in a real app
      alert('Please log in to add items to your wishlist');
    }
  };
  
  const incrementQuantity = () => {
    if (quantity < (currentProduct?.countInStock || 10)) {
      setQuantity(quantity + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error || !currentProduct) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="glass-card p-12 text-center">
            <h2 className="text-xl font-semibold mb-2">Product not found</h2>
            <p className="text-gray-400 mb-4">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="btn-primary"
            >
              Browse Products
            </button>
          </div>
        </div>
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
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Products
        </button>
        
        <div className="glass-card rounded-xl overflow-hidden mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden">
              <img
                src={currentProduct.imageUrl}
                alt={currentProduct.name}
                className="w-full h-full object-cover"
              />
              {currentProduct.featured && (
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Featured
                  </span>
                </div>
              )}
            </div>
            
            {/* Product Details */}
            <div className="p-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-display font-bold mb-2"
              >
                {currentProduct.name}
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center mb-4"
              >
                <div className="flex items-center mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < Math.floor(currentProduct.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-400">
                  ({currentProduct.numReviews} reviews)
                </span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <span className="text-3xl font-semibold text-white">
                  ${currentProduct.price.toFixed(2)}
                </span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="border-t border-b border-dark-600 py-6 mb-6"
              >
                <p className="text-gray-300">{currentProduct.description}</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
              >
                <div className="flex items-center mb-4">
                  <span className="text-gray-400 mr-4">Quantity:</span>
                  <div className="flex items-center">
                    <button
                      onClick={decrementQuantity}
                      className="w-10 h-10 bg-dark-700 flex items-center justify-center rounded-l-lg"
                    >
                      <Minus size={16} />
                    </button>
                    <div className="w-12 h-10 bg-dark-600 flex items-center justify-center text-white">
                      {quantity}
                    </div>
                    <button
                      onClick={incrementQuantity}
                      className="w-10 h-10 bg-dark-700 flex items-center justify-center rounded-r-lg"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="btn-primary flex-1 flex items-center justify-center"
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Add to Cart
                  </button>
                  
                  <button
                    onClick={handleToggleWishlist}
                    className="btn-outline flex items-center justify-center w-full sm:w-auto px-4"
                  >
                    <Heart
                      size={18}
                      className={`${
                        isInWishlist ? 'fill-red-500 text-red-500' : ''
                      } mr-2`}
                    />
                    {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-gray-400"
              >
                <div className="flex items-start mb-2">
                  <span className="w-24 flex-shrink-0">Category:</span>
                  <span className="capitalize">{currentProduct.category}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-24 flex-shrink-0">Availability:</span>
                  <span>
                    {currentProduct.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-display font-semibold mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;
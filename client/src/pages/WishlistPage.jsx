import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Heart, Trash, ShoppingCart } from 'lucide-react';
import { fetchWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.wishlist);
  
  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);
  
  const handleRemoveFromWishlist = (productId) => {
    dispatch(removeFromWishlist(productId));
  };
  
  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
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
          <h1 className="text-3xl font-display font-bold mb-2">My Wishlist</h1>
          <p className="text-gray-400">
            {items.length > 0
              ? `You have ${items.length} item${items.length > 1 ? 's' : ''} in your wishlist`
              : 'Your wishlist is empty'}
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : items.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="flex justify-center mb-6">
              <Heart size={64} className="text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-400 mb-6">
              Looks like you haven't added any plants to your wishlist yet.
            </p>
            <Link to="/products" className="btn-primary inline-block">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-4 rounded-xl flex flex-col sm:flex-row items-center"
              >
                <div className="w-full sm:w-24 h-24 rounded-lg overflow-hidden mb-4 sm:mb-0 sm:mr-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <Link
                    to={`/products/${item.id}`}
                    className="text-lg font-medium text-white hover:text-primary-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-gray-400 text-sm line-clamp-1 mb-2">{item.description}</p>
                  <p className="text-primary-400 font-semibold">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex mt-4 sm:mt-0">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center mr-2"
                  >
                    <ShoppingCart size={16} className="mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="bg-dark-700 hover:bg-dark-600 text-gray-300 hover:text-red-400 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WishlistPage;
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { addToCart } from '../../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';
import PropTypes from 'prop-types';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  
  const [isHovered, setIsHovered] = useState(false);
  
  const isInWishlist = wishlistItems.some((item) => item.id === product.id);
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch(addToCart({ ...product, quantity: 1 }));
  };
  
  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAuthenticated) {
      if (isInWishlist) {
        dispatch(removeFromWishlist(product.id));
      } else {
        dispatch(addToWishlist(product.id));
      }
    } else {
      // Redirect to login or show login modal
      // This would be implemented in a real app
      alert('Please log in to add items to your wishlist');
    }
  };
  
  const itemVariants = {
   // hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };
  
  return (
    <motion.div
      variants={itemVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="glass-card rounded-xl overflow-hidden transition-all duration-300 h-full flex flex-col"
    >
      <Link to={`/products/${product.id}`} className="block flex-grow">
        <div className="relative overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-64 object-cover object-center transition-transform duration-500"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
          <div className="absolute top-0 left-0 p-2">
            {product.featured && (
              <span className="bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Featured
              </span>
            )}
          </div>
          
          {/* Wishlist button */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 p-2 bg-dark-800/80 backdrop-blur-sm rounded-full text-white hover:bg-dark-700 transition-colors"
          >
            <Heart
              size={18}
              className={isInWishlist ? 'fill-red-500 text-red-500' : ''}
            />
          </button>
          
          {/* Quick add to cart - appears on hover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-900/90 to-transparent p-4"
          >
            <button
              onClick={handleAddToCart}
              className="w-full py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          </motion.div>
        </div>
        
        <div className="p-4 flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
              {product.name}
            </h3>
          </div>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center mr-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-400'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400">({product.numReviews})</span>
          </div>
          
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
          
          <div className="mt-auto">
            <span className="text-lg font-semibold text-white">₹{product.price.toFixed(2)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    imageUrl: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    numReviews: PropTypes.number.isRequired,
    featured: PropTypes.bool,
  }).isRequired,
};

export default ProductCard;
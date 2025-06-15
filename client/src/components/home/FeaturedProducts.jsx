import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchFeaturedProducts } from '../../redux/slices/productSlice';
import ProductCard from '../products/ProductCard';
import LoadingSpinner from '../ui/LoadingSpinner';

const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const { featuredProducts, loading } = useSelector((state) => state.products);
  
  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  return (
    <section className="py-16 bg-dark-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl lg:text-4xl font-display font-semibold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Featured <span className="text-primary-400">Plants</span>
          </motion.h2>
          <motion.p
            className="text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Discover our handpicked selection of premium artificial plants that will transform your space
          </motion.p>
        </div>
        
        {loading ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
        
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="btn-outline rounded-full px-8 py-3 inline-block"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
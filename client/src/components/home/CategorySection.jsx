import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const CategorySection = () => {
  const { categories } = useSelector((state) => state.categories);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };
  
  return (
    <section className="py-16 bg-gradient-to-b from-dark-900 to-dark-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl lg:text-4xl font-display font-semibold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Shop by <span className="text-primary-400">Category</span>
          </motion.h2>
          <motion.p
            className="text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Browse our collection by category to find the perfect artificial plants for your space
          </motion.p>
        </div>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          variants={containerVariants}
          //initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              className="relative overflow-hidden rounded-xl shadow-lg aspect-[3/4]"
            >
              <Link to={`/products?category=${category.slug}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 to-dark-900/30 z-10"></div>
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-display font-semibold text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {category.description}
                  </p>
                  <div className="glass inline-block px-6 py-2 rounded-full text-white font-medium text-sm">
                    Shop Now
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategorySection;
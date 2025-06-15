import { motion } from 'framer-motion';
import HeroSection from '../components/home/HeroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CategorySection from '../components/home/CategorySection';

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      
      {/* Features section */}
      <section className="py-16 bg-gradient-to-b from-dark-800 to-dark-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl lg:text-4xl font-display font-semibold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Why Choose <span className="text-primary-400">Godecor</span>
            </motion.h2>
            <motion.p
              className="text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Experience the beauty of nature without the maintenance
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Ultra-Realistic',
                description: 'Our plants are crafted to look virtually indistinguishable from real ones',
                icon: '🌿',
              },
              {
                title: 'Zero Maintenance',
                description: 'No watering, pruning, or special lighting required',
                icon: '✨',
              },
              {
                title: 'Long-Lasting',
                description: 'Durable materials ensure your plants stay beautiful for years',
                icon: '⏱️',
              },
              {
                title: 'Premium Quality',
                description: 'Handcrafted with attention to detail and high-quality materials',
                icon: '🏆',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="glass-card text-center p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/776656/pexels-photo-776656.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
            filter: "brightness(0.3)"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900/90 to-dark-900/70"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <motion.h2
              className="text-3xl lg:text-4xl font-display font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Ready to Transform Your Space?
            </motion.h2>
            <motion.p
              className="text-lg text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Browse our collection of premium artificial plants and bring the beauty of nature into your home without the hassle of maintenance.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <a
                href="/products"
                className="btn-primary px-8 py-3 rounded-full inline-block"
              >
                Shop Now
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;
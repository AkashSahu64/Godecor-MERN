import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/5699665/pexels-photo-5699665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
            filter: "brightness(0.4)"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/60 to-dark-900"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          {/* Hero Text Content */}
          <motion.div
            className="md:w-1/2 text-center md:text-left mb-10 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 text-white leading-tight">
              <span className="text-primary-400">Artificial Plants</span> That Look Real
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-lg">
              Transform your space with our premium collection of lifelike artificial plants. No watering, no maintenance, just beauty that lasts.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
              <Link
                to="/products"
                className="btn-primary px-8 py-3 rounded-full flex items-center justify-center"
              >
                Shop Now
                <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link
                to="/products"
                className="btn-outline px-8 py-3 rounded-full"
              >
                Explore Collection
              </Link>
            </div>
          </motion.div>
          
          {/* Hero Image/Animation */}
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              {/* Animated circle background */}
              <motion.div
                className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 blur-xl"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              ></motion.div>
              
              {/* Product image */}
              <img
                src="https://images.pexels.com/photos/1005058/pexels-photo-1005058.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Featured Plant"
                className="rounded-2xl shadow-2xl relative z-10 glass-card border border-white/10"
              />
              
              {/* Animated badges */}
              <motion.div
                className="glass-card absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-medium z-20"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Premium Quality
              </motion.div>
              
              <motion.div
                className="glass-card absolute bottom-4 right-4 px-4 py-2 rounded-full text-sm font-medium z-20"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                No Maintenance
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div className="glass-card rounded-xl p-12 max-w-lg text-center">
        <motion.h1
          className="text-8xl font-bold text-primary-400 mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          404
        </motion.h1>
        <h2 className="text-2xl font-display font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="btn-primary inline-flex items-center justify-center"
        >
          <Home size={18} className="mr-2" />
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingSpinner = () => {
  const { isLoading } = useSelector((state) => state.ui);
  
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative">
            <motion.div
              className="h-16 w-16 rounded-full border-4 border-t-4 border-primary-500 border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <motion.div
              className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-t-4 border-accent-500 border-t-transparent"
              animate={{ rotate: -180 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ opacity: 0.7 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingSpinner;
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';

const Modal = ({ isOpen, onClose, children, type = 'default' }) => {
  const modalRef = useRef(null);
  
  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
  
  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);
  
  const getModalStyles = () => {
    switch (type) {
      case 'side':
        return {
          overlay: {},
          content: {
            initial: { x: '100%', opacity: 1 },
            animate: { x: 0, opacity: 1 },
            exit: { x: '100%', opacity: 1 },
            className: 'fixed right-0 top-0 bottom-0 w-full sm:w-96 h-full',
          },
        };
      case 'bottom':
        return {
          overlay: {},
          content: {
            initial: { y: '100%', opacity: 1 },
            animate: { y: 0, opacity: 1 },
            exit: { y: '100%', opacity: 1 },
            className: 'fixed bottom-0 left-0 right-0 max-h-[90vh]',
          },
        };
      default:
        return {
          overlay: {},
          content: {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.95 },
            className: 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md',
          },
        };
    }
  };
  
  const modalStyles = getModalStyles();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            {...modalStyles.overlay}
          />
          
          <motion.div
            ref={modalRef}
            className={`z-50 glass-card overflow-auto ${modalStyles.content.className}`}
            initial={modalStyles.content.initial}
            animate={modalStyles.content.animate}
            exit={modalStyles.content.exit}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="relative">
              <button
                className="absolute right-4 top-4 text-gray-400 hover:text-white bg-dark-700 rounded-full p-2 z-10"
                onClick={onClose}
              >
                <X size={16} />
              </button>
              
              <div className="p-6">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['default', 'side', 'bottom']),
};

export default Modal;
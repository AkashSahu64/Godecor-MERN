import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { closeModal } from '../redux/slices/uiSlice';
import { fetchCart } from '../redux/slices/cartSlice';
import { fetchCategories } from '../redux/slices/categorySlice';

const UserLayout = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { modalOpen, modalContent, modalType } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Fetch categories for all users
    dispatch(fetchCategories());
    
    // Fetch cart if user is authenticated
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-dark-900 to-dark-700">
      <Header />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>
      <Footer />
      
      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <Modal
            isOpen={modalOpen}
            onClose={() => dispatch(closeModal())}
            type={modalType}
          >
            {modalContent}
          </Modal>
        )}
      </AnimatePresence>
      
      {/* Global loading spinner */}
      <LoadingSpinner />
    </div>
  );
};

export default UserLayout;
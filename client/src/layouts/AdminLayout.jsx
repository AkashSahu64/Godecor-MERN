import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { closeModal } from '../redux/slices/uiSlice';
import { fetchCategories } from '../redux/slices/categorySlice';
import { fetchAllOrders } from '../redux/slices/orderSlice';
import { fetchUsers } from '../redux/slices/userSlice';

const AdminLayout = () => {
  const { modalOpen, modalContent, modalType } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Fetch necessary data for admin dashboard
    dispatch(fetchCategories());
    dispatch(fetchAllOrders());
    dispatch(fetchUsers());
  }, [dispatch]);
  
  return (
    <div className="min-h-screen flex bg-dark-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-dark-800 to-dark-900 p-4">
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </main>
      </div>
      
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

export default AdminLayout;
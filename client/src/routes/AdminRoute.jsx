import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useSelector((state) => state.auth);
  const location = useLocation();
  
  // If auth is still loading, return null or a loading spinner
  if (loading) {
    return null;
  }
  
  // If not authenticated or not an admin, redirect to admin login
  if (!isAuthenticated || !isAdmin) {
    // Store the attempted URL to redirect back after login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  // If authenticated and admin, render the protected component
  return children;
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminRoute;
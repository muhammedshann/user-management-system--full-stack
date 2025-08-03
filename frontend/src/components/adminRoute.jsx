import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  const isAdmin = useSelector(state => state.auth.userInfo?.is_superuser)
  console.log('from adminRoute',isAdmin)

  if (!token || !isAdmin) return <Navigate to="/login/" replace />;

  return children;
};

export default AdminRoute;

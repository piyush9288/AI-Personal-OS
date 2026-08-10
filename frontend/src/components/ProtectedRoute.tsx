import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  return children ? children : <Outlet />;
}

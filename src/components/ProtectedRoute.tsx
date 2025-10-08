import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'manager' | 'cashier';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if requiredRole is specified
  if (requiredRole && user?.role !== 'admin') {
    // Admins can access everything, other roles have restrictions
    if (requiredRole === 'manager' && user?.role !== 'manager') {
      return <Navigate to="/" replace />;
    }
    if (requiredRole === 'cashier' && user?.role !== 'cashier' && user?.role !== 'manager') {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
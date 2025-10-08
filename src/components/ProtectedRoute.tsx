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
  if (requiredRole && user?.role) {
    // Admins can access everything
    if (user.role === 'admin') {
      return <>{children}</>;
    }
    
    // Managers can access manager and cashier areas
    if (requiredRole === 'manager' && user.role === 'manager') {
      return <>{children}</>;
    }
    
    // Cashiers can only access cashier areas
    if (requiredRole === 'cashier' && user.role === 'cashier') {
      return <>{children}</>;
    }
    
    // If we get here, the user doesn't have the required role
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
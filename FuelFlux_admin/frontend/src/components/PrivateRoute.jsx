import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  // Use a robust check for authentication (token in sessionStorage)
  const isAuthenticated = !!sessionStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/admin" replace />;
}

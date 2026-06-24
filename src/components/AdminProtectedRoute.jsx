import React, { useEffect, useState } from 'react';

const AdminProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdminRoot') === 'true';
    if (!isAdmin) {
      window.location.href = '/admin';
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) return null;

  return <>{children}</>;
};

export default AdminProtectedRoute;

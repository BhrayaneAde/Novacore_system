import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import LandingPage from '../pages/Landing/LandingPage';
import AuthPage from '../pages/Auth/AuthPage';
import Dashboard from '../pages/Dashboard/Dashboard';
import PermissionGuard from '../components/auth/PermissionGuard';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
    setIsLoading(false);
  }, [initializeAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
    setIsLoading(false);
  }, [initializeAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return children;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        } />
        <Route path="/app/*" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

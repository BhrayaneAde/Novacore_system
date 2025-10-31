import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import LandingPage from '../pages/Landing/LandingPage';
import AuthPage from '../pages/Auth/AuthPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/Auth/ResetPasswordPage';
import Dashboard from '../pages/Dashboard/Dashboard';
import NotFound from '../pages/NotFound';
import GoogleDrive from '../pages/GoogleDrive';
import GoogleDriveConfig from '../pages/GoogleDriveConfig';
import AutoRecruitment from '../pages/AutoRecruitment';
import PermissionGuard from '../components/auth/PermissionGuard';
import Loader from '../components/ui/Loader';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await initializeAuth();
      setIsLoading(false);
    };
    init();
  }, [initializeAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex flex-col items-center">
          <Loader size={48} />
          <p className="mt-4 text-gray-600 font-medium">Initialisation...</p>
        </div>
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
    const init = async () => {
      await initializeAuth();
      setIsLoading(false);
    };
    init();
  }, [initializeAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex flex-col items-center">
          <Loader size={48} />
          <p className="mt-4 text-gray-600 font-medium">Chargement...</p>
        </div>
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
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        } />
        <Route path="/reset-password" element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        } />
        <Route path="/app/*" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/google-drive" element={
          <ProtectedRoute>
            <GoogleDrive />
          </ProtectedRoute>
        } />
        <Route path="/google-drive/config" element={
          <ProtectedRoute>
            <GoogleDriveConfig />
          </ProtectedRoute>
        } />
        <Route path="/auto-recruitment" element={
          <ProtectedRoute>
            <AutoRecruitment />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

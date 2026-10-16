import { type FC, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MainLayout, AuthLayout, PublicLayout } from './components/layout/Layout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { CustomerDashboard } from './pages/customer/Dashboard';
import { CustomerCases } from './pages/customer/Cases';
import { CustomerVehicles } from './pages/customer/Vehicles';
import { CustomerPayments } from './pages/customer/Payments';
import { CustomerNotifications } from './pages/customer/Notifications';
import { ProviderDashboard } from './pages/provider/Dashboard';
import { ProviderJobs } from './pages/provider/Jobs';
import { ProviderProfile } from './pages/provider/Profile';
import { ProviderEarnings } from './pages/provider/Earnings';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminUsers } from './pages/admin/Users';
import { AdminProviders } from './pages/admin/Providers';
import { AdminServices } from './pages/admin/Services';
import { AdminAnalytics } from './pages/admin/Analytics';
import { LandingPage } from './pages/LandingPage';
import './index.css';

const ProtectedRoute: FC<{ children?: ReactNode; allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cases"
          element={
            <ProtectedRoute>
              <CustomerCases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <CustomerVehicles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <CustomerPayments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <CustomerNotifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/provider/dashboard"
          element={
            <ProtectedRoute allowedRoles={['PROVIDER', 'ADMIN']}>
              <ProviderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/jobs"
          element={
            <ProtectedRoute allowedRoles={['PROVIDER', 'ADMIN']}>
              <ProviderJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/profile"
          element={
            <ProtectedRoute allowedRoles={['PROVIDER', 'ADMIN']}>
              <ProviderProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/earnings"
          element={
            <ProtectedRoute allowedRoles={['PROVIDER', 'ADMIN']}>
              <ProviderEarnings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/providers"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminProviders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminServices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
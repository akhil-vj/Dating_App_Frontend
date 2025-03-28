import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import Header from './Header';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import ResetPasswordScreen from './ResetPasswordScreen';
import DiscoverScreen from './DiscoverScreen';
import ProfileCompletionScreen from './ProfileCompletionScreen';
import GenderPreferenceScreen from './GenderPreferenceScreen';
import SettingsScreen from './SettingsScreen';
import NotFoundScreen from './NotFoundScreen';
import { LoadingIndicator } from './LoadingIndicator';

// Protected route wrapper
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingIndicator />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
              <Route path="/reset-password" element={<ResetPasswordScreen />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <RequireAuth>
                  <DiscoverScreen />
                </RequireAuth>
              } />
              <Route path="/complete-profile" element={
                <RequireAuth>
                  <ProfileCompletionScreen />
                </RequireAuth>
              } />
              <Route path="/gender-preference" element={
                <RequireAuth>
                  <GenderPreferenceScreen />
                </RequireAuth>
              } />
              <Route path="/settings" element={
                <RequireAuth>
                  <SettingsScreen />
                </RequireAuth>
              } />
              
              {/* 404 route */}
              <Route path="*" element={<NotFoundScreen />} />
            </Routes>
          </main>
          {/* Footer could go here */}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

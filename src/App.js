import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import NotFoundScreen from './components/NotFoundScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import ResetPasswordScreen from './components/ResetPasswordScreen';
import ProfileCompletionScreen from './components/ProfileCompletionScreen';
import GenderPreferenceScreen from './components/GenderPreferenceScreen';
import { FullPageLoader } from './components/LoadingIndicator';

// Protected route component that checks authentication
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Show loading state while checking auth
  if (loading) {
    return <FullPageLoader />;
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Redirect to profile completion if needed
  if (!user.profileComplete && location.pathname !== '/complete-profile') {
    return <Navigate to="/complete-profile" state={{ from: location }} replace />;
  }
  
  // Redirect to gender preference selection if needed
  if (user.profileComplete && user.genderPreference === null && location.pathname !== '/gender-preference') {
    return <Navigate to="/gender-preference" state={{ from: location }} replace />;
  }
  
  // Render children if authenticated, profile is complete, and gender preference is set
  return children;
};

// Public route that redirects to main page if already authenticated
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Show loading state while checking auth
  if (loading) {
    return <FullPageLoader />;
  }
  
  // Redirect to appropriate screen if already authenticated
  if (user) {
    if (!user.profileComplete) {
      return <Navigate to="/complete-profile" replace />;
    } else if (user.genderPreference === null) {
      return <Navigate to="/gender-preference" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }
  
  // Render children if not authenticated
  return children;
};

// Profile completion route
const ProfileCompletionRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (user.profileComplete) {
    if (user.genderPreference === null) {
      return <Navigate to="/gender-preference" replace />;
    } 
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Gender preference route
const GenderPreferenceRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!user.profileComplete) return <Navigate to="/complete-profile" replace />;
  if (user.genderPreference !== null) return <Navigate to="/" replace />;
  
  return children;
};

function App() {
  // App component initialization code here

  // If you need location or recommendations data, move the logic here inside the component
  // For example:
  // const [recommendations, setRecommendations] = useState([]);
  // 
  // useEffect(() => {
  //   // Initialize app data
  //   const initializeApp = async () => {
  //     // Your initialization code here
  //   };
  //   
  //   initializeApp();
  // }, []);

  return (
    <Router>
      <Routes>
        {/* Public routes - accessible without authentication */}
        <Route path="/login" element={<PublicRoute><LoginScreen /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterScreen /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordScreen /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPasswordScreen /></PublicRoute>} />
        
        {/* Profile completion route - requires authentication but not complete profile */}
        <Route path="/complete-profile" element={
          <ProfileCompletionRoute><ProfileCompletionScreen /></ProfileCompletionRoute>
        } />
        
        {/* Gender preference route - requires authentication and complete profile */}
        <Route path="/gender-preference" element={
          <GenderPreferenceRoute><GenderPreferenceScreen /></GenderPreferenceRoute>
        } />
        
        {/* Protected routes - require authentication, complete profile, and gender preference */}
        <Route path="/" element={
          <ProtectedRoute>
            <div className="app-container">
              {/* Your main app content */}
              <h1 className="text-2xl font-bold text-center py-4">Malayali Match</h1>
              {/* Include main app components here */}
            </div>
          </ProtectedRoute>
        } />
        
        {/* Catch-all route for 404s */}
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingIndicator } from './LoadingIndicator';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [loginSuccess, setLoginSuccess] = useState(false);
  
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect url from location state or default to home page
  const from = location.state?.from?.pathname || '/';

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user && !loginSuccess) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from, loginSuccess]);

  const validateForm = () => {
    // Reset previous errors
    setError('');

    // Email validation
    if (!email) {
      setError('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Password validation
    if (!password) {
      setError('Password is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // For step 1: validate and attempt login
    if (currentStep === 1) {
      // Validate form
      if (!validateForm()) {
        return;
      }
      
      setIsSubmitting(true);
      setError('');
      
      try {
        // Try to log in
        const result = await login(email, password, rememberMe);
        
        if (result.success) {
          setLoginSuccess(true);
          // Move to step 2 - Welcome
          setCurrentStep(2);
        } else {
          setError(result.error || 'Login failed. Please check your credentials.');
        }
      } catch (err) {
        console.error('Login error:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } 
    // For step 2: proceed to step 3
    else if (currentStep === 2) {
      setCurrentStep(3);
    } 
    // For step 3: complete the login process and navigate
    else if (currentStep === 3) {
      navigate(from, { replace: true });
    }
  };

  const fillDemoCredentials = () => {
    setEmail('demo@example.com');
    setPassword('password');
  };

  // Render different content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            {/* Form fields for step 1 */}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <LoadingIndicator />
                    <span className="ml-2">Signing in...</span>
                  </span>
                ) : 'Sign in'}
              </button>
            </div>
          </>
        );
      
      case 2:
        return (
          // Step 2: Welcome screen
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-900">Welcome back!</h3>
            <p className="text-gray-600">Nice to see you again. We're excited to help you connect with others.</p>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Continue
            </button>
          </div>
        );
      
      case 3:
        return (
          // Step 3: Preparing your experience
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full flex items-center justify-center">
                <div className="animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-medium text-gray-900">Preparing your experience</h3>
            <p className="text-gray-600">We're setting things up for you based on your preferences.</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-indigo-600 h-2.5 rounded-full animate-[grow_2s_ease-in-out]" style={{width: '80%'}}></div>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Enter Kerala Match
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {currentStep === 1 ? 'Sign in to your account' : ''}
          </h2>
          {currentStep === 1 && (
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                create a new account
              </Link>
            </p>
          )}
          
          {/* Step indicator */}
          {currentStep > 1 && (
            <div className="mt-6 flex justify-center">
              <ol className="flex items-center space-x-2">
                {[1, 2, 3].map((step) => (
                  <li key={step}>
                    <div 
                      className={`flex items-center justify-center w-6 h-6 rounded-full ${
                        currentStep >= step ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {step}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Demo credentials button - only show in step 1 */}
          {currentStep === 1 && (
            <div className="mt-3 bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-700 mb-2">
                <strong>Demo Mode:</strong> Try the app without registration
              </p>
              <button 
                onClick={fillDemoCredentials}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded transition-colors"
              >
                Fill Demo Credentials
              </button>
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {renderStepContent()}
        </form>
      </div>
    </div>
  );
}

export default LoginScreen;

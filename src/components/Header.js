import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProfileMenu from './ProfileMenu';

function Header() {
  const { user } = useAuth();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* App Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              KeralaMatch
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-10">
            <Link to="/" className="text-gray-500 hover:text-gray-900">
              Discover
            </Link>
            <Link to="/matches" className="text-gray-500 hover:text-gray-900">
              Matches
            </Link>
            <Link to="/messages" className="text-gray-500 hover:text-gray-900">
              Messages
            </Link>
          </nav>
          
          {/* Right side - User menu or auth links */}
          <div className="flex items-center">
            {user ? (
              <ProfileMenu />
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="text-gray-500 hover:text-gray-900">
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

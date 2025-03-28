import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ProfileMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);
  
  const handleLogout = async () => {
    try {
      const result = await logout();
      
      if (result.success) {
        navigate('/login');
      } else {
        console.error('Logout failed:', result.error);
      }
    } catch (error) {
      console.error('Unexpected error during logout:', error);
    }
  };
  
  return (
    <div className="relative" ref={menuRef}>
      {/* Profile picture/button that toggles the menu */}
      <button 
        className="flex items-center focus:outline-none"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white overflow-hidden">
          {user?.photo ? (
            <img 
              src={user.photo} 
              alt={user.name || 'Profile'} 
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{user?.name?.[0] || 'U'}</span>
          )}
        </div>
      </button>
      
      {/* Dropdown menu */}
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <Link 
            to="/profile" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
            onClick={() => setIsMenuOpen(false)}
          >
            Your Profile
          </Link>
          <Link 
            to="/settings" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
            onClick={() => setIsMenuOpen(false)}
          >
            Settings
          </Link>
          <button 
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;

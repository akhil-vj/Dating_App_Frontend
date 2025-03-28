import React from 'react';
import { Heart, MessageSquare, User } from 'lucide-react';

export const BottomNavigation = ({ activeScreen, onScreenChange }) => {
  const navItems = [
    { key: 'discover', label: 'Discover', icon: <Heart size={24} /> },
    { key: 'messages', label: 'Messages', icon: <MessageSquare size={24} /> },
    { key: 'profile', label: 'Profile', icon: <User size={24} /> }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10 safe-area-bottom">
      <div className="flex justify-around">
        {navItems.map(item => (
          <button
            key={item.key}
            onClick={() => onScreenChange(item.key)}
            className={`flex flex-col items-center py-3 px-5 touch-friendly-padding touch-target ${
              activeScreen === item.key
                ? 'text-yellow-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            data-tour={item.key}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
            
            {/* Show indicator dot for active screen */}
            {activeScreen === item.key && (
              <span className="absolute bottom-1 rounded-full w-1 h-1 bg-yellow-500"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { analyticsService } from '../services/analytics';

export const MatchModal = ({ userProfile, matchedProfile, onClose = () => {}, onStartChat }) => {
  const [message, setMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Show confetti animation when match is shown
    setShowConfetti(true);
    
    // Track match event for analytics
    analyticsService.trackAction('match_shown', {
      matchedProfileId: matchedProfile?.id
    });
    
    // Create confetti elements
    const confettiContainer = document.getElementById('confetti-container');
    if (confettiContainer) {
      for (let i = 0; i < 50; i++) {
        createConfetti(confettiContainer);
      }
    }
    
    // Cleanup confetti
    return () => {
      const confetti = document.querySelectorAll('.confetti');
      confetti.forEach(el => el.remove());
    };
  }, [matchedProfile]);

  const createConfetti = (container) => {
    const colors = ['#FACC15', '#F97316', '#14B8A6', '#8B5CF6', '#EC4899'];
    
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.width = `${Math.random() * 8 + 4}px`;
    confetti.style.height = `${Math.random() * 8 + 4}px`;
    confetti.style.animationDelay = `${Math.random() * 2}s`;
    confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
    
    container.appendChild(confetti);
    
    // Add active class after a small delay to trigger animation
    setTimeout(() => {
      confetti.classList.add('active');
    }, 10);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Track action for analytics
      analyticsService.trackAction('first_message_sent', {
        matchedProfileId: matchedProfile?.id,
        messageLength: message.length
      });
      
      // In a real app, you would send this message via your API
      onStartChat(message);
    } else {
      onStartChat();
    }
  };
  
  if (!matchedProfile) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      {/* Confetti container - positioned absolutely to cover the modal */}
      <div id="confetti-container" className="absolute inset-0 overflow-hidden pointer-events-none"></div>
      
      <div className="bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-3xl max-w-md w-full p-6 text-white relative">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-white bg-opacity-20 p-2 rounded-full text-white hover:bg-opacity-30 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2 pulse-match">It's a Match!</h2>
          <p>You and {matchedProfile.name} have liked each other</p>
        </div>
        
        <div className="flex justify-center space-x-4 mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden">
              <img 
                src={userProfile?.photo} 
                alt={userProfile?.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden">
              <img 
                src={matchedProfile.photo} 
                alt={matchedProfile.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* Message input */}
        <div className="bg-white rounded-xl p-2 mb-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Say something to ${matchedProfile.name}...`}
            className="w-full p-2 text-gray-800 bg-transparent border-none outline-none"
            maxLength={500}
          />
        </div>
        
        <div className="flex space-x-3">
          {/* Skip button */}
          <button
            onClick={onClose}
            className="flex-1 bg-white bg-opacity-20 py-3 rounded-xl hover:bg-opacity-30 transition-colors"
          >
            Keep Swiping
          </button>
          
          {/* Send message button */}
          <button
            onClick={handleSendMessage}
            className="flex-1 bg-white text-yellow-500 py-3 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <MessageCircle size={20} className="mr-2" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

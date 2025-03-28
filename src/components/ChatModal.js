import React, { useState, useRef, useEffect } from 'react';
import { Phone, Video, MoreVertical, ArrowLeft, Send, X, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const ChatModal = ({ profile, onBack = () => {}, onSendMessage, onStartCall }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef(null);
  const optionsRef = useRef(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add message to local state
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    
    setMessages([...messages, newMessage]);
    
    // Clear input
    setMessage('');
    
    // Send to parent component
    if (typeof onSendMessage === 'function') {
      onSendMessage(message);
    }
  };

  // Handle button clicks with proper event stopping
  const handleBack = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof onBack === 'function') onBack();
  };
  
  const handleInfoClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Show profile information - implement your info display logic here
    // For example, you might want to show a modal with the profile details
    alert(`Profile info for ${profile.name}`);
  };
  
  const handleCallClick = (type) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof onStartCall === 'function') onStartCall(type);
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-2 flex items-center">
        <button 
          onClick={handleBack}
          className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
          aria-label="Back"
        >
          <ArrowLeft size={24} />
        </button>
        
        {/* ...existing code... */}
      </div>
      
      {/* ...existing code... */}
    </div>
  );
};

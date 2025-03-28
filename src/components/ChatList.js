import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { formatDistanceToNow } from '../services/dateUtils';

export const ChatList = ({ chats = [], onChatSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  // Filter chats based on search term
  const filteredChats = chats.filter(chat => 
    chat.profile.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header with search functionality */}
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        {showSearch ? (
          <div className="flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conversations..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              autoFocus
            />
            <button 
              onClick={() => {
                setSearchTerm('');
                setShowSearch(false);
              }}
              className="ml-2 p-2 text-gray-500"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Messages</h1>
            <button 
              onClick={() => setShowSearch(true)}
              className="p-2 text-gray-500 hover:text-yellow-500 rounded-full hover:bg-gray-100"
            >
              <Search size={20} />
            </button>
          </div>
        )}
      </div>
      
      {/* Chat list with enhanced UI */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length > 0 ? (
          filteredChats.map(chat => {
            const hasUnread = chat.messages.some(m => m.sender !== 'user' && !m.read);
            const lastMessage = chat.lastMessage || { text: '', timestamp: new Date() };
            
            return (
              <div
                key={chat.id}
                onClick={() => onChatSelect(chat)}
                className={`flex items-center p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${hasUnread ? 'bg-yellow-50' : ''}`}
              >
                <div className="relative">
                  <img
                    src={chat.profile.photo}
                    alt={chat.profile.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  {hasUnread && (
                    <span className="absolute top-0 right-3 w-3 h-3 bg-yellow-500 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-medium truncate ${hasUnread ? 'text-black' : 'text-gray-800'}`}>
                      {chat.profile.name}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {formatDistanceToNow(new Date(lastMessage.timestamp))}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${hasUnread ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>
                    {lastMessage.sender === 'user' ? 'You: ' : ''}
                    {lastMessage.text || (lastMessage.attachment ? 'Sent an attachment' : '')}
                  </p>
                </div>
              </div>
            );
          })
        ) : searchTerm ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500 p-4">
            <p>No conversations matching "{searchTerm}"</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-4 p-4">
            <div className="text-center text-gray-500">
              <p className="mb-2">No messages yet</p>
              <p className="text-sm">Start matching to chat with people!</p>
            </div>
            <button 
              onClick={() => window.location.href = '#discover'}
              className="bg-yellow-500 text-white px-6 py-2 rounded-full hover:bg-yellow-600 transition-colors"
            >
              Find Matches
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

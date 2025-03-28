import { StorageService } from './storage';
import { notificationService } from './notification';

// Time limit for edits and deletes in milliseconds (5 minutes)
const EDIT_TIME_LIMIT = 5 * 60 * 1000;

class MessageService {
  constructor() {
    this.chats = StorageService.get('ACTIVE_CHATS') || [];
    this.listeners = [];
  }
  
  // Get all chats
  getAllChats() {
    return this.chats;
  }
  
  // Get a specific chat by profile ID
  getChat(profileId) {
    return this.chats.find(chat => chat.profile.id === profileId) || null;
  }
  
  // Send a message
  sendMessage(profileId, text, attachment = null) {
    const message = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
      read: false,
      attachment
    };
    
    const chatIndex = this.chats.findIndex(chat => chat.profile.id === profileId);
    
    if (chatIndex === -1) {
      // Chat doesn't exist, create new chat
      return null;
    }
    
    // Add message to existing chat
    const updatedChat = {
      ...this.chats[chatIndex],
      messages: [...this.chats[chatIndex].messages, message],
      lastMessage: message,
      unreadCount: 0 // Reset unread count for user's messages
    };
    
    // Update chats array
    this.chats = [
      ...this.chats.slice(0, chatIndex),
      updatedChat,
      ...this.chats.slice(chatIndex + 1)
    ];
    
    // Save to storage
    StorageService.set('ACTIVE_CHATS', this.chats);
    
    // Notify listeners
    this._notifyListeners(this.chats);
    
    // Simulate response for demo purposes
    this._simulateResponse(profileId);
    
    return message;
  }
  
  // Create a new chat with a profile
  createChat(profile) {
    // Check if chat already exists
    const existingChat = this.chats.find(chat => chat.profile.id === profile.id);
    
    if (existingChat) {
      return existingChat;
    }
    
    // Create new chat
    const newChat = {
      id: Date.now(),
      profile: {
        ...profile,
        photo: profile.photo || profile.image // Handle both photo and image properties
      },
      messages: [],
      lastMessage: null,
      unreadCount: 0
    };
    
    this.chats = [...this.chats, newChat];
    StorageService.set('ACTIVE_CHATS', this.chats);
    
    // Notify listeners
    this._notifyListeners(this.chats);
    
    return newChat;
  }
  
  // Mark all messages in a chat as read
  markAsRead(profileId) {
    const chatIndex = this.chats.findIndex(chat => chat.profile.id === profileId);
    
    if (chatIndex === -1) return false;
    
    const chat = this.chats[chatIndex];
    const updatedMessages = chat.messages.map(message => {
      if (message.sender !== 'user' && !message.read) {
        return { ...message, read: true };
      }
      return message;
    });
    
    // Update chat
    const updatedChat = {
      ...chat,
      messages: updatedMessages,
      unreadCount: 0
    };
    
    // Update chats array
    this.chats = [
      ...this.chats.slice(0, chatIndex),
      updatedChat,
      ...this.chats.slice(chatIndex + 1)
    ];
    
    // Save to storage
    StorageService.set('ACTIVE_CHATS', this.chats);
    
    // Notify listeners
    this._notifyListeners(this.chats);
    
    return true;
  }
  
  // Delete a message (within 5 minutes)
  deleteMessage(chatId, messageId) {
    const chatIndex = this.chats.findIndex(chat => chat.id === chatId);
    
    if (chatIndex === -1) return false;
    
    const chat = this.chats[chatIndex];
    const messageIndex = chat.messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex === -1) return false;
    
    const message = chat.messages[messageIndex];
    
    // Check if message is from user and within time limit
    if (message.sender !== 'user') return false;
    
    const now = Date.now();
    const messageTime = new Date(message.timestamp).getTime();
    
    if (now - messageTime > EDIT_TIME_LIMIT) return false;
    
    // Remove message
    const updatedMessages = [...chat.messages];
    updatedMessages.splice(messageIndex, 1);
    
    // Update lastMessage if needed
    let lastMessage = chat.lastMessage;
    if (chat.lastMessage && chat.lastMessage.id === messageId) {
      lastMessage = updatedMessages.length > 0 
        ? updatedMessages[updatedMessages.length - 1] 
        : null;
    }
    
    // Update chat
    const updatedChat = {
      ...chat,
      messages: updatedMessages,
      lastMessage
    };
    
    // Update chats array
    this.chats = [
      ...this.chats.slice(0, chatIndex),
      updatedChat,
      ...this.chats.slice(chatIndex + 1)
    ];
    
    // Save to storage
    StorageService.set('ACTIVE_CHATS', this.chats);
    
    // Notify listeners
    this._notifyListeners(this.chats);
    
    return true;
  }
  
  // Register listener for chat updates
  registerListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }
  
  // Private method to notify listeners
  _notifyListeners(data) {
    this.listeners.forEach(listener => {
      listener(data);
    });
  }
  
  // Private method to simulate response for demo
  _simulateResponse(profileId) {
    setTimeout(() => {
      const chatIndex = this.chats.findIndex(chat => chat.profile.id === profileId);
      
      if (chatIndex === -1) return;
      
      const chat = this.chats[chatIndex];
      
      // Create a response message
      const responses = [
        "Hey there! How's your day going?",
        "That's interesting! Tell me more.",
        "Nice to chat with you!",
        "I'd love to get to know you better.",
        "What do you like to do for fun?",
        "I'm enjoying our conversation so far!",
        "What are your weekend plans?",
        "Thanks for the message!"
      ];
      
      const responseMessage = {
        id: Date.now(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'them',
        timestamp: new Date().toISOString(),
        read: false
      };
      
      // Update chat
      const updatedChat = {
        ...chat,
        messages: [...chat.messages, responseMessage],
        lastMessage: responseMessage,
        unreadCount: (chat.unreadCount || 0) + 1
      };
      
      // Update chats array
      this.chats = [
        ...this.chats.slice(0, chatIndex),
        updatedChat,
        ...this.chats.slice(chatIndex + 1)
      ];
      
      // Save to storage
      StorageService.set('ACTIVE_CHATS', this.chats);
      
      // Notify listeners
      this._notifyListeners(this.chats);
      
      // Show notification
      notificationService.showInAppNotification(
        `New message from ${chat.profile.name}!`,
        'info'
      );
    }, 2000 + Math.random() * 3000); // Random delay between 2-5 seconds
  }
}

export const messageService = new MessageService();

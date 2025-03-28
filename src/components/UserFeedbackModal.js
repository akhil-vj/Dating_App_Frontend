import React, { useState } from 'react';
import { X, Star, Send, ThumbsUp } from 'lucide-react';

export const UserFeedbackModal = ({ onClose = () => {}, onSubmit = () => {} }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState('general');
  
  const categories = [
    { id: 'general', label: 'General Feedback' },
    { id: 'matching', label: 'Matching Algorithm' },
    { id: 'messaging', label: 'Messaging Features' },
    { id: 'profiles', label: 'Profile Experience' },
    { id: 'calls', label: 'Video/Audio Calls' },
    { id: 'bug', label: 'Report a Bug' }
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please provide a rating');
      return;
    }
    
    if (typeof onSubmit === 'function') {
      onSubmit({
        rating,
        feedback,
        category
      });
    }
    
    setSubmitted(true);
  };
  
  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
          <div className="mb-4 text-green-500">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <ThumbsUp size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your feedback helps us improve Malayali Match for everyone. We appreciate your input!
          </p>
          <button
            onClick={() => {
              if (typeof onClose === 'function') onClose();
            }}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Share Your Feedback</h2>
          <button 
            onClick={() => {
              if (typeof onClose === 'function') onClose();
            }}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How would you rate your experience?
            </label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    size={32}
                    className={`
                      ${star <= (hoveredRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      transition-colors
                    `}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-sm mt-2 text-gray-600">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Below Average'}
              {rating === 3 && 'Average'}
              {rating === 4 && 'Good'}
              {rating === 5 && 'Excellent'}
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What aspect are you providing feedback on?
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what you liked or how we can improve..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              rows={5}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 flex items-center justify-center"
          >
            <Send size={18} className="mr-2" />
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

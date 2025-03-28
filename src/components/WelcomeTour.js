import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Heart, MessageSquare, Settings } from 'lucide-react';
import { StorageService } from '../services/storage';

export const WelcomeTour = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(true);

  const tourSteps = [
    {
      title: "Welcome to Malayali Match!",
      content: "We're excited to help you find your perfect match. Let us show you around!",
      image: "/assets/welcome-illustration.svg",
      highlightElement: null
    },
    {
      title: "Discover Matches",
      content: "Swipe right on profiles you like, or left to pass. It's that simple!",
      highlightElement: "[data-tour='discover']",
      icon: <Heart className="text-pink-500" size={24} />
    },
    {
      title: "Chat with Matches",
      content: "When you match with someone, you can start a conversation. Be yourself and have fun!",
      highlightElement: "[data-tour='messages']",
      icon: <MessageSquare className="text-blue-500" size={24} />
    },
    {
      title: "Update Your Profile",
      content: "A complete profile gets more matches! Add photos and share your interests.",
      highlightElement: "[data-tour='profile']",
      icon: <Settings className="text-yellow-500" size={24} />
    }
  ];
  
  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  const handleComplete = () => {
    setVisible(false);
    StorageService.set('TOUR_COMPLETED', true);
    if (onComplete) onComplete();
  };
  
  useEffect(() => {
    // Highlight the relevant element for the current step
    const elementToHighlight = tourSteps[currentStep].highlightElement;
    if (elementToHighlight) {
      const element = document.querySelector(elementToHighlight);
      if (element) {
        element.classList.add('highlight-pulse');
        
        return () => {
          element.classList.remove('highlight-pulse');
        };
      }
    }
  }, [currentStep, tourSteps]);

  if (!visible) return null;

  const currentTourStep = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 overflow-hidden shadow-2xl">
        {/* Close button */}
        <button 
          onClick={handleComplete}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        {/* Tour content */}
        <div className="p-6">
          {currentTourStep.image && (
            <div className="flex justify-center mb-6">
              <img 
                src={currentTourStep.image} 
                alt="Welcome illustration" 
                className="w-48 h-48 object-contain"
              />
            </div>
          )}
          
          <div className="flex items-center mb-4">
            {currentTourStep.icon && (
              <div className="mr-3">{currentTourStep.icon}</div>
            )}
            <h2 className="text-xl font-bold text-gray-800">{currentTourStep.title}</h2>
          </div>
          
          <p className="text-gray-600 mb-8">{currentTourStep.content}</p>
          
          {/* Progress dots */}
          <div className="flex justify-center mb-6">
            {tourSteps.map((_, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 mx-1 rounded-full ${
                  index === currentStep ? 'bg-yellow-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={handleComplete}
              className="text-gray-500 font-medium px-4 py-2 hover:underline"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="bg-yellow-500 text-white font-medium px-6 py-2 rounded-full hover:bg-yellow-600 flex items-center"
            >
              {currentStep < tourSteps.length - 1 ? 'Next' : 'Get Started'}
              <ArrowRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

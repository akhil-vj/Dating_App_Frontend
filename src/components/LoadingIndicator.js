import React from 'react';

// Small inline spinner for buttons
export const LoadingIndicator = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
    </div>
  );
};

// Full page overlay loader
export const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600 mb-3"></div>
        <p className="text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

// Centered content loader
export const ContentLoader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-2"></div>
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  );
};

export default LoadingIndicator;

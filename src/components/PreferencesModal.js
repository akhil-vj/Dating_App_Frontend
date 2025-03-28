import React from 'react';
import { FaithOptions, LanguageOptions, StatusOptions } from '../types/preferences';

export const PreferencesModal = ({ preferences, onUpdate, isPremium, onUpgrade, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Preferences</h3>
          <button onClick={onClose}>&times;</button>
        </div>
        
        <div className="space-y-6">
          {/* Age Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Age Range</label>
            <div className="flex gap-4 mt-2">
              <input
                type="number"
                min="18"
                max={preferences.maxAge}
                value={preferences.minAge}
                onChange={(e) => onUpdate({ minAge: parseInt(e.target.value) })}
                className="w-24 p-2 border rounded"
              />
              <span className="self-center">to</span>
              <input
                type="number"
                min={preferences.minAge}
                max="100"
                value={preferences.maxAge}
                onChange={(e) => onUpdate({ maxAge: parseInt(e.target.value) })}
                className="w-24 p-2 border rounded"
              />
            </div>
          </div>

          {/* Distance */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Maximum Distance ({preferences.distance} km)
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={preferences.distance}
              onChange={(e) => onUpdate({ distance: parseInt(e.target.value) })}
              className="w-full mt-2"
            />
          </div>

          {/* Faith */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Faith</label>
            <select
              value={preferences.faith}
              onChange={(e) => onUpdate({ faith: e.target.value })}
              className="w-full p-2 border rounded mt-2"
            >
              {FaithOptions.map(faith => (
                <option key={faith} value={faith}>{faith}</option>
              ))}
            </select>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Languages</label>
            <select
              multiple
              value={preferences.languages}
              onChange={(e) => onUpdate({ 
                languages: Array.from(e.target.selectedOptions, option => option.value) 
              })}
              className="w-full p-2 border rounded mt-2"
            >
              {LanguageOptions.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Premium Features */}
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={preferences.status}
                onChange={(e) => onUpdate({ status: e.target.value })}
                disabled={!isPremium}
                className="w-full p-2 border rounded mt-2 disabled:bg-gray-100"
              >
                {StatusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              {!isPremium && (
                <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center">
                  <button
                    onClick={onUpgrade}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    Upgrade to Premium
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
              <input
                type="number"
                value={preferences.height}
                onChange={(e) => onUpdate({ height: parseInt(e.target.value) })}
                disabled={!isPremium}
                className="w-full p-2 border rounded mt-2 disabled:bg-gray-100"
              />
              {!isPremium && (
                <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center">
                  <button
                    onClick={onUpgrade}
                    className="bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    Upgrade to Premium
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-yellow-500 text-white py-2 rounded"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

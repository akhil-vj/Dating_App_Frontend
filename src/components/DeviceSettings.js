import React, { useState, useEffect } from 'react';
import { X, Settings, Mic, Video, Volume2 } from 'lucide-react';
import { webRTCService } from '../services/webrtc';

export const DeviceSettings = ({ onClose, onDeviceChange }) => {
  const [devices, setDevices] = useState({
    audioInput: [],
    videoInput: [],
    audioOutput: []
  });
  const [selectedDevices, setSelectedDevices] = useState({
    audioInput: '',
    videoInput: '',
    audioOutput: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load available devices on component mount
  useEffect(() => {
    const loadDevices = async () => {
      try {
        setLoading(true);
        
        // Request permissions first to ensure we get labeled devices
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
          .then(stream => {
            // Stop all tracks immediately
            stream.getTracks().forEach(track => track.stop());
          })
          .catch(err => {
            console.warn('Permission request failed:', err);
          });
        
        // Get devices
        const result = await webRTCService.refreshDeviceList();
        
        if (result.success) {
          setDevices({
            audioInput: result.devices.audioinput,
            videoInput: result.devices.videoinput,
            audioOutput: result.devices.audiooutput
          });
          
          // Set default selections to first available device
          setSelectedDevices({
            audioInput: result.devices.audioinput.length > 0 ? result.devices.audioinput[0].deviceId : '',
            videoInput: result.devices.videoinput.length > 0 ? result.devices.videoinput[0].deviceId : '',
            audioOutput: result.devices.audiooutput.length > 0 ? result.devices.audiooutput[0].deviceId : ''
          });
        } else {
          throw new Error(result.error || 'Failed to get devices');
        }
      } catch (err) {
        console.error('Error loading devices:', err);
        setError('Failed to load audio/video devices');
      } finally {
        setLoading(false);
      }
    };
    
    loadDevices();
    
    // Listen for device changes
    const handleDeviceChange = () => {
      loadDevices();
    };
    
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, []);
  
  // Handle device selection change
  const handleDeviceChange = (type, deviceId) => {
    setSelectedDevices(prev => ({
      ...prev,
      [type]: deviceId
    }));
    
    // Notify parent component
    if (onDeviceChange) {
      onDeviceChange(type, deviceId);
    }
  };
  
  // Activate selected device
  const activateDevice = async (type) => {
    try {
      setLoading(true);
      
      let result;
      const deviceId = selectedDevices[type];
      
      if (type === 'audioInput') {
        // Apply audio input change
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: deviceId } }
        });
        
        if (webRTCService.localStream) {
          // Replace audio track
          const newTrack = stream.getAudioTracks()[0];
          const sender = webRTCService.peerConnection?.getSenders()
            .find(s => s.track && s.track.kind === 'audio');
          
          if (sender) {
            await sender.replaceTrack(newTrack);
          }
          
          // Update local stream
          webRTCService.localStream.getAudioTracks().forEach(t => t.stop());
          webRTCService.localStream.removeTrack(webRTCService.localStream.getAudioTracks()[0]);
          webRTCService.localStream.addTrack(newTrack);
          
          result = { success: true };
        }
      } else if (type === 'videoInput') {
        // Apply video input change
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: deviceId } }
        });
        
        if (webRTCService.localStream) {
          // Replace video track
          const newTrack = stream.getVideoTracks()[0];
          const sender = webRTCService.peerConnection?.getSenders()
            .find(s => s.track && s.track.kind === 'video');
          
          if (sender) {
            await sender.replaceTrack(newTrack);
          }
          
          // Update local stream
          webRTCService.localStream.getVideoTracks().forEach(t => t.stop());
          webRTCService.localStream.removeTrack(webRTCService.localStream.getVideoTracks()[0]);
          webRTCService.localStream.addTrack(newTrack);
          
          result = { success: true };
        }
      } else if (type === 'audioOutput') {
        // Apply audio output change (requires setSinkId support)
        if (!('setSinkId' in HTMLMediaElement.prototype)) {
          throw new Error('Audio output selection not supported');
        }
        
        const videoElements = document.querySelectorAll('audio, video');
        for (const el of videoElements) {
          if (el.setSinkId) {
            await el.setSinkId(deviceId);
          }
        }
        
        result = { success: true };
      }
      
      if (result?.success) {
        // Notify that device has been changed
        return true;
      } else {
        throw new Error('Failed to change device');
      }
    } catch (error) {
      console.error(`Error activating ${type}:`, error);
      setError(`Failed to activate device: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Settings className="mr-2" size={20} />
            Call Settings
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-4 mb-4 rounded-lg">
            <p>{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-10 h-10 border-4 border-t-yellow-500 border-gray-300 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Microphone selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Mic size={16} className="mr-2" />
                Microphone
              </label>
              <select
                value={selectedDevices.audioInput}
                onChange={(e) => handleDeviceChange('audioInput', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                disabled={devices.audioInput.length === 0}
              >
                {devices.audioInput.length === 0 ? (
                  <option value="">No microphones available</option>
                ) : (
                  devices.audioInput.map(device => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Microphone (${device.deviceId.slice(0, 5)}...)`}
                    </option>
                  ))
                )}
              </select>
              <button
                onClick={() => activateDevice('audioInput')}
                disabled={!selectedDevices.audioInput || loading}
                className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
              >
                Apply Microphone
              </button>
            </div>
            
            {/* Camera selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Video size={16} className="mr-2" />
                Camera
              </label>
              <select
                value={selectedDevices.videoInput}
                onChange={(e) => handleDeviceChange('videoInput', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                disabled={devices.videoInput.length === 0}
              >
                {devices.videoInput.length === 0 ? (
                  <option value="">No cameras available</option>
                ) : (
                  devices.videoInput.map(device => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label || `Camera (${device.deviceId.slice(0, 5)}...)`}
                    </option>
                  ))
                )}
              </select>
              <button
                onClick={() => activateDevice('videoInput')}
                disabled={!selectedDevices.videoInput || loading}
                className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
              >
                Apply Camera
              </button>
            </div>
            
            {/* Speaker selection */}
            {'setSinkId' in HTMLMediaElement.prototype && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Volume2 size={16} className="mr-2" />
                  Speaker
                </label>
                <select
                  value={selectedDevices.audioOutput}
                  onChange={(e) => handleDeviceChange('audioOutput', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded bg-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  disabled={devices.audioOutput.length === 0}
                >
                  {devices.audioOutput.length === 0 ? (
                    <option value="">No speakers available</option>
                  ) : (
                    devices.audioOutput.map(device => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Speaker (${device.deviceId.slice(0, 5)}...)`}
                      </option>
                    ))
                  )}
                </select>
                <button
                  onClick={() => activateDevice('audioOutput')}
                  disabled={!selectedDevices.audioOutput || loading}
                  className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
                >
                  Apply Speaker
                </button>
              </div>
            )}
            
            <div className="text-sm text-gray-500 mt-4">
              <p>Note: Changes take effect immediately and will apply to your current and future calls.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useRef, useEffect, useState } from 'react';
import { X, Mic, MicOff, Video, VideoOff, Phone, Camera, VolumeX, Volume2, Settings } from 'lucide-react';
import { webRTCService } from '../services/webrtc';
import { DeviceSettings } from './DeviceSettings';

export const CallScreen = ({ 
  profile, 
  callType, // 'audio' or 'video'
  onClose 
}) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [callStatus, setCallStatus] = useState('connecting'); // connecting, active, ended
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [facingMode, setFacingMode] = useState('user');
  const [error, setError] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState({
    audioInputs: [],
    videoInputs: [],
    audioOutputs: []
  });
  const [showControls, setShowControls] = useState(true);
  const [showDeviceSettings, setShowDeviceSettings] = useState(false);
  
  // Initialize timer for auto-hiding controls
  useEffect(() => {
    let controlsTimer;
    if (callStatus === 'active' && callType === 'video') {
      controlsTimer = setTimeout(() => {
        setShowControls(false);
      }, 5000);
    }
    
    return () => {
      if (controlsTimer) clearTimeout(controlsTimer);
    };
  }, [callStatus, showControls, callType]);
  
  // Handle tap to show controls
  const handleScreenTap = () => {
    if (callType === 'video' && callStatus === 'active') {
      setShowControls(true);
      // Auto hide after 5 seconds
      setTimeout(() => {
        setShowControls(false);
      }, 5000);
    }
  };
  
  // Set up media stream and connection when component mounts
  useEffect(() => {
    const startCall = async () => {
      try {
        // Load available devices
        await webRTCService.refreshDeviceList();
        
        // Initialize call with media constraints based on call type
        const result = await webRTCService.initializeCall({
          audio: true,
          video: callType === 'video'
        });
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to initialize call');
        }
        
        // Set local video stream
        if (localVideoRef.current && result.localStream) {
          localVideoRef.current.srcObject = result.localStream;
        }
        
        // Set up WebRTC event listeners
        webRTCService.addEventListener('onCallStateChange', handleCallStateChange);
        webRTCService.addEventListener('onRemoteStream', handleRemoteStream);
        webRTCService.addEventListener('onError', handleCallError);
        
        // Simulate peer connection for demo
        webRTCService.simulateConnection();
        
      } catch (err) {
        console.error('Call setup error:', err);
        setError(err.message || 'Failed to set up call');
        setCallStatus('ended');
      }
    };
    
    startCall();
    
    // Set up call duration timer
    const timerInterval = setInterval(() => {
      if (callStatus === 'active') {
        setCallTimer(prev => prev + 1);
      }
    }, 1000);
    
    // Listen for device changes
    const handleDeviceChange = async () => {
      try {
        const result = await webRTCService.refreshDeviceList();
        if (result.success) {
          setDeviceInfo({
            audioInputs: result.devices.audioinput,
            videoInputs: result.devices.videoinput,
            audioOutputs: result.devices.audiooutput
          });
        }
      } catch (err) {
        console.error('Error handling device change:', err);
      }
    };
    
    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    
    // Clean up on unmount - Add better cleanup
    return () => {
      webRTCService.removeEventListener('onCallStateChange', handleCallStateChange);
      webRTCService.removeEventListener('onRemoteStream', handleRemoteStream);
      webRTCService.removeEventListener('onError', handleCallError);
      
      // Ensure call is properly ended and resources are released
      webRTCService.endCall();
      webRTCService.cleanup();
      
      clearInterval(timerInterval);
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
      
      // Notify system that the call has ended (important for mobile devices)
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('hangup', null);
      }
    };
  }, [callType]);

  // Format seconds into mm:ss format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle call state changes
  const handleCallStateChange = (event) => {
    if (event.type === 'iceConnectionState') {
      if (event.state === 'connected' || event.state === 'completed') {
        setCallStatus('active');
        
        // Notify that call is connected
        if (window.notificationService) {
          window.notificationService.showInAppNotification(
            `Call with ${profile.name} connected`, 
            'success'
          );
        }
      } else if (event.state === 'failed' || event.state === 'disconnected' || event.state === 'closed') {
        setCallStatus('ended');
        
        // Notify about call ending if it wasn't user initiated
        if (event.reason !== 'userEnded' && window.notificationService) {
          window.notificationService.showInAppNotification(
            `Call ended: ${event.reason || 'Connection lost'}`, 
            'info'
          );
        }
      }
    } else if (event.type === 'callEnded') {
      setCallStatus('ended');
    }
  };
  
  // Handle remote stream received
  const handleRemoteStream = (stream) => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = stream;
    }
  };
  
  // Handle call errors
  const handleCallError = (error) => {
    console.error('Call error:', error);
    setError(error.message || 'An error occurred during the call');
    setCallStatus('ended');
  };
  
  // End call and close screen
  const handleEndCall = async () => {
    await webRTCService.endCall();
    onClose();
  };
  
  // Toggle audio mute state
  const toggleAudio = async () => {
    const result = await webRTCService.toggleAudio(isAudioMuted);
    if (result.success) {
      setIsAudioMuted(!isAudioMuted);
    } else {
      console.error('Failed to toggle audio:', result.error);
      // Show error feedback to user
    }
  };
  
  // Toggle video display
  const toggleVideo = async () => {
    const result = await webRTCService.toggleVideo(isVideoOff);
    if (result.success) {
      setIsVideoOff(!isVideoOff);
    } else {
      console.error('Failed to toggle video:', result.error);
      // Show error feedback to user
    }
  };
  
  // Switch between front and back camera (mobile only)
  const switchCamera = async () => {
    try {
      setError(null);
      const result = await webRTCService.switchCamera();
      
      if (result.success) {
        setFacingMode(result.facingMode);
      } else {
        // Show temporary error message that disappears after 3 seconds
        setError(`Failed to switch camera: ${result.error}`);
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error('Error in camera switch:', err);
      setError('Failed to switch camera');
      setTimeout(() => setError(null), 3000);
    }
  };
  
  // Toggle speaker mode
  const toggleSpeaker = async () => {
    const result = await webRTCService.toggleSpeakerMode();
    if (result.success) {
      setIsSpeakerOn(result.speakerEnabled);
    } else {
      // Handle error based on the reason
      if (result.error === 'Not supported by browser') {
        // Just toggle the UI indicator for demo purposes
        setIsSpeakerOn(!isSpeakerOn);
      } else {
        console.error('Failed to toggle speaker mode:', result.error);
      }
    }
  };
  
  // Handle device selection
  const handleDeviceChange = async (type, deviceId) => {
    // Device changes are handled in the DeviceSettings component
    console.log(`Device ${type} changed to ${deviceId}`);
  };
  
  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col z-50 call-fade-in">
      {/* Header with call status */}
      <div className={`p-4 flex items-center border-b border-gray-800 bg-gray-900 ${
        callType === 'video' && callStatus === 'active' && !showControls ? 'opacity-0 transition-opacity' : 'opacity-100'
      }`}>
        <img 
          src={profile.photo} 
          alt={profile.name} 
          className="w-10 h-10 rounded-full object-cover mr-3" 
        />
        <div className="text-white flex-1">
          <h3 className="font-semibold">{profile.name}</h3>
          <div className="flex items-center text-sm">
            {callStatus === 'connecting' && (
              <span className="text-blue-400">Connecting...</span>
            )}
            {callStatus === 'active' && (
              <span className="text-green-400">
                {callType === 'video' ? 'Video call' : 'Voice call'} • 
                <span className="call-timer ml-1">{formatTime(callTimer)}</span>
              </span>
            )}
            {callStatus === 'ended' && (
              <span className="text-red-400">Call ended</span>
            )}
          </div>
        </div>
        
        {/* Add settings button */}
        <button 
          onClick={() => setShowDeviceSettings(true)}
          className="p-2 text-gray-400 hover:text-white mr-2"
        >
          <Settings size={20} />
        </button>
        
        <button 
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
      </div>
      
      {/* Main call area */}
      <div 
        className="flex-1 relative bg-gray-900 overflow-hidden" 
        onClick={handleScreenTap}
      >
        {/* Connection status indicator (shows during call) */}
        {callStatus === 'active' && (
          <div className={`connection-status ${
            callType === 'video' && !showControls ? 'opacity-0' : 'opacity-100'
          } transition-opacity`}>
            {isAudioMuted && <MicOff size={16} className="inline mr-2" />}
            {callType === 'video' && isVideoOff && <VideoOff size={16} className="inline mr-2" />}
            {formatTime(callTimer)}
          </div>
        )}
        
        {/* Remote video (full screen) */}
        {callType === 'video' && (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            muted={false}
            className={`w-full h-full object-cover video-container ${callStatus !== 'active' ? 'hidden' : ''}`}
          />
        )}
        
        {/* Remote audio-only display */}
        {(callType === 'audio' || (callType === 'video' && isVideoOff)) && callStatus === 'active' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="rounded-full w-32 h-32 border-4 border-yellow-500 mb-6 overflow-hidden">
              <img 
                src={profile.photo} 
                alt={profile.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-white text-2xl font-semibold mb-2">{profile.name}</h2>
            <div className="flex items-center text-green-400 space-x-2">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="call-timer">{formatTime(callTimer)}</span>
            </div>
            {/* Display mute indicator in audio call */}
            {isAudioMuted && (
              <div className="mt-4 text-red-400 flex items-center">
                <MicOff size={16} className="mr-1" />
                <span>Microphone muted</span>
              </div>
            )}
            {/* Display speaker mode */}
            {isSpeakerOn && (
              <div className="mt-2 text-blue-400 flex items-center">
                <Volume2 size={16} className="mr-1" />
                <span>Speaker on</span>
              </div>
            )}
          </div>
        )}
        
        {/* Local video (picture-in-picture) */}
        {callType === 'video' && !isVideoOff && callStatus === 'active' && (
          <div className="absolute bottom-24 right-4 w-1/4 max-w-[150px] h-auto aspect-video rounded-lg overflow-hidden border-2 border-white shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted={true} // Mute local video to prevent feedback
              className="w-full h-full object-cover video-selfie"
            />
          </div>
        )}
        
        {/* Connecting UI */}
        {callStatus === 'connecting' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="rounded-full w-24 h-24 mb-6 overflow-hidden">
              <img 
                src={profile.photo} 
                alt={profile.name} 
                className="w-full h-full object-cover opacity-75" 
              />
            </div>
            <h3 className="text-white text-xl mb-4">
              {callType === 'video' ? 'Starting video call with' : 'Calling'} {profile.name}...
            </h3>
            <div className="w-12 h-12 border-t-2 border-yellow-500 border-opacity-50 rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Error UI */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900 bg-opacity-50">
            <div className="bg-red-800 p-6 rounded-lg max-w-md text-center">
              <h3 className="text-white text-xl mb-2">Connection Error</h3>
              <p className="text-red-200 mb-4">{error}</p>
              <button
                onClick={onClose}
                className="bg-white text-red-700 px-6 py-2 rounded-lg call-control-btn"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Call controls */}
      <div className={`bg-black p-4 ${
        callType === 'video' && callStatus === 'active' && !showControls ? 'opacity-0 translate-y-full' : 'opacity-100 translate-y-0'
      } transition-all duration-300`}>
        <div className="flex justify-center space-x-4 items-center">
          {/* Audio toggle */}
          <button
            onClick={toggleAudio}
            className={`w-12 h-12 rounded-full flex items-center justify-center call-control-btn ${
              isAudioMuted ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            aria-label={isAudioMuted ? "Unmute microphone" : "Mute microphone"}
          >
            {isAudioMuted ? (
              <MicOff size={20} className="text-white" />
            ) : (
              <Mic size={20} className="text-white" />
            )}
          </button>
          
          {/* Speaker toggle */}
          <button
            onClick={toggleSpeaker}
            className={`w-12 h-12 rounded-full flex items-center justify-center call-control-btn ${
              isSpeakerOn ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
            aria-label={isSpeakerOn ? "Switch to earpiece" : "Switch to speaker"}
          >
            {isSpeakerOn ? (
              <Volume2 size={20} className="text-white" />
            ) : (
              <VolumeX size={20} className="text-white" />
            )}
          </button>
          
          {/* End call */}
          <button
            onClick={handleEndCall}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center call-control-btn call-button-pulse"
            aria-label="End call"
          >
            <Phone size={28} className="text-white transform rotate-135" />
          </button>
          
          {/* Video toggle (only shown for video calls) */}
          {callType === 'video' && (
            <button
              onClick={toggleVideo}
              className={`w-12 h-12 rounded-full flex items-center justify-center call-control-btn ${
                isVideoOff ? 'bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              aria-label={isVideoOff ? "Turn camera on" : "Turn camera off"}
            >
              {isVideoOff ? (
                <VideoOff size={20} className="text-white" />
              ) : (
                <Video size={20} className="text-white" />
              )}
            </button>
          )}
          
          {/* Camera switch button (only for mobile video calls) */}
          {callType === 'video' && !isVideoOff && (
            <button
              onClick={switchCamera}
              className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center call-control-btn"
              aria-label="Switch camera"
            >
              <Camera size={20} className="text-white" />
            </button>
          )}
        </div>
      </div>
      
      {/* Device Settings Modal */}
      {showDeviceSettings && (
        <DeviceSettings 
          onClose={() => setShowDeviceSettings(false)}
          onDeviceChange={handleDeviceChange}
        />
      )}
    </div>
  );
};

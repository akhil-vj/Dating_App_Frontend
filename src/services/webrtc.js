import { notificationService } from './notification';

class WebRTCService {
  constructor() {
    this.localStream = null;
    this.remoteStream = null;
    this.peerConnection = null;
    this.isInitiator = false;
    this.listeners = {
      onCallStateChange: [],
      onRemoteStream: [],
      onLocalStream: [],
      onError: []
    };
    
    // Call configuration
    this.configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ]
    };

    // Add speaker mode tracking
    this.speakerEnabled = false;
    this.availableDevices = {
      audioinput: [],
      videoinput: [],
      audiooutput: []
    };
  }

  // Initialize the WebRTC call
  async initializeCall(options = { video: true, audio: true }) {
    try {
      // Stop any existing streams
      this.stopStreams();
      
      // Request media based on call type
      const mediaConstraints = {
        audio: options.audio,
        video: options.video ? { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } : false
      };
      
      // Get user media
      this.localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      
      // Notify listeners about local stream
      this._notifyListeners('onLocalStream', this.localStream);
      
      // Create RTCPeerConnection
      this.peerConnection = new RTCPeerConnection(this.configuration);
      
      // Add tracks to the peer connection
      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
      });
      
      // Set up event handlers for the peer connection
      this._setupPeerConnectionEvents();
      
      // Mark this peer as the initiator
      this.isInitiator = true;
      
      // Create the offer (in a real app, this would be sent via signaling server)
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      
      // Return success
      return {
        success: true,
        localStream: this.localStream
      };
    } catch (error) {
      this._notifyListeners('onError', error);
      console.error('WebRTC initialization error:', error);
      return {
        success: false,
        error: error.message || 'Failed to initialize call'
      };
    }
  }
  
  // Set up event handlers for the peer connection
  _setupPeerConnectionEvents() {
    if (!this.peerConnection) return;
    
    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // In a real app, send this candidate to the remote peer via your signaling server
        console.log('ICE candidate:', event.candidate);
      }
    };
    
    // Handle ICE connection state changes
    this.peerConnection.oniceconnectionstatechange = () => {
      const state = this.peerConnection.iceConnectionState;
      this._notifyListeners('onCallStateChange', { type: 'iceConnectionState', state });
      
      // Handle disconnections
      if (state === 'disconnected' || state === 'failed' || state === 'closed') {
        this._notifyListeners('onCallStateChange', { type: 'callEnded', reason: state });
      }
    };
    
    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      this._notifyListeners('onRemoteStream', this.remoteStream);
    };
  }
  
  // Accept an incoming call offer
  async acceptCall(offer) {
    try {
      if (!this.peerConnection) {
        await this.initializeCall();
      }
      
      // Set the remote description (the offer from the caller)
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      
      // Create an answer
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      
      // In a real app, send this answer back via signaling
      return {
        success: true,
        answer
      };
    } catch (error) {
      this._notifyListeners('onError', error);
      console.error('Error accepting call:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // End the call
  async endCall() {
    try {
      // Close the peer connection
      if (this.peerConnection) {
        this.peerConnection.close();
        this.peerConnection = null;
      }
      
      // Stop all media streams
      this.stopStreams();
      
      // Notify listeners
      this._notifyListeners('onCallStateChange', { type: 'callEnded', reason: 'userEnded' });
      
      return { success: true };
    } catch (error) {
      console.error('Error ending call:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Toggle audio mute state
  toggleAudio(mute) {
    if (!this.localStream) return { success: false, muted: true };
    
    try {
      const audioTracks = this.localStream.getAudioTracks();
      
      if (audioTracks.length === 0) {
        return { success: false, muted: true, error: 'No audio tracks found' };
      }
      
      audioTracks.forEach(track => {
        track.enabled = !mute;
      });
      
      // Also notify other party about mute status (in a real app)
      // For demo, just return the new state
      return { 
        success: true, 
        muted: mute,
        trackInfo: {
          enabled: audioTracks[0].enabled,
          id: audioTracks[0].id,
          label: audioTracks[0].label
        }
      };
    } catch (error) {
      console.error('Error toggling audio:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Toggle video state
  toggleVideo(hide) {
    if (!this.localStream) return { success: false, videoOff: true };
    
    try {
      const videoTracks = this.localStream.getVideoTracks();
      
      if (videoTracks.length === 0) {
        return { success: false, videoOff: true, error: 'No video tracks found' };
      }
      
      videoTracks.forEach(track => {
        track.enabled = !hide;
      });
      
      return { 
        success: true, 
        videoOff: hide,
        trackInfo: {
          enabled: videoTracks[0].enabled,
          id: videoTracks[0].id,
          label: videoTracks[0].label
        }
      };
    } catch (error) {
      console.error('Error toggling video:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Complete switchCamera method
  async switchCamera() {
    if (!this.localStream) return { success: false };
    
    const currentVideoTrack = this.localStream.getVideoTracks()[0];
    if (!currentVideoTrack) return { success: false };
    
    // Get current facing mode
    const currentFacingMode = currentVideoTrack.getSettings().facingMode;
    const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
    
    try {
      // Get new stream with opposite camera
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacingMode },
        audio: true
      });
      
      // Replace the track in the peer connection
      const newVideoTrack = newStream.getVideoTracks()[0];
      
      const senders = this.peerConnection.getSenders();
      const videoSender = senders.find(sender => 
        sender.track && sender.track.kind === 'video'
      );
      
      if (videoSender) {
        await videoSender.replaceTrack(newVideoTrack);
      }
      
      // Replace the local stream's video track
      this.localStream.getVideoTracks().forEach(track => track.stop());
      this.localStream.removeTrack(this.localStream.getVideoTracks()[0]);
      this.localStream.addTrack(newVideoTrack);
      
      // Notify listeners
      this._notifyListeners('onLocalStream', this.localStream);
      
      return { success: true, facingMode: newFacingMode };
    } catch (error) {
      console.error('Error switching camera:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Toggle speaker mode (switch audio output device)
  async toggleSpeakerMode() {
    try {
      // This functionality requires the Audio Output Devices API
      if (!('sinkId' in HTMLMediaElement.prototype)) {
        console.warn('Audio output device selection is not supported in this browser');
        return { success: false, error: 'Not supported by browser' };
      }
      
      // Get available audio output devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioOutputDevices = devices.filter(device => device.kind === 'audiooutput');
      
      // Store for later use
      this.availableDevices.audiooutput = audioOutputDevices;
      
      if (audioOutputDevices.length <= 1) {
        console.warn('Only one audio output device available');
        return { success: false, error: 'Only one audio output available' };
      }
      
      // Determine which device to use
      // For most mobile devices, the first device is usually the earpiece and others are speakers
      // Toggle between them
      this.speakerEnabled = !this.speakerEnabled;
      
      // Get all audio elements that might be playing remote audio
      const audioElements = document.querySelectorAll('audio, video');
      
      // Find the right device ID to use
      const deviceToUse = this.speakerEnabled 
        ? audioOutputDevices.find(d => d.label.toLowerCase().includes('speaker')) 
          || audioOutputDevices[1] // fallback to second device
        : audioOutputDevices[0]; // default/first device (usually earpiece)
      
      // Set all audio elements to use this output
      for (const el of audioElements) {
        if (typeof el.setSinkId === 'function') {
          await el.setSinkId(deviceToUse.deviceId);
        }
      }
      
      return { 
        success: true, 
        speakerEnabled: this.speakerEnabled,
        device: deviceToUse.label || (this.speakerEnabled ? 'Speaker' : 'Earpiece')
      };
    } catch (error) {
      console.error('Error toggling speaker mode:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Get all available devices
  async refreshDeviceList() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      this.availableDevices = {
        audioinput: devices.filter(device => device.kind === 'audioinput'),
        videoinput: devices.filter(device => device.kind === 'videoinput'),
        audiooutput: devices.filter(device => device.kind === 'audiooutput')
      };
      
      return {
        success: true,
        devices: this.availableDevices
      };
    } catch (error) {
      console.error('Error getting devices:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Stop all media streams
  stopStreams() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop();
      });
      this.localStream = null;
    }
    
    this.remoteStream = null;
  }
  
  // Register event listeners
  addEventListener(type, callback) {
    if (this.listeners[type]) {
      this.listeners[type].push(callback);
      return true;
    }
    return false;
  }
  
  // Remove event listeners
  removeEventListener(type, callback) {
    if (this.listeners[type]) {
      this.listeners[type] = this.listeners[type].filter(cb => cb !== callback);
      return true;
    }
    return false;
  }
  
  // Notify all listeners of a specific type
  _notifyListeners(type, data) {
    if (this.listeners[type]) {
      this.listeners[type].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebRTC ${type} listener:`, error);
        }
      });
    }
  }
  
  // Fix simulateConnection to properly handle different scenarios
  async simulateConnection() {
    try {
      // For demo, simulate various call scenarios
      const scenarios = ['success', 'poor-connection', 'fail'];
      const scenario = scenarios[Math.floor(Math.random() * 0.85)]; // 85% success rate
      
      setTimeout(() => {
        if (scenario === 'success') {
          // Successful connection
          this._notifyListeners('onCallStateChange', { 
            type: 'iceConnectionState', 
            state: 'connected' 
          });
          
          // Create a mock remote stream
          this._createMockRemoteStream();
        } else if (scenario === 'poor-connection') {
          // Poor connection that eventually succeeds
          this._notifyListeners('onCallStateChange', { 
            type: 'iceConnectionState', 
            state: 'checking' 
          });
          
          setTimeout(() => {
            this._notifyListeners('onCallStateChange', { 
              type: 'iceConnectionState', 
              state: 'connected' 
            });
            
            this._createMockRemoteStream();
          }, 3000);
        } else {
          // Failed connection
          this._notifyListeners('onCallStateChange', { 
            type: 'iceConnectionState', 
            state: 'failed',
            reason: 'Could not establish a connection'
          });
        }
      }, 1500);
    } catch (error) {
      this._notifyListeners('onError', error);
    }
  }

  // Improved _createMockRemoteStream with proper error handling 
  _createMockRemoteStream() {
    try {
      if (this.localStream) {
        // For demo purposes, create a simulated remote stream
        // In a real app, this would be the stream from the remote peer
        const mediaStream = new MediaStream();
        
        // Clone audio tracks with a 50% chance of being enabled to simulate mute state
        this.localStream.getAudioTracks().forEach(track => {
          const audioTrack = track.clone();
          audioTrack.enabled = Math.random() > 0.5;
          mediaStream.addTrack(audioTrack);
        });
        
        // Clone video tracks if they exist
        this.localStream.getVideoTracks().forEach(track => {
          const videoTrack = track.clone();
          mediaStream.addTrack(videoTrack);
        });
        
        this.remoteStream = mediaStream;
        this._notifyListeners('onRemoteStream', this.remoteStream);
      }
    } catch (error) {
      console.error('Error creating mock stream:', error);
      this._notifyListeners('onError', error);
    }
  }

  // Add cleanup method to properly dispose resources
  cleanup() {
    this.stopStreams();
    
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    
    // Reset all state
    this.isInitiator = false;
    this.speakerEnabled = false;
  }
}

export const webRTCService = new WebRTCService();

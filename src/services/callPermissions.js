/**
 * Service to handle media device permissions for calls
 */
class CallPermissionsService {
  constructor() {
    this.audioPermission = 'prompt'; // 'granted', 'denied', or 'prompt'
    this.videoPermission = 'prompt';
    this.hasLoadedPermissions = false;
  }

  /**
   * Check all required permissions for calls
   */
  async checkPermissions(options = { audio: true, video: true }) {
    try {
      // Check if needed permissions are already granted
      if (navigator.permissions && navigator.permissions.query) {
        const results = {};
        
        if (options.audio) {
          results.audio = await navigator.permissions.query({ name: 'microphone' });
        }
        
        if (options.video) {
          results.video = await navigator.permissions.query({ name: 'camera' });
        }
        
        this.audioPermission = options.audio ? results.audio.state : 'prompt';
        this.videoPermission = options.video ? results.video.state : 'prompt';
        this.hasLoadedPermissions = true;
        
        return {
          audioPermission: this.audioPermission,
          videoPermission: this.videoPermission,
          allGranted: this._areAllPermissionsGranted(options)
        };
      }
      
      // Fallback to getUserMedia to check permissions
      return await this.requestPermissions(options);
    } catch (error) {
      console.error('Error checking permissions:', error);
      return {
        audioPermission: 'denied',
        videoPermission: 'denied',
        allGranted: false,
        error
      };
    }
  }

  /**
   * Request media permissions
   */
  async requestPermissions(options = { audio: true, video: true }) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: options.audio,
        video: options.video
      });
      
      // Stop all tracks immediately since we just wanted permission
      stream.getTracks().forEach(track => track.stop());
      
      // Update permission states
      this.audioPermission = options.audio ? 'granted' : this.audioPermission;
      this.videoPermission = options.video ? 'granted' : this.videoPermission;
      this.hasLoadedPermissions = true;
      
      return {
        audioPermission: this.audioPermission,
        videoPermission: this.videoPermission,
        allGranted: true
      };
    } catch (error) {
      console.error('Permission request error:', error);
      
      // Determine which permission was denied
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        if (options.audio) this.audioPermission = 'denied';
        if (options.video) this.videoPermission = 'denied';
      }
      
      return {
        audioPermission: this.audioPermission,
        videoPermission: this.videoPermission,
        allGranted: false,
        error
      };
    }
  }

  /**
   * Check if all required permissions are granted
   */
  _areAllPermissionsGranted(options) {
    const audioGranted = !options.audio || this.audioPermission === 'granted';
    const videoGranted = !options.video || this.videoPermission === 'granted';
    return audioGranted && videoGranted;
  }
  
  /**
   * Get available devices (cameras, microphones)
   */
  async getAvailableDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      return {
        audioinput: devices.filter(device => device.kind === 'audioinput'),
        videoinput: devices.filter(device => device.kind === 'videoinput'),
        audiooutput: devices.filter(device => device.kind === 'audiooutput')
      };
    } catch (error) {
      console.error('Error getting devices:', error);
      return { error };
    }
  }
}

export const callPermissionsService = new CallPermissionsService();

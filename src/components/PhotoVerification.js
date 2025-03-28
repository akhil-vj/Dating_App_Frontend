import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image, RefreshCw, Check, X } from 'lucide-react';

export const PhotoVerification = ({ onVerify, onCancel }) => {
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [stream, setStream] = useState(null);

  // Check if camera is available and setup video stream
  useEffect(() => {
    checkCameraAvailability();
    return () => {
      // Clean up video stream when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const checkCameraAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setHasCamera(videoDevices.length > 0);
      
      if (videoDevices.length > 0) {
        startCamera();
      }
    } catch (err) {
      setCameraError("Failed to access camera information");
      console.error("Error checking camera:", err);
    }
  };

  const startCamera = async () => {
    try {
      const constraints = {
        video: { 
          facingMode: "user",
          width: { ideal: 720 },
          height: { ideal: 720 }
        }
      };
      
      const videoStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = videoStream;
        setStream(videoStream);
        setCameraError(null);
      }
    } catch (err) {
      setCameraError("Could not access camera: " + err.message);
      console.error("Error accessing camera:", err);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame on the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to data URL and set as captured photo
    const photoDataUrl = canvas.toDataURL('image/jpeg');
    setCapturedPhoto(photoDataUrl);
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setVerificationStatus(null);
  };

  const submitVerification = async () => {
    if (!capturedPhoto) return;
    
    setIsVerifying(true);
    
    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo, randomly succeed or fail
      const success = Math.random() > 0.2;
      
      setVerificationStatus(success ? 'success' : 'failed');
      
      if (success && onVerify) {
        onVerify(capturedPhoto);
      }
    } catch (err) {
      setVerificationStatus('error');
      console.error("Verification error:", err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Photo Verification</h2>
      
      {cameraError ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
          <h3 className="font-bold">Camera Error</h3>
          <p>{cameraError}</p>
          <p className="text-sm mt-2">Please ensure you've granted camera permissions.</p>
          <button 
            className="mt-2 bg-red-700 text-white px-4 py-2 rounded"
            onClick={checkCameraAvailability}
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="text-center">
          {!capturedPhoto ? (
            <>
              <div className="relative w-64 h-64 mx-auto overflow-hidden rounded-lg bg-gray-100">
                {hasCamera ? (
                  <video 
                    ref={videoRef} 
                    className="absolute inset-0 w-full h-full object-cover" 
                    autoPlay 
                    playsInline 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Camera not available</p>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
              
              <div className="mt-4">
                <button
                  onClick={capturePhoto}
                  disabled={!hasCamera}
                  className="bg-yellow-500 text-white px-6 py-3 rounded-full disabled:bg-gray-300"
                >
                  <Camera className="inline-block mr-2" size={18} />
                  Take Selfie
                </button>
              </div>
              
              <p className="text-sm text-gray-500 mt-2">
                Please center your face in the frame.
              </p>
            </>
          ) : (
            <>
              <div className="relative w-64 h-64 mx-auto overflow-hidden rounded-lg">
                <img 
                  src={capturedPhoto} 
                  alt="Verification selfie" 
                  className="w-full h-full object-cover"
                />
                
                {verificationStatus === 'success' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-60">
                    <div className="bg-white rounded-full p-2">
                      <Check className="text-green-500" size={36} />
                    </div>
                  </div>
                )}
                
                {verificationStatus === 'failed' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-60">
                    <div className="bg-white rounded-full p-2">
                      <X className="text-red-500" size={36} />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 space-y-2">
                {verificationStatus === null && (
                  <>
                    <button
                      onClick={submitVerification}
                      disabled={isVerifying}
                      className="w-full bg-green-500 text-white px-4 py-2 rounded disabled:bg-green-300"
                    >
                      {isVerifying ? (
                        <>
                          <RefreshCw className="inline-block mr-2 animate-spin" size={18} />
                          Verifying...
                        </>
                      ) : (
                        "Submit for Verification"
                      )}
                    </button>
                    
                    <button
                      onClick={retakePhoto}
                      className="w-full bg-gray-200 px-4 py-2 rounded"
                    >
                      Retake Photo
                    </button>
                  </>
                )}
                
                {verificationStatus === 'success' && (
                  <div className="bg-green-50 text-green-800 p-3 rounded">
                    <p className="font-medium">Verification successful!</p>
                    <p className="text-sm">Your profile is now verified.</p>
                  </div>
                )}
                
                {verificationStatus === 'failed' && (
                  <>
                    <div className="bg-red-50 text-red-800 p-3 rounded">
                      <p className="font-medium">Verification failed</p>
                      <p className="text-sm">Please retake your photo in better lighting.</p>
                    </div>
                    
                    <button
                      onClick={retakePhoto}
                      className="w-full bg-yellow-500 text-white px-4 py-2 rounded"
                    >
                      Try Again
                    </button>
                  </>
                )}
                
                {verificationStatus === 'error' && (
                  <>
                    <div className="bg-red-50 text-red-800 p-3 rounded">
                      <p className="font-medium">Error occurred</p>
                      <p className="text-sm">Please try again later.</p>
                    </div>
                    
                    <button
                      onClick={onCancel}
                      className="w-full bg-gray-200 px-4 py-2 rounded"
                    >
                      Close
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
      
      <div className="mt-6">
        <h3 className="text-sm font-medium mb-2">Verification Guidelines:</h3>
        <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
          <li>Make sure your face is clearly visible</li>
          <li>Find a well-lit environment</li>
          <li>Remove sunglasses or accessories that hide your face</li>
          <li>Look directly at the camera</li>
          <li>We'll match this photo with your profile pictures</li>
        </ul>
      </div>
    </div>
  );
};

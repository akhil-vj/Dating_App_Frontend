/**
 * Utilities for optimizing image loading and display
 * to improve user experience especially on mobile devices
 */

/**
 * Generate a blurred placeholder from an image URL
 * @param {string} src - The original image URL
 * @param {number} size - Size of the tiny placeholder
 * @returns {Promise<string>} - Data URL of the tiny placeholder
 */
export const generatePlaceholder = async (src, size = 10) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Create a small canvas for the placeholder
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set tiny dimensions
      canvas.width = size;
      canvas.height = size * (img.height / img.width);
      
      // Draw the image tiny
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Get data URL
      try {
        const dataURL = canvas.toDataURL('image/jpeg', 0.1);
        resolve(dataURL);
      } catch (e) {
        reject(e);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Could not load image'));
    };
    
    img.src = src;
  });
};

/**
 * Lazy load an image with blur-up effect
 * @param {HTMLImageElement} imgElement - The image element to load
 * @param {string} src - The source URL of the image
 * @param {string} placeholderSrc - Optional placeholder image
 */
export const lazyLoadImage = (imgElement, src, placeholderSrc = null) => {
  if (!imgElement) return;
  
  // If we have a placeholder, use it temporarily
  if (placeholderSrc) {
    imgElement.src = placeholderSrc;
    imgElement.classList.add('image-loading');
  }
  
  // Create a new image to load the real source
  const img = new Image();
  
  img.onload = () => {
    imgElement.src = src;
    imgElement.classList.remove('image-loading');
    imgElement.classList.add('image-loaded');
  };
  
  img.src = src;
};

/**
 * Resize and optimize an image file before upload
 * @param {File} file - The image file to optimize
 * @param {Object} options - Resize options
 * @returns {Promise<Blob>} - Resized image as a blob
 */
export const resizeImageForUpload = (file, options = {}) => {
  const {
    maxWidth = 1280,
    maxHeight = 1280,
    quality = 0.8,
    format = 'jpeg'
  } = options;
  
  return new Promise((resolve, reject) => {
    // Create file reader
    const reader = new FileReader();
    
    reader.onload = (readerEvent) => {
      // Create image object
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        // Create canvas and resize
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          `image/${format}`,
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Image loading failed'));
      };
      
      img.src = readerEvent.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('File reading failed'));
    };
    
    // Start reading the file
    reader.readAsDataURL(file);
  });
};

/**
 * Detects the best image format supported by the browser
 * @returns {string} - The best supported image format
 */
export const getBestImageFormat = () => {
  const formats = {
    webp: 'image/webp',
    avif: 'image/avif',
    jpeg: 'image/jpeg',
    png: 'image/png'
  };
  
  // Check for WebP support
  const canvas = document.createElement('canvas');
  if (canvas.toDataURL(formats.webp).indexOf('data:image/webp') === 0) {
    return 'webp';
  }
  
  // Fallback to jpeg
  return 'jpeg';
};

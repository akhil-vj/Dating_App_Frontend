/**
 * Formats a date as a relative time string (e.g., "2h ago", "5m ago")
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted relative time
 */
export const formatDistanceToNow = (date) => {
  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const diff = now.getTime() - dateObj.getTime();
  
  // Check for invalid date
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  const seconds = Math.floor(diff / 1000);
  
  // Less than a minute
  if (seconds < 60) {
    return 'just now';
  }
  
  const minutes = Math.floor(seconds / 60);
  
  // Less than an hour
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  
  const hours = Math.floor(minutes / 60);
  
  // Less than a day
  if (hours < 24) {
    return `${hours}h ago`;
  }
  
  const days = Math.floor(hours / 24);
  
  // Less than a week
  if (days < 7) {
    return `${days}d ago`;
  }
  
  // Format as simple date for older messages
  return dateObj.toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric' 
  });
};

/**
 * Formats a date as a time string (e.g., "3:45 PM")
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted time
 */
export const formatTime = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formats a date as a date string (e.g., "Jan 15, 2023")
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted date
 */
export const formatDate = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Returns true if the date is today
 * @param {Date|string} date - The date to check
 * @returns {boolean} - True if the date is today
 */
export const isToday = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return dateObj.getDate() === today.getDate() &&
         dateObj.getMonth() === today.getMonth() &&
         dateObj.getFullYear() === today.getFullYear();
};

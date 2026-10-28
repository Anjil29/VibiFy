/**
 * Utilities for time manipulation and song duration formatting
 */

/**
 * Converts a time string like "7:45 PM" into minutes from start of day (0-1439)
 * @param {string} timeStr - e.g. "8:30 PM", "11:00 AM"
 * @returns {number}
 */
export function convertToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 720; // default noon
  
  const parts = timeStr.trim().split(' ');
  if (parts.length < 2) return 720;
  
  const [time, modifier] = parts;
  const timeParts = time.split(':').map(Number);
  let hours = timeParts[0] || 0;
  const minutes = timeParts[1] || 0;

  if (modifier && modifier.toUpperCase() === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (modifier && modifier.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

/**
 * Checks whether a song's vibe timestamp matches the current local time within a window (default 4 hours)
 * @param {string} songTime - e.g. "9:15 PM"
 * @param {number} maxDiffMinutes - max distance in minutes (default 240 = 4 hrs)
 * @returns {boolean}
 */
export function calculateDifference(songTime, maxDiffMinutes = 240) {
  if (!songTime) return true;
  
  try {
    const formattedNow = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    
    const currentMinutes = convertToMinutes(formattedNow);
    const songMinutes = convertToMinutes(songTime);

    let diff = Math.abs(currentMinutes - songMinutes);
    // Handle midnight wrap-around (1440 minutes in 24 hours)
    diff = Math.min(diff, 1440 - diff);

    return diff <= maxDiffMinutes;
  } catch {
    return true;
  }
}

/**
 * Formats seconds into mm:ss format
 * @param {number} seconds
 * @returns {string}
 */
export function formatTime(seconds) {
  if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}


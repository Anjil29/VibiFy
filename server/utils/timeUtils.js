/**
 * Converts a time string like "7:45 PM" to total minutes from midnight (0-1439)
 */
export function convertToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 720;

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
 * Checks whether song timestamp is within maxDiffMinutes of the reference time
 */
export function calculateDifference(songTime, refTime = null, maxDiffMinutes = 240) {
  if (!songTime) return true;

  try {
    const timeToCompare =
      refTime ||
      new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

    const currentMinutes = convertToMinutes(timeToCompare);
    const songMinutes = convertToMinutes(songTime);

    let diff = Math.abs(currentMinutes - songMinutes);
    diff = Math.min(diff, 1440 - diff);

    return diff <= maxDiffMinutes;
  } catch {
    return true;
  }
}


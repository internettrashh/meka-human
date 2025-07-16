// Utility function to get the target countdown date: Rarity system launch
export const getCountdownTargetDate = (): Date => {
  // Target date: July 18th, 2024 at 13:17 (25 hours from July 17th 12:17)
  // This is when the rarity system will go live
  const targetDate = new Date('2024-07-18T13:17:00');
  
  return targetDate;
};

// Utility function to calculate time remaining
export const calculateTimeRemaining = (targetDate: Date) => {
  const now = new Date().getTime();
  const distance = targetDate.getTime() - now;

  if (distance > 0) {
    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
      hasExpired: false
    };
  } else {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      hasExpired: true
    };
  }
}; 
// Utility function to get the target countdown date: Monday 23rd at 17:00 UTC
export const getCountdownTargetDate = (): Date => {
  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth();
  
  // Create target date for 23rd of current month at 17:00 UTC
  let targetDate = new Date(Date.UTC(currentYear, currentMonth, 23, 17, 0, 0));
  
  // If the 23rd of current month has already passed, use next month
  if (now.getTime() > targetDate.getTime()) {
    targetDate = new Date(Date.UTC(currentYear, currentMonth + 1, 23, 17, 0, 0));
  }
  
  // Ensure it's a Monday (day 1) - if not, find the next Monday
  const dayOfWeek = targetDate.getUTCDay();
  if (dayOfWeek !== 1) { // 1 = Monday
    // Calculate days to add to get to next Monday
    const daysToAdd = dayOfWeek === 0 ? 1 : (8 - dayOfWeek); // If Sunday (0), add 1, else add days to next Monday
    targetDate.setUTCDate(targetDate.getUTCDate() + daysToAdd);
  }
  
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
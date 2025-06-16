import { useState, useEffect } from 'react';
import { getCountdownTargetDate, calculateTimeRemaining } from '@/utils/countdown';

interface CountdownTimerProps {
  className?: string;
  textColor?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  className = "flex items-center justify-center space-x-4 text-[#fcee0a] font-mono text-lg",
  textColor = "text-[#fcee0a]"
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = getCountdownTargetDate();

    const timer = setInterval(() => {
      const timeRemaining = calculateTimeRemaining(targetDate);
      setTimeLeft({
        days: timeRemaining.days,
        hours: timeRemaining.hours,
        minutes: timeRemaining.minutes,
        seconds: timeRemaining.seconds
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={className}>
      <div className="text-center">
        <div className={`text-2xl font-bold ${textColor}`}>
          {timeLeft.days.toString().padStart(2, '0')}
        </div>
        <div className="text-xs">DAYS</div>
      </div>
      <div className="text-2xl">:</div>
      <div className="text-center">
        <div className={`text-2xl font-bold ${textColor}`}>
          {timeLeft.hours.toString().padStart(2, '0')}
        </div>
        <div className="text-xs">HOURS</div>
      </div>
      <div className="text-2xl">:</div>
      <div className="text-center">
        <div className={`text-2xl font-bold ${textColor}`}>
          {timeLeft.minutes.toString().padStart(2, '0')}
        </div>
        <div className="text-xs">MINS</div>
      </div>
      <div className="text-2xl">:</div>
      <div className="text-center">
        <div className={`text-2xl font-bold ${textColor}`}>
          {timeLeft.seconds.toString().padStart(2, '0')}
        </div>
        <div className="text-xs">SECS</div>
      </div>
    </div>
  );
}; 
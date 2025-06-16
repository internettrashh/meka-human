import { Background } from '@/components/background'
import { useState, useEffect } from 'react'
import { getCountdownTargetDate, calculateTimeRemaining } from '@/utils/countdown'

// Countdown component for Phase 2
const Phase2CountdownTimer = () => {
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
    <div className="flex items-center justify-center space-x-3 sm:space-x-4 lg:space-x-6 text-[#fcee0a] font-mono text-lg sm:text-xl lg:text-2xl">
      <div className="text-center">
        <div className="text-3xl sm:text-4xl lg:text-5xl font-bold">{timeLeft.days.toString().padStart(2, '0')}</div>
        <div className="text-xs sm:text-sm mt-1 lg:mt-2">DAYS</div>
      </div>
      <div className="text-2xl sm:text-3xl lg:text-4xl">:</div>
      <div className="text-center">
        <div className="text-3xl sm:text-4xl lg:text-5xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
        <div className="text-xs sm:text-sm mt-1 lg:mt-2">HOURS</div>
      </div>
      <div className="text-2xl sm:text-3xl lg:text-4xl">:</div>
      <div className="text-center">
        <div className="text-3xl sm:text-4xl lg:text-5xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
        <div className="text-xs sm:text-sm mt-1 lg:mt-2">MINS</div>
      </div>
      <div className="text-2xl sm:text-3xl lg:text-4xl">:</div>
      <div className="text-center">
        <div className="text-3xl sm:text-4xl lg:text-5xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
        <div className="text-xs sm:text-sm mt-1 lg:mt-2">SECS</div>
      </div>
    </div>
  );
};

function RarityPage() {
  return (
    <Background>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8 sm:space-y-10 lg:space-y-12 max-w-4xl mx-auto">
          {/* Phase 2 Title */}
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <h1 className="[font-family:'Space_Grotesk',Helvetica] font-bold text-[#fcee0a] text-4xl sm:text-5xl lg:text-6xl tracking-[2px] lg:tracking-[3px] leading-normal">
              PHASE 2
            </h1>
            <div 
              className="w-full max-w-[400px] h-[5px] bg-[url(/line-seperator.svg)] bg-no-repeat bg-center mx-auto"
              style={{ 
                backgroundSize: 'contain',
                filter: 'brightness(0) saturate(100%) invert(92%) sepia(97%) saturate(1352%) hue-rotate(348deg) brightness(103%) contrast(103%)',
              }}
            />
          </div>

          {/* Countdown Timer */}
          <Phase2CountdownTimer />

          {/* Description */}
          <p className="[font-family:'Space_Grotesk',Helvetica] font-normal text-[#c4c4c4] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed px-4">
            Rarity system and advanced features coming soon. Stay tuned for the next phase of MEKA HUMAN.
          </p>
        </div>
      </div>
    </Background>
  )
}

export default RarityPage 
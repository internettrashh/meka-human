import { Background } from '@/components/background'
import { useState, useEffect } from 'react'

// Countdown component for Phase 2
const Phase2CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set target date to 6 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 6);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center space-x-6 text-[#fcee0a] font-mono text-2xl">
      <div className="text-center">
        <div className="text-5xl font-bold">{timeLeft.days.toString().padStart(2, '0')}</div>
        <div className="text-sm mt-2">DAYS</div>
      </div>
      <div className="text-4xl">:</div>
      <div className="text-center">
        <div className="text-5xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
        <div className="text-sm mt-2">HOURS</div>
      </div>
      <div className="text-4xl">:</div>
      <div className="text-center">
        <div className="text-5xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
        <div className="text-sm mt-2">MINS</div>
      </div>
      <div className="text-4xl">:</div>
      <div className="text-center">
        <div className="text-5xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
        <div className="text-sm mt-2">SECS</div>
      </div>
    </div>
  );
};

function RarityPage() {
  return (
    <Background>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center space-y-12">
          {/* Phase 2 Title */}
          <div className="space-y-6">
            <h1 className="[font-family:'Space_Grotesk',Helvetica] font-bold text-[#fcee0a] text-6xl tracking-[3px] leading-normal">
              PHASE 2
            </h1>
            <div 
              className="w-[400px] h-[5px] bg-[url(/line-seperator.svg)] bg-no-repeat mx-auto"
              style={{ 
                filter: 'brightness(0) saturate(100%) invert(92%) sepia(97%) saturate(1352%) hue-rotate(348deg) brightness(103%) contrast(103%)',
              }}
            />
          </div>

          {/* Countdown Timer */}
          <Phase2CountdownTimer />

          {/* Description */}
          <p className="[font-family:'Space_Grotesk',Helvetica] font-normal text-[#c4c4c4] text-xl max-w-2xl mx-auto leading-relaxed">
            Rarity system and advanced features coming soon. Stay tuned for the next phase of MEKA HUMAN.
          </p>
        </div>
      </div>
    </Background>
  )
}

export default RarityPage 
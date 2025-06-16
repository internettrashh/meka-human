import { Background } from '@/components/background'
import { Card, CardContent } from '@/components/ui/card'
import { checkElig } from '@/actions/checkelig'
import { useConnection, useActiveAddress } from '@arweave-wallet-kit/react'
import { useState, useEffect } from 'react'
import { getCountdownTargetDate, calculateTimeRemaining } from '@/utils/countdown'

// Scramble text effect hook
const useScrambleText = (text: string, isActive: boolean) => {
  const [scrambledText, setScrambledText] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

  useEffect(() => {
    if (!isActive) {
      setScrambledText(text);
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setScrambledText((current) =>
        current
          .split("")
        //@ts-ignore
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text, isActive]);

  return scrambledText;
};

// Countdown component
const CountdownTimer = () => {
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
    <div className="flex items-center justify-center space-x-4 text-[#fcee0a] font-mono text-lg">
      <div className="text-center">
        <div className="text-2xl font-bold">{timeLeft.days.toString().padStart(2, '0')}</div>
        <div className="text-xs">DAYS</div>
      </div>
      <div className="text-2xl">:</div>
      <div className="text-center">
        <div className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
        <div className="text-xs">HOURS</div>
      </div>
      <div className="text-2xl">:</div>
      <div className="text-center">
        <div className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
        <div className="text-xs">MINS</div>
      </div>
      <div className="text-2xl">:</div>
      <div className="text-center">
        <div className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
        <div className="text-xs">SECS</div>
      </div>
    </div>
  );
};

function whitelistcheck() {
  const connected = useConnection();
  const activeAddress = useActiveAddress();
  const [isChecking, setIsChecking] = useState(false);
  const [eligibilityStatus, setEligibilityStatus] = useState<'idle' | 'checking' | 'eligible' | 'not-eligible' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Scramble effect for eligible text
  const scrambledText = useScrambleText("YOU ARE ELIGIBLE TO MINT IN ", eligibilityStatus === 'eligible');

  const handleCheckEligibility = async () => {
    if (!connected || !activeAddress) {
      setErrorMessage('Please connect your wallet to check eligibility.');
      setEligibilityStatus('error');
      return;
    }

    setIsChecking(true);
    setEligibilityStatus('checking');
    
    try {
      const result = await checkElig(activeAddress);
      setEligibilityStatus(result ? 'eligible' : 'not-eligible');
      setErrorMessage('');
    } catch (error) {
      setEligibilityStatus('error');
      setErrorMessage('Error checking eligibility. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusDisplay = () => {
    if (isChecking || eligibilityStatus === 'checking') {
      return {
        title: activeAddress ? `${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}` : '',
        message: 'Checking eligibility...',
        messageColor: 'text-yellow-400',
        showCountdown: false
      };
    }

    switch (eligibilityStatus) {
      case 'eligible':
        return {
          title: scrambledText,
          message: null,
          messageColor: 'text-green-400',
          showCountdown: true
        };
      case 'not-eligible':
        return {
          title: activeAddress ? `${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}` : '',
          message: 'Wallet is not eligible for whitelist.',
          messageColor: 'text-red-400',
          showCountdown: false
        };
      case 'error':
        return {
          title: connected && activeAddress ? `${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}` : 'Wallet Not Connected',
          message: errorMessage || 'Error checking eligibility.',
          messageColor: 'text-red-400',
          showCountdown: false
        };
      default:
        return {
          title: connected && activeAddress ? `${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}` : 'Click to Check Eligibility',
          message: 'Click the button below to check your whitelist status',
          messageColor: 'text-gray-400',
          showCountdown: false
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <Background>
      {/* Main Content */}
      <div className="absolute w-[1118px] h-[470px] top-[210px] left-1/2 -translate-x-1/2">
              <div className="relative h-[470px] bg-[url(/rectangle-3.svg)] bg-[100%_100%]">
                {/* Header */}
                <div className="absolute w-[1028px] h-[75px] top-[38px] left-[53px]">
                  <div className="flex flex-col w-[609px] items-start gap-5 absolute top-[3px] left-0">
                    <div className="relative w-[535px] [font-family:'Space_Grotesk',Helvetica] font-bold text-[#fcee0a] text-[35px] tracking-[1.75px] leading-normal">
                      WHITELIST STATUS
                    </div>
                    <div 
       className="relative w-[335px] h-[5px] bg-[url(/line-seperator.svg)] bg-no-repeat "
       style={{ 
         filter: 'brightness(0) saturate(100%) invert(92%) sepia(97%) saturate(1352%) hue-rotate(348deg) brightness(103%) contrast(103%)',
      
       }}
     />
                  </div>

                  {connected && activeAddress && (isChecking || eligibilityStatus === 'checking') && (
                    <div className="absolute w-[445px] top-0 left-[583px] [font-family:'Space_Grotesk',Helvetica] font-normal text-[#c4c4c4] text-2xl text-right tracking-[1.20px] leading-normal">
                      <span className="font-light tracking-[0.29px]">
                        Checking eligibility for wallet:{" "}
                      </span>
                      <span className="font-bold tracking-[0.29px]">
                        {`${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Try Again Button */}
                <div className="absolute w-52 h-[49px] top-[392px] left-[565px]">
                  <button 
                    onClick={handleCheckEligibility}
                    disabled={isChecking}
                    className="relative h-[50px] w-full disabled:opacity-50"
                  >
                    <div className="absolute top-11 left-[97px] [font-family:'Space_Grotesk',Helvetica] font-medium text-white text-[4.9px] tracking-[0.25px] leading-normal">
                      MK ID
                    </div>
                    <img
                      className="absolute w-[207px] h-[47px] top-px left-px"
                      alt="Glitch"
                      src="/glitch.svg"
                    />
                    <img
                      className="absolute w-[207px] h-[47px] top-0 left-0"
                      alt="Subtract"
                      src="/subtract.svg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center [font-family:'Space_Grotesk',Helvetica] font-bold text-white text-[15px] tracking-[0.75px] leading-tight whitespace-nowrap">
                      {isChecking ? 'CHECKING...' : 'CHECK ELIGIBILITY'}
                    </div>
                  </button>
                </div>

                {/* Go Back Button */}
                <div className="absolute w-[197px] h-[52px] top-[392px] left-[323px]">
                  <div className="relative w-[193px] h-[52px]">
                    <img
                      className="absolute w-[193px] h-[49px] top-0 left-0"
                      alt="Button background"
                      src="/group-1.png"
                    />
                    <div className="top-[45px] left-[166px] text-[6.1px] tracking-[0.30px] absolute [font-family:'Advent_Pro',Helvetica] font-medium text-white leading-normal whitespace-nowrap">
                      R25
                    </div>
                    <div className="absolute top-3 left-16 [font-family:'Advent_Pro',Helvetica] font-bold text-white text-[18.4px] tracking-[0.92px] leading-normal whitespace-nowrap">
                      GO BACK
                    </div>
                  </div>
                </div>

                {/* Status Card */}
                <Card className="absolute top-[170px] left-[210px] w-[698px] h-[132px] border-[0.5px] border-solid border-[#646464] rounded-lg bg-black/50 backdrop-blur-sm">
                  <CardContent className="flex flex-col items-center justify-center h-full p-[33px] space-y-4">
                    <div className="flex flex-col items-center w-full">
                      <div className={`[font-family:'Space_Grotesk',Helvetica] font-bold text-xl text-center tracking-[0] leading-7 ${
                        eligibilityStatus === 'eligible' ? 'text-[#fcee0a]' : 'text-white'
                      }`}>
                        {statusDisplay.title}
                      </div>
                    </div>
                    {statusDisplay.showCountdown ? (
                      <CountdownTimer />
                    ) : statusDisplay.message && (
                      <div className="flex flex-col items-center w-full">
                        <div className={`[font-family:'Space_Grotesk',Helvetica] font-normal ${statusDisplay.messageColor} text-sm text-center tracking-[0] leading-5`}>
                          {statusDisplay.message}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
       
    </Background>
  )
}

export default whitelistcheck

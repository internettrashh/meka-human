import { Background } from '@/components/background'
import { Card, CardContent } from '@/components/ui/card'
import { useConnection, useActiveAddress } from '@arweave-wallet-kit/react'
import { useState, useEffect, useCallback } from 'react'
import { 
  checkMintEligibility, 
  startMinting, 
  getMintStatus, 
  getMintedAssets,
  type EligibilityResponse,
  type MintStartResponse,
  type MintStatusResponse,
  type MintedAssetsResponse 
} from '@/actions/mint'
import { useNavigate } from 'react-router-dom'
import { usePermawebProvider } from '@/providers/PermawebProvider'
import { ExternalLink, X, Wallet } from 'lucide-react'

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

// Progress bar component
const ProgressBar = ({ current, total }: { current: number; total: number }) => {
  // Ensure percentage never exceeds 100% and handle edge cases
  const safeTotal = Math.max(total, 1); // Prevent division by zero
  const safeCurrent = Math.min(Math.max(current, 0), safeTotal); // Clamp between 0 and total
  const percentage = Math.min((safeCurrent / safeTotal) * 100, 100); // Cap at 100%

  return (
    <div className="w-full bg-gray-700 rounded-full h-2">
      <div 
        className="bg-[#fcee0a] h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
      </div>
  );
};

// Quantity slider component with improved styling
const QuantitySlider = ({ 
  max, 
  value, 
  onChange 
}: { 
  max: number; 
  value: number; 
  onChange: (value: number) => void 
}) => {
  const percentage = ((value - 1) / (max - 1)) * 100;
  
  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <div className="flex items-center justify-between w-full text-[#fcee0a]">
        <span className="text-sm font-medium">Quantity:</span>
        <span className="text-lg font-bold">{value}</span>
      </div>
      
      <div className="relative w-full">
        <input
          type="range"
          min="1"
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="slider w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer relative z-10"
        />
        
        {/* Custom track background */}
        <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-700 rounded-lg -translate-y-1/2 pointer-events-none">
          <div 
            className="h-full bg-[#fcee0a] rounded-lg transition-all duration-200 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      
      <div className="flex justify-between w-full text-xs text-gray-400">
        <span>1</span>
        <span>{max}</span>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .slider {
            background: transparent;
          }
          
          .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #fcee0a;
            cursor: pointer;
            border: 2px solid #000;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
            position: relative;
            z-index: 20;
            transition: all 0.2s ease;
          }
          
          .slider::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 3px 8px rgba(252, 238, 10, 0.3);
          }
          
          .slider::-moz-range-thumb {
            height: 18px;
            width: 18px;
            border-radius: 50%;
            background: #fcee0a;
            cursor: pointer;
            border: 2px solid #000;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
            -moz-appearance: none;
            position: relative;
            z-index: 20;
            transition: all 0.2s ease;
          }
          
          .slider::-moz-range-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 3px 8px rgba(252, 238, 10, 0.3);
          }
          
          .slider::-webkit-slider-track {
            background: transparent;
            height: 8px;
            border-radius: 4px;
          }
          
          .slider::-moz-range-track {
            background: transparent;
            height: 8px;
            border-radius: 4px;
            border: none;
          }
          
          .slider:focus {
            outline: none;
          }
          
          .slider:focus::-webkit-slider-thumb {
            box-shadow: 0 0 0 3px rgba(252, 238, 10, 0.3);
          }
          
          .slider:focus::-moz-range-thumb {
            box-shadow: 0 0 0 3px rgba(252, 238, 10, 0.3);
          }
        `
              }} />
      </div>
    );
};

// Simple NFT Grid Component
interface MintedNFT {
  assetBaseName: string;
  assetId: string;
  assetName: string;
  transferSuccess: boolean;
  transferId: string;
  transactionUrl: string;
}

const NFTGrid = ({ nfts }: { nfts: MintedNFT[] }) => {
  const [videoErrors, setVideoErrors] = useState<Set<string>>(new Set());
  
  const handleVideoError = (assetId: string) => {
    setVideoErrors(prev => new Set([...prev, assetId]));
  };

  const openOnBazar = (assetId: string) => {
    window.open(`https://bazar.ar.io/#/asset/${assetId}`, '_blank');
  };

  if (nfts.length === 0) return null;

  return (
    <div className="w-full">
      <div className={`grid gap-3 sm:gap-4 ${
        nfts.length === 1 ? 'grid-cols-1 justify-center max-w-sm sm:max-w-md mx-auto' :
        nfts.length === 2 ? 'grid-cols-2 max-w-md sm:max-w-lg mx-auto' :
        nfts.length === 3 ? 'grid-cols-3 max-w-lg sm:max-w-2xl mx-auto' :
        nfts.length === 4 ? 'grid-cols-2 max-w-md sm:max-w-lg mx-auto' :
        'grid-cols-3 sm:grid-cols-4 max-w-2xl sm:max-w-4xl mx-auto'
      }`}>
        {nfts.map((nft) => (
          <div
            key={nft.assetId}
            onClick={() => openOnBazar(nft.assetId)}
            className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden border border-[#fcee0a]/30 shadow-lg shadow-[#fcee0a]/10 cursor-pointer group hover:border-[#fcee0a] transition-all duration-300"
          >
            {/* NFT Media */}
            {!videoErrors.has(nft.assetId) ? (
              <video
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => handleVideoError(nft.assetId)}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                controls={false}
              >
                <source src={`https://arweave.net/${nft.assetId}`} type="video/mp4" />
                <source src={`https://arweave.net/${nft.assetId}`} type="video/webm" />
                <source src={`https://arweave.net/${nft.assetId}`} type="video/ogg" />
                Your browser does not support the video tag.
              </video>
            ) : (
              /* Fallback for failed videos */
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="w-12 h-12 mx-auto mb-3 bg-[#fcee0a]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#fcee0a] text-lg font-bold">
                      {nft.assetName.charAt(0)}
                    </span>
                  </div>
                  <div className="text-white text-xs font-medium">
                    {nft.assetName}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    {nft.assetId.slice(0, 6)}...
                  </div>
                </div>
              </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-center text-white">
                <ExternalLink className="w-6 h-6 mx-auto mb-2 text-[#fcee0a]" />
                <div className="text-xs font-medium">View on Bazar</div>
              </div>
            </div>

            {/* Success Badge */}
            {nft.transferSuccess && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Minted
              </div>
            )}

            {/* Asset Name */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <div className="text-white text-sm font-medium truncate">
                {nft.assetName}
              </div>
              <div className="text-gray-300 text-xs">
                {nft.assetId.slice(0, 8)}...
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Connect Wallet Modal Component
const ConnectWalletModal = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) => {
  const { connect } = useConnection();

  const handleConnect = async () => {
    try {
      await connect();
      onClose();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-sm mx-4 bg-[#121211] border border-[#646464] rounded-lg p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto bg-[#fcee0a]/10 rounded-full flex items-center justify-center">
            <Wallet className="w-8 h-8 text-[#fcee0a]" />
          </div>

          {/* Title */}
          <div>
            <h3 className="text-xl font-bold text-white mb-2 [font-family:'Space_Grotesk',Helvetica]">
              Connect Your Wallet
            </h3>
            <p className="text-gray-400 text-sm [font-family:'Open_Sans',Helvetica]">
              You need to connect your wallet to check mint eligibility and mint NFTs.
            </p>
          </div>

          {/* Connect Button */}
          <button
            onClick={handleConnect}
            className="relative w-full h-12 group"
          >
            <img
              className="absolute w-full h-[47px] top-0.5 left-0.5"
              alt="Glitch effect"
              src="/glitch.svg"
            />
            <img
              className="absolute w-full h-[47px] top-0 left-0"
              alt="Button background"
              src="/subtract.svg"
            />
            <div className="absolute inset-0 flex items-center justify-center [font-family:'Space_Grotesk',Helvetica] font-bold text-white text-sm tracking-wider uppercase">
              Connect Wallet
            </div>
          </button>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="w-full py-3 text-gray-400 hover:text-white transition-colors text-sm [font-family:'Space_Grotesk',Helvetica]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

type MintingState = 'idle' | 'checking-eligibility' | 'show-eligibility' | 'minting' | 'error' | 'not-eligible' | 'checking-mint-more' | 'not-eligible-mint-more';

function MintingInterface() {
  const connected = useConnection();
  const activeAddress = useActiveAddress();
  const navigate = useNavigate();
  const { getProfileIdFromWallet } = usePermawebProvider();
  
  // State management
  const [state, setState] = useState<MintingState>('idle');
  const [eligibility, setEligibility] = useState<EligibilityResponse | null>(null);
  const [mintQuantity, setMintQuantity] = useState(1);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [mintProgress, setMintProgress] = useState<MintStatusResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showConnectModal, setShowConnectModal] = useState(false);
  
  // Check if user is on mobile
  const isMobile = () => {
    return window.innerWidth < 1024; // lg breakpoint
  };
  
  // Scramble effects
  const scrambledEligibleText = useScrambleText("YOU CAN MINT", state === 'show-eligibility');
  const scrambledMintingText = useScrambleText("MINTING IN PROGRESS", state === 'minting');

  // Check eligibility function
  const handleCheckEligibility = useCallback(async () => {
    if (!connected || !activeAddress) {
      // Show modal on mobile, error message on desktop
      if (isMobile()) {
        setShowConnectModal(true);
        return;
      } else {
        setErrorMessage('Please connect your wallet to check eligibility.');
        setState('error');
        return;
      }
    }

    setState('checking-eligibility');
    setErrorMessage('');
    
    try {
      const result = await checkMintEligibility(activeAddress);
      
      // Check if component is still mounted before updating state
      setEligibility(result);
      
      if (result.success && result.eligibility.canMintMore) {
        setState('show-eligibility');
        setMintQuantity(Math.min(result.eligibility.remainingToMint, result.eligibility.maxBatchSize));
      } else {
        setState('not-eligible');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Error checking eligibility. Please try again.');
      setState('error');
    }
  }, [connected, activeAddress]);

  // Check mint more eligibility function
  const handleCheckMintMore = useCallback(async () => {
    if (!connected || !activeAddress) {
      setErrorMessage('Please connect your wallet to check eligibility.');
      setState('error');
      return;
    }

    setState('checking-mint-more');
    setErrorMessage('');
    
    try {
      const result = await checkMintEligibility(activeAddress);
      
      // Update state only if component is still mounted
      setEligibility(result);
      
      if (result.success && result.eligibility.canMintMore) {
        setState('show-eligibility');
        setMintQuantity(Math.min(result.eligibility.remainingToMint, result.eligibility.maxBatchSize));
      } else {
        setState('not-eligible-mint-more');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Error checking eligibility. Please try again.');
      setState('error');
    }
  }, [connected, activeAddress]);

  // Start minting function
  const handleStartMinting = useCallback(async () => {
    if (!connected || !activeAddress || !eligibility) {
      setErrorMessage('Wallet not connected or eligibility not checked.');
      setState('error');
      return;
    }

    setState('minting');
      setErrorMessage('');
    
    try {
      // Get the profile ID from the wallet address using Permaweb
      const profileId = await getProfileIdFromWallet(activeAddress);
      
      if (!profileId) {
        setErrorMessage('Could not get profile ID from wallet address. Please try again.');
        setState('error');
        return;
      }
      
      console.log('Profile ID for minting:', profileId);
      
      const result = await startMinting(activeAddress, profileId, mintQuantity);
      setSessionId(result.sessionId);
      
      // Start polling for status
      pollMintingStatus(result.sessionId);
    } catch (error: any) {
      setErrorMessage(error.message || 'Error starting mint. Please try again.');
      setState('error');
    }
  }, [connected, activeAddress, eligibility, mintQuantity, getProfileIdFromWallet]);

  // Poll minting status
  const pollMintingStatus = useCallback(async (sessionId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const status = await getMintStatus(sessionId);
        
        // Debug logging for development (remove in production)
        if (process.env.NODE_ENV === 'development') {
          console.log('Mint Status Update:', {
            status: status.status,
            currentStep: status.currentStep,
            stepsCount: status.steps?.length,
            steps: status.steps?.map(s => ({ step: s.step, status: s.status, assetBaseName: s.assetBaseName }))
          });
        }
        
        setMintProgress(status);
        
        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(pollInterval);
          if (status.status === 'completed') {
            // Navigate to success page with minted assets data
            navigate('/mint/success', {
              state: {
                mintedAssets: status.result?.mintedAssets || [],
                successfulMints: status.result?.batchResults.successfulMints || 0,
                failedMints: status.result?.batchResults.failedMints || 0
              }
            });
          } else {
            setErrorMessage(status.error || 'Minting failed. Please try again.');
            setState('error');
          }
        }
      } catch (error: any) {
        clearInterval(pollInterval);
        setErrorMessage('Error checking mint status. Please refresh and try again.');
        setState('error');
      }
    }, 3000); // Poll every 3 seconds

    // Cleanup function
    return () => clearInterval(pollInterval);
  }, []);

  // Auto-check eligibility when wallet is connected (removed auto-show minted assets)
  useEffect(() => {
    if (connected && activeAddress && state === 'idle') {
      handleCheckEligibility();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, activeAddress, state]);

  // Auto-check eligibility when wallet connects after modal was shown
  useEffect(() => {
    if (connected && activeAddress && showConnectModal) {
      setShowConnectModal(false);
      handleCheckEligibility();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, activeAddress, showConnectModal]);

  // Get progress information
  const getProgressInfo = () => {
    if (!mintProgress || !mintProgress.steps) return { current: 0, total: mintQuantity };
    
    // Count unique assets that have been successfully minted (not just completed steps)
    const uniqueAssets = new Set();
    mintProgress.steps.forEach(step => {
      if (step.status === 'completed' && step.assetBaseName) {
        uniqueAssets.add(step.assetBaseName);
      }
    });
    
    // Use the API's assetIndex if available, otherwise fall back to unique asset count
    const currentStep = mintProgress.steps.find(step => step.status === 'in_progress');
    const current = currentStep?.assetIndex || uniqueAssets.size;
    const total = currentStep?.totalAssets || mintQuantity;
    
    // Ensure current never exceeds total
    return { 
      current: Math.min(current, total), 
      total: total 
    };
  };

  const progressInfo = getProgressInfo();

  // Get status display based on current state
  const getStatusDisplay = () => {
    switch (state) {
      case 'checking-eligibility':
        return {
          title: activeAddress ? `${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}` : '',
          message: 'Checking mint eligibility...',
          messageColor: 'text-yellow-400',
          showControls: false
        };
      
      case 'checking-mint-more':
      return {
        title: activeAddress ? `${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}` : '',
          message: 'Checking mint eligibility...',
        messageColor: 'text-yellow-400',
          showControls: false
      };
      
      case 'show-eligibility':
        return {
          title: `${scrambledEligibleText} ${eligibility?.eligibility.remainingToMint || 0} NFTs`,
          message: eligibility?.eligibility.remainingToMint === 1 ? 'You can mint 1 NFT' : `Select quantity (max ${Math.min(eligibility?.eligibility.remainingToMint || 0, eligibility?.eligibility.maxBatchSize || 10)} at once)`,
          messageColor: 'text-green-400',
          showControls: true
        };
      
      case 'minting':
        const currentStep = mintProgress?.steps?.find(step => step.status === 'in_progress');
        const stepMessage = currentStep?.step ? ` (${currentStep.step.replace('minting_asset_', 'Asset ')})` : '';
        
        return {
          title: scrambledMintingText,
          message: `Minting ${progressInfo.current}/${progressInfo.total} NFTs...`,
          messageColor: 'text-[#fcee0a]',
          showControls: false
        };
      
      case 'not-eligible':
        return {
          title: activeAddress ? `${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}` : '',
          message: 'Wallet is not eligible for minting.',
          messageColor: 'text-red-400',
          showControls: false
        };
      
      case 'not-eligible-mint-more':
        return {
          title: 'Oops!',
          message: 'You are not eligible to mint more in this phase.',
          messageColor: 'text-red-400',
          showControls: false
        };
      
      case 'error':
        return {
          title: connected && activeAddress ? `${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}` : 'Wallet Not Connected',
          message: errorMessage || 'Error occurred.',
          messageColor: 'text-red-400',
          showControls: false
        };
      
      default:
        return {
          title: connected && activeAddress ? `${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}` : 'Connect Wallet to Mint',
          message: 'Click the button below to check your mint eligibility',
          messageColor: 'text-gray-400',
          showControls: false
        };
    }
  };

  const statusDisplay = getStatusDisplay();
  const maxQuantity = eligibility ? Math.min(eligibility.eligibility.remainingToMint, eligibility.eligibility.maxBatchSize) : 10;

  return (
    <Background>
      {/* Main Content */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="[font-family:'Space_Grotesk',Helvetica] font-bold text-[#fcee0a] text-2xl sm:text-3xl lg:text-4xl tracking-[1.5px] lg:tracking-[2px] leading-tight">
                MINT MEKA NFTs
              </h1>
              <div 
                className="w-full max-w-[280px] sm:max-w-[320px] h-[3px] bg-[url(/line-seperator.svg)] bg-no-repeat bg-center mx-auto"
                style={{ 
                  backgroundSize: 'contain',
                  filter: 'brightness(0) saturate(100%) invert(92%) sepia(97%) saturate(1352%) hue-rotate(348deg) brightness(103%) contrast(103%)',
                }}
              />
            </div>

            {(state === 'checking-eligibility' || state === 'checking-mint-more') && connected && activeAddress && (
              <div className="mt-4 text-center">
                <div className="[font-family:'Space_Grotesk',Helvetica] font-normal text-[#c4c4c4] text-sm sm:text-base lg:text-lg tracking-[1.20px] leading-normal">
                  <span className="font-light tracking-[0.29px]">
                    Checking eligibility for wallet:{" "}
                  </span>
                  <span className="font-bold tracking-[0.29px] break-all">
                    {`${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Status Card */}
          <Card className="w-full max-w-3xl mx-auto border-[0.5px] border-solid border-[#646464] rounded-lg bg-black/50 backdrop-blur-sm mb-8">
            <CardContent className="flex flex-col items-center p-6 sm:p-8 justify-center min-h-[200px] space-y-6">
              <div className="flex flex-col items-center w-full">
                <div className={`[font-family:'Space_Grotesk',Helvetica] font-bold text-lg sm:text-xl text-center tracking-[0] leading-7 ${
                  state === 'show-eligibility' ? 'text-[#fcee0a]' : 'text-white'
                }`}>
                  {statusDisplay.title}
                </div>
              </div>

              {statusDisplay.message && (
                <div className="flex flex-col items-center w-full">
                  <div className={`[font-family:'Space_Grotesk',Helvetica] font-normal ${statusDisplay.messageColor} text-sm sm:text-base text-center tracking-[0] leading-5 px-4`}>
                    {statusDisplay.message}
                  </div>
                </div>
              )}

              {/* Quantity Slider */}
              {state === 'show-eligibility' && eligibility && eligibility.eligibility.remainingToMint > 1 && (
                <div className="w-full max-w-md">
                  <QuantitySlider 
                    max={maxQuantity}
                    value={mintQuantity}
                    onChange={setMintQuantity}
                  />
                </div>
              )}

              {/* Progress Bar */}
              {state === 'minting' && (
                <div className="w-full max-w-md space-y-2">
                  <ProgressBar current={progressInfo.current} total={progressInfo.total} />
                  <div className="text-center text-sm text-gray-400">
                    {progressInfo.current}/{progressInfo.total} NFTs minted
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {/* Go Back Button */}
            <button 
              onClick={() => navigate('/')}
              className="relative group order-2 sm:order-1"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative px-6 py-3 sm:px-8 sm:py-4 bg-black rounded-lg leading-none flex items-center">
                <span className="[font-family:'Space_Grotesk',Helvetica] font-bold text-white text-sm sm:text-base lg:text-lg tracking-wider uppercase">
                  Go Back
                </span>
              </div>
            </button>

            {/* Main Action Button */}
            <button 
              onClick={
                state === 'idle' || state === 'error' || state === 'not-eligible' || state === 'not-eligible-mint-more'
                  ? handleCheckEligibility 
                  : state === 'show-eligibility'
                  ? handleStartMinting
                  : undefined
              }
              disabled={state === 'checking-eligibility' || state === 'checking-mint-more' || state === 'minting'}
              className="relative w-[200px] sm:w-[240px] h-[50px] sm:h-[60px] order-1 sm:order-2 disabled:opacity-50 hover:opacity-80 transition-opacity"
            >
              <img
                className="absolute w-full h-[47px] sm:h-[57px] top-0.5 left-0.5"
                alt="Glitch"
                src="/glitch.svg"
              />
              <img
                className="absolute w-full h-[47px] sm:h-[57px] top-0 left-0"
                alt="Subtract"
                src="/subtract.svg"
              />
              <div className="absolute inset-0 flex items-center justify-center [font-family:'Space_Grotesk',Helvetica] font-bold text-white text-sm sm:text-base tracking-wider uppercase">
                {state === 'checking-eligibility' || state === 'checking-mint-more' ? 'Checking...' 
                 : state === 'minting' ? 'Minting...'
                 : state === 'show-eligibility' ? 'Start Minting'
                 : 'Check Eligibility'}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Connect Wallet Modal */}
      <ConnectWalletModal 
        isOpen={showConnectModal} 
        onClose={() => setShowConnectModal(false)} 
      />
    </Background>
  );
}

export default MintingInterface;

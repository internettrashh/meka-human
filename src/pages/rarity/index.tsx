import { Background } from '@/components/background'
import { useState, useEffect } from 'react'
import { getCountdownTargetDate, calculateTimeRemaining } from '@/utils/countdown'
import { useArweaveProvider } from '@/providers/ArweaveProvider'
import { getMintedAssets, type MintedAssetsResponse } from '@/actions/mint'
import { ExternalLink } from 'lucide-react'

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
    <div className="flex items-center justify-center space-x-2 sm:space-x-3 lg:space-x-4 text-[#fcee0a] font-mono text-sm sm:text-base lg:text-lg">
      <div className="text-center">
        <div className="text-xl sm:text-2xl lg:text-3xl font-bold">{timeLeft.days.toString().padStart(2, '0')}</div>
        <div className="text-xs sm:text-xs mt-1">DAYS</div>
      </div>
      <div className="text-lg sm:text-xl lg:text-2xl">:</div>
      <div className="text-center">
        <div className="text-xl sm:text-2xl lg:text-3xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
        <div className="text-xs sm:text-xs mt-1">HOURS</div>
      </div>
      <div className="text-lg sm:text-xl lg:text-2xl">:</div>
      <div className="text-center">
        <div className="text-xl sm:text-2xl lg:text-3xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
        <div className="text-xs sm:text-xs mt-1">MINS</div>
      </div>
      <div className="text-lg sm:text-xl lg:text-2xl">:</div>
      <div className="text-center">
        <div className="text-xl sm:text-2xl lg:text-3xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
        <div className="text-xs sm:text-xs mt-1">SECS</div>
      </div>
    </div>
  );
};

// Minted NFT interface
interface MintedNFT {
  assetBaseName: string;
  assetId: string;
  assetName: string;
  transferSuccess: boolean;
  transferId: string;
  transactionUrl: string;
}

// NFT Grid Component
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
    <div className="w-full max-w-3xl mx-auto">
      <div className={`grid gap-3 sm:gap-4 ${
        nfts.length === 1 ? 'grid-cols-1 justify-center max-w-xs mx-auto' :
        nfts.length === 2 ? 'grid-cols-2 max-w-md mx-auto' :
        nfts.length === 3 ? 'grid-cols-3 max-w-2xl mx-auto' :
        nfts.length === 4 ? 'grid-cols-2 max-w-md mx-auto' :
        nfts.length <= 6 ? 'grid-cols-3 max-w-2xl mx-auto' :
        'grid-cols-3 sm:grid-cols-4'
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

function RarityPage() {
  const { connected, address: activeAddress } = useArweaveProvider();
  const [mintedAssets, setMintedAssets] = useState<MintedAssetsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCountdown, setShowCountdown] = useState(false);

  // Fetch minted assets when wallet is connected
  useEffect(() => {
    let isMounted = true;
    
    const fetchMintedAssets = async () => {
      if (!connected || !activeAddress) {
        if (isMounted) {
          setMintedAssets(null);
          setLoading(false);
          setError('');
        }
        return;
      }

      if (isMounted) {
        setLoading(true);
        setError('');
      }
      
      try {
        const result = await getMintedAssets(activeAddress);
        if (isMounted) {
          if (result.success) {
            setMintedAssets(result);
          } else {
            setMintedAssets(null);
          }
        }
      } catch (error: any) {
        if (isMounted) {
          setError('Failed to fetch minted assets');
          setMintedAssets(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMintedAssets();
    
    return () => {
      isMounted = false;
    };
  }, [connected, activeAddress]);

  const hasMintedAssets = mintedAssets && mintedAssets.mintedAssets.length > 0;

  return (
    <Background>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center space-y-6 sm:space-y-8 lg:space-y-10 max-w-4xl mx-auto w-full">
          
          {/* Minted Assets Section - Show at top if user has minted NFTs */}
          {connected && activeAddress && hasMintedAssets && (
            <div className="space-y-4 sm:space-y-5 mb-8 sm:mb-10">
              <div className="space-y-3 sm:space-y-4">
                <h2 className="[font-family:'Space_Grotesk',Helvetica] font-bold text-[#fcee0a] text-xl sm:text-2xl lg:text-3xl tracking-[1.5px] lg:tracking-[2px] leading-tight">
                  YOUR MINTED NFTs
                </h2>
                <div 
                  className="w-full max-w-[280px] sm:max-w-[320px] h-[3px] bg-[url(/line-seperator.svg)] bg-no-repeat bg-center mx-auto"
                  style={{ 
                    backgroundSize: 'contain',
                    filter: 'brightness(0) saturate(100%) invert(92%) sepia(97%) saturate(1352%) hue-rotate(348deg) brightness(103%) contrast(103%)',
                  }}
                />
                <p className="[font-family:'Space_Grotesk',Helvetica] font-normal text-[#c4c4c4] text-sm sm:text-base max-w-md mx-auto">
                  {mintedAssets.mintingHistory.successfulMints} successfully minted
                </p>
              </div>

              <div className="flex justify-center">
                <NFTGrid nfts={mintedAssets.mintedAssets.map(asset => ({
                  assetBaseName: asset.assetBaseName,
                  assetId: asset.assetId,
                  assetName: asset.assetName,
                  transferSuccess: asset.transferSuccess,
                  transferId: asset.transferId,
                  transactionUrl: asset.transactionUrl
                }))} />
              </div>
            </div>
          )}

          {/* Check Rarity Button or Phase 2 Section */}
          {!showCountdown ? (
            <div className="space-y-6 sm:space-y-8 lg:space-y-10 flex flex-col items-center">
              {/* Check Rarity Title */}
              <div className="space-y-3 sm:space-y-4 lg:space-y-5 text-center">
                <h1 className="[font-family:'Space_Grotesk',Helvetica] font-bold text-[#fcee0a] text-2xl sm:text-3xl lg:text-4xl tracking-[1.5px] lg:tracking-[2px] leading-tight">
                  RARITY CHECK
                </h1>
                <div 
                  className="w-full max-w-[280px] sm:max-w-[320px] h-[3px] bg-[url(/line-seperator.svg)] bg-no-repeat bg-center mx-auto"
                  style={{ 
                    backgroundSize: 'contain',
                    filter: 'brightness(0) saturate(100%) invert(92%) sepia(97%) saturate(1352%) hue-rotate(348deg) brightness(103%) contrast(103%)',
                  }}
                />
              </div>

              {/* Check Rarity Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowCountdown(true)}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#fcee0a] via-[#fcee0a] to-[#fcee0a] rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                  <div className="relative px-6 py-3 sm:px-8 sm:py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600">
                    <span className="[font-family:'Space_Grotesk',Helvetica] font-bold text-[#fcee0a] text-base sm:text-lg lg:text-xl tracking-wider uppercase">
                      Check Rarity
                    </span>
                  </div>
                </button>
              </div>

              {/* Description */}
              <p className="[font-family:'Space_Grotesk',Helvetica] font-normal text-[#c4c4c4] text-sm sm:text-base lg:text-lg max-w-lg mx-auto leading-relaxed text-center px-4">
                Click the button above to check when the rarity system will be available.
              </p>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8 lg:space-y-10 flex flex-col items-center">
              {/* Rarity System Launch Title */}
              <div className="space-y-3 sm:space-y-4 lg:space-y-5 text-center">
                <h1 className="[font-family:'Space_Grotesk',Helvetica] font-bold text-[#fcee0a] text-2xl sm:text-3xl lg:text-4xl tracking-[1.5px] lg:tracking-[2px] leading-tight">
                  RARITY SYSTEM LAUNCH
                </h1>
                <div 
                  className="w-full max-w-[280px] sm:max-w-[320px] h-[3px] bg-[url(/line-seperator.svg)] bg-no-repeat bg-center mx-auto"
                  style={{ 
                    backgroundSize: 'contain',
                    filter: 'brightness(0) saturate(100%) invert(92%) sepia(97%) saturate(1352%) hue-rotate(348deg) brightness(103%) contrast(103%)',
                  }}
                />
              </div>

              {/* Countdown Timer */}
              <div className="flex justify-center">
                <Phase2CountdownTimer />
              </div>

              {/* Description */}
              <p className="[font-family:'Space_Grotesk',Helvetica] font-normal text-[#c4c4c4] text-sm sm:text-base lg:text-lg max-w-lg mx-auto leading-relaxed text-center px-4">
              Rarity system and advanced features coming soon. Stay tuned for the next phase of MEKA HUMAN.
              </p>

              {/* Back Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowCountdown(false)}
                  className="[font-family:'Space_Grotesk',Helvetica] font-normal text-[#c4c4c4] text-sm hover:text-[#fcee0a] transition-colors duration-300 underline"
                >
                  ← Back to Rarity Check
                </button>
              </div>
            </div>
          )}

          {/* Loading and Error States */}
          {connected && activeAddress && loading && (
            <div className="text-[#fcee0a] text-sm sm:text-base text-center">
              Loading your minted NFTs...
            </div>
          )}

          {connected && activeAddress && error && (
            <div className="text-red-400 text-sm sm:text-base text-center">
              {error}
            </div>
          )}

          {/* Connect Wallet Message */}
          {!connected && (
            <div className="text-[#c4c4c4] text-sm sm:text-base text-center">
              Connect your wallet to view your minted NFTs
            </div>
          )}
        </div>
      </div>
    </Background>
  )
}

export default RarityPage 
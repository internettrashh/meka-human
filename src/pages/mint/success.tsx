import { Background } from '@/components/background'
import { Card, CardContent } from '@/components/ui/card'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ExternalLink } from 'lucide-react'

// Scramble text effect hook
const useScrambleText = (text: string, isActive: boolean = true) => {
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

// NFT interface
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
    <div className="w-full">
      <div className={`grid gap-4 sm:gap-6 ${
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
            className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden border-2 border-[#fcee0a]/30 shadow-xl shadow-[#fcee0a]/20 cursor-pointer group hover:border-[#fcee0a] hover:shadow-[#fcee0a]/40 transition-all duration-300 transform hover:scale-105"
          >
            {/* NFT Media */}
            {!videoErrors.has(nft.assetId) ? (
              <video
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
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
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#fcee0a]/20 rounded-full flex items-center justify-center">
                    <span className="text-[#fcee0a] text-2xl font-bold">
                      {nft.assetName.charAt(0)}
                    </span>
                  </div>
                  <div className="text-white text-sm font-medium">
                    {nft.assetName}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    {nft.assetId.slice(0, 8)}...
                  </div>
                </div>
              </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-center text-white">
                <ExternalLink className="w-8 h-8 mx-auto mb-2 text-[#fcee0a]" />
                <div className="text-sm font-medium">View on Bazar</div>
              </div>
            </div>

            {/* Success Badge */}
            {nft.transferSuccess && (
              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                ✓ Minted
              </div>
            )}

            {/* Asset Name */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
              <div className="text-white text-sm font-medium truncate">
                {nft.assetName}
              </div>
              <div className="text-gray-300 text-xs mt-1">
                {nft.assetId.slice(0, 8)}...
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function MintSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const mintedAssets = location.state?.mintedAssets as MintedNFT[] || [];
  const successfulMints = location.state?.successfulMints || 0;
  const failedMints = location.state?.failedMints || 0;

  const scrambledSuccessText = useScrambleText("MINTING SUCCESS!", true);

  // If no minted assets are passed, redirect back to mint page
  useEffect(() => {
    if (mintedAssets.length === 0) {
      navigate('/mint');
    }
  }, [mintedAssets.length, navigate]);

  return (
    <Background>
      {/* Main Content */}
      <div className="absolute w-[1118px] h-[620px] top-[180px] left-1/2 -translate-x-1/2">
        <div className="relative h-[620px] bg-[url(/rectangle-3.svg)] bg-[100%_100%]">
          {/* Header */}
          <div className="absolute w-[1028px] h-[75px] top-[38px] left-[53px]">
            <div className="flex flex-col w-[609px] items-start gap-5 absolute top-[3px] left-0">
              <div className="relative w-[535px] [font-family:'Space_Grotesk',Helvetica] font-bold text-[#fcee0a] text-[35px] tracking-[1.75px] leading-normal">
                {scrambledSuccessText}
              </div>
              <div 
                className="relative w-[335px] h-[5px] bg-[url(/line-seperator.svg)] bg-no-repeat"
                style={{ 
                  filter: 'brightness(0) saturate(100%) invert(92%) sepia(97%) saturate(1352%) hue-rotate(348deg) brightness(103%) contrast(103%)',
                }}
              />
            </div>
          </div>

          {/* Mint More Button */}
          <div className="absolute w-52 h-[49px] top-[542px] left-[565px]">
            <button 
              onClick={() => navigate('/mint')}
              className="relative h-[50px] w-full"
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
                MINT MORE
              </div>
            </button>
          </div>

          {/* Go Back to Home Button */}
          <div className="absolute w-[197px] h-[52px] top-[542px] left-[323px]">
            <button 
              onClick={() => navigate('/')}
              className="relative w-[193px] h-[52px]"
            >
              <img
                className="absolute w-[193px] h-[49px] top-0 left-0"
                alt="Button background"
                src="/group-1.png"
              />
              <div className="top-[45px] left-[166px] text-[6.1px] tracking-[0.30px] absolute [font-family:'Advent_Pro',Helvetica] font-medium text-white leading-normal whitespace-nowrap">
                R25
              </div>
              <div className="absolute top-3 left-16 [font-family:'Advent_Pro',Helvetica] font-bold text-white text-[18.4px] tracking-[0.92px] leading-normal whitespace-nowrap">
                GO HOME
              </div>
            </button>
          </div>

          {/* Success Content Card */}
          <Card className="absolute top-[140px] left-[120px] w-[878px] h-[380px] border-[0.5px] border-solid border-[#646464] rounded-lg bg-black/50 backdrop-blur-sm overflow-y-auto">
            <CardContent className="flex flex-col items-center p-[24px] h-full space-y-6">
              {/* Success Message */}
              <div className="flex flex-col items-center w-full space-y-4">
                <div className="text-center">
                 
                  <div className="text-lg font-bold text-green-400 mb-2 [font-family:'Space_Grotesk',Helvetica]">
                    {successfulMints} NFT{successfulMints > 1 ? 's' : ''} Successfully Minted!
                  </div>
                  {failedMints > 0 && (
                    <div className="text-sm text-red-400 [font-family:'Space_Grotesk',Helvetica]">
                      {failedMints} failed to mint
                    </div>
                  )}
                  <div className="text-sm text-gray-300 mt-2 [font-family:'Space_Grotesk',Helvetica]">
                    Your new MEKA ID NFTs are ready! Click on any NFT to view it on Bazar.
                  </div>
                </div>
              </div>
              
              {/* Minted NFTs Grid */}
              {mintedAssets.length > 0 && (
                <div className="w-full flex-1 flex items-center justify-center">
                  <NFTGrid nfts={mintedAssets} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Background>
  );
}

export default MintSuccessPage; 
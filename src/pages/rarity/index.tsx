import { Background } from '@/components/background'
import { useState, useEffect } from 'react'
import { useArweaveProvider } from '@/providers/ArweaveProvider'
import { useConnection } from '@arweave-wallet-kit/react'
import { getMintedAssets, type MintedAssetsResponse } from '@/actions/mint'
import { RarityResult } from '@/components/ui/rarity-result'
import { 
  loadRarityData, 
  calculateNFTRarity, 
  getNFTMetadata, 
  type RarityData, 
  type NFTRarityResult 
} from '@/utils/rarity'
import { getMekaNFTMetadata } from '@/services/arweave'

// Minted NFT interface
interface MintedNFT {
  assetBaseName: string;
  assetId: string;
  assetName: string;
  transferSuccess: boolean;
  transferId: string;
  transactionUrl: string;
}

// NFT Grid Component with rarity checking
const NFTGrid = ({ nfts, onNFTSelect }: { nfts: MintedNFT[], onNFTSelect: (assetId: string) => void }) => {
  const [videoErrors, setVideoErrors] = useState<Set<string>>(new Set());
  
  const handleVideoError = (assetId: string) => {
    setVideoErrors(prev => new Set([...prev, assetId]));
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
            onClick={() => onNFTSelect(nft.assetId)}
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

            {/* View on Bazar Icon */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(`https://bazar.ar.io/#/asset/${nft.assetId}`, '_blank');
              }}
              className="absolute top-2 left-2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>

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
  const { connect } = useConnection();
  const [mintedAssets, setMintedAssets] = useState<MintedAssetsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rarityData, setRarityData] = useState<RarityData | null>(null);
  const [currentNFT, setCurrentNFT] = useState<NFTRarityResult | null>(null);
  const [rarityLoading, setRarityLoading] = useState(false);
  const [rarityError, setRarityError] = useState('');

  // Load rarity data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadRarityData();
        setRarityData(data);
      } catch (error) {
        console.error('Failed to load rarity data:', error);
        setError('Failed to load rarity database');
      }
    };
    
    loadData();
  }, []);

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

  const handleNFTSelect = async (assetId: string) => {
    if (!rarityData) {
      setRarityError('Rarity database not loaded');
      return;
    }

    setRarityLoading(true);
    setRarityError('');
    setCurrentNFT(null);

    try {
      // Fetch from Arweave using Asset ID
      const arweaveData = await getMekaNFTMetadata(assetId);
      let metadata = arweaveData.metadata;
      
      // Also check our local database for additional rarity data
      if (arweaveData.mekaNumber) {
        const localMetadata = getNFTMetadata(arweaveData.mekaNumber, rarityData);
        if (localMetadata) {
          metadata = localMetadata;
        }
      }

      if (!metadata) {
        throw new Error('NFT metadata not found');
      }

      // Calculate rarity
      const rarityResult = calculateNFTRarity(metadata, rarityData);
      rarityResult.assetId = assetId; // Store the original asset ID for video playback
      setCurrentNFT(rarityResult);

    } catch (error: any) {
      console.error('Rarity check error:', error);
      setRarityError(error.message || 'Failed to analyze NFT rarity');
    } finally {
      setRarityLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentNFT(null);
    setRarityError('');
  };

  const hasMintedAssets = mintedAssets && mintedAssets.mintedAssets.length > 0;

  // If showing rarity results
  if (currentNFT) {
    return <RarityResult rarityResult={currentNFT} onBack={handleBack} />;
  }

  return (
    <Background>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto w-full">
          
          {/* Main Title - Only show when connected */}
          {connected && (
            <div className="space-y-4 mb-12">
              <h1 className="[font-family:'Space_Grotesk',Helvetica] font-bold text-[#fcee0a] text-3xl sm:text-4xl lg:text-5xl tracking-[1.5px] lg:tracking-[2px] leading-tight">
                YOUR MEKA COLLECTION
              </h1>
              <div 
                className="w-full max-w-[320px] h-[3px] bg-[url(/line-seperator.svg)] bg-no-repeat bg-center mx-auto"
                style={{ 
                  backgroundSize: 'contain',
                  filter: 'brightness(0) saturate(100%) invert(92%) sepia(97%) saturate(1352%) hue-rotate(348deg) brightness(103%) contrast(103%)',
                }}
              />
              <p className="[font-family:'Space_Grotesk',Helvetica] font-normal text-[#c4c4c4] text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
                Click on any of your minted NFTs to analyze their rarity and discover their unique traits.
              </p>
            </div>
          )}

          {/* Loading State for Rarity Calculation */}
          {rarityLoading && (
            <div className="text-center p-8">
              <div className="text-[#fcee0a] text-lg mb-2"> Analyzing NFT Rarity...</div>
              <div className="text-gray-400">Fetching metadata and calculating scores</div>
            </div>
          )}

          {/* Error State */}
          {rarityError && (
            <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg max-w-md mx-auto">
              <p className="text-red-300 text-sm text-center">
                {rarityError}
              </p>
            </div>
          )}

                    {/* Minted Assets Section */}
          {connected && activeAddress && hasMintedAssets && !rarityLoading && (
            <div className="flex justify-center">
              <NFTGrid 
                nfts={mintedAssets.mintedAssets.map(asset => ({
                  assetBaseName: asset.assetBaseName,
                  assetId: asset.assetId,
                  assetName: asset.assetName,
                  transferSuccess: asset.transferSuccess,
                  transferId: asset.transferId,
                  transactionUrl: asset.transactionUrl
                }))} 
                onNFTSelect={handleNFTSelect}
              />
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
            <div className="text-center space-y-8 max-w-4xl mx-auto">
              <div className="space-y-6">
                <h1 className="[font-family:'Space_Grotesk',Helvetica] font-bold text-[#fcee0a] text-3xl sm:text-4xl lg:text-5xl tracking-[1.5px] lg:tracking-[2px] leading-tight">
                  MEKA_IDs: RARITY CHECKER
                </h1>
                <div 
                  className="w-full max-w-[320px] h-[3px] bg-[url(/line-seperator.svg)] bg-no-repeat bg-center mx-auto"
                  style={{ 
                    backgroundSize: 'contain',
                    filter: 'brightness(0) saturate(100%) invert(92%) sepia(97%) saturate(1352%) hue-rotate(348deg) brightness(103%) contrast(103%)',
                  }}
                />
                <p className="[font-family:'Space_Grotesk',Helvetica] font-normal text-[#fcee0a] text-base lg:text-lg max-w-3xl mx-auto leading-relaxed px-4">
                  Meka Humans emerged from the smog-choked underbelly of Meka City, refined in illegal factories, minted in dark net marketplaces, and coded to evolve. What began as wearable shells are now full-fledged identities: smarter, sleeker, and forged with rare components.
                </p>
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    connect();
                  }}
                  className="relative w-64 h-12 group"
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
              </div>
            </div>
          )}

          {/* No Minted NFTs Message */}
          {connected && activeAddress && !loading && !hasMintedAssets && !error && (
            <div className="text-center space-y-4">
              <div className="text-[#c4c4c4] text-sm sm:text-base">
                No minted NFTs found in your wallet
              </div>
              <div className="text-gray-500 text-xs">
              Mint your first Meka Human NFT to unlock rarity analysis
              </div>
            </div>
          )}
        </div>
      </div>
    </Background>
  )
}

export default RarityPage 
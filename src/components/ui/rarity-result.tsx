import { NFTRarityResult } from '@/utils/rarity';
import { Background } from '@/components/background';

interface RarityResultProps {
  rarityResult: NFTRarityResult;
  onBack: () => void;
}

export function RarityResult({ rarityResult, onBack }: RarityResultProps) {
  // Create trait map for easy lookup
  const traitMap = new Map();
  rarityResult.traits.forEach(trait => {
    traitMap.set(trait.trait_type, trait.value);
  });

  // Count actual traits (excluding "No [Something]" values)
  const noTraitValues = new Set([
    'No Augmentation',
    'No Facial Gear', 
    'No Hair (Synth-Scalp)',
    'No Headgear',
    'No Jacket',
    'No Rig',
    'No Top'
  ]);
  
  const actualTraitCount = rarityResult.traits.filter(trait => 
    trait.value && !noTraitValues.has(trait.value)
  ).length;

  // Function to open NFT on Bazar
  const openOnBazar = (assetId: string) => {
    window.open(`https://bazar.ar.io/#/asset/${assetId}`, '_blank');
  };

  // Organize traits into 3 columns as shown in the image
  const columns = [
    ['BODY CONTAINERS', 'BACK', 'HAT', 'HAIRS'],           // Left column
    ['EYES', 'ACCESSORY', 'FACE', 'TOP'],                  // Middle column  
    ['BEARDS', 'JACKET', 'Skin Color', 'Backgrounds']      // Right column
  ];

  return (
    <Background>
      <div className="min-h-screen text-white p-4 sm:p-6 lg:p-8 pt-20 sm:pt-24 lg:pt-28">
        <div className="max-w-7xl mx-auto w-full">
          {/* Main Rarity Container */}
          <div className="bg-[#121211] rounded-lg p-4 sm:p-6 lg:p-8 border border-gray-800">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 lg:gap-8 mb-6 lg:mb-8">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#fcee0a] mb-2">
                  MEKA_ID {rarityResult.metadata.id} RARITY
                </h1>
                <div className="h-1 bg-[#fcee0a] w-full max-w-xs lg:max-w-sm"></div>
              </div>
              <div className="flex flex-row lg:flex-col gap-6 lg:gap-2 lg:text-right">
                <div className="flex-1 lg:flex-none lg:mb-2">
                  <span className="text-white font-semibold text-sm sm:text-base">Number of Traits</span>
                  <div className="text-[#fcee0a] font-bold text-lg sm:text-xl">
                    {actualTraitCount} / 12
                  </div>
                </div>
                <div className="flex-1 lg:flex-none">
                  <span className="text-white font-semibold text-sm sm:text-base">Rarity Score</span>
                  <div className="text-[#fcee0a] font-bold text-lg sm:text-xl">
                    {Math.round(rarityResult.totalRarityScore)} Points
                  </div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
              {/* NFT Image */}
              <div className="xl:col-span-1 flex flex-col items-center">
                <div className="w-full max-w-sm aspect-square border-2 border-red-500 bg-gray-700 rounded-lg overflow-hidden">
                  {rarityResult.assetId ? (
                    <video
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls={false}
                    >
                      <source src={`https://arweave.net/${rarityResult.assetId}`} type="video/mp4" />
                      <source src={`https://arweave.net/${rarityResult.assetId}`} type="video/webm" />
                      <source src={`https://arweave.net/${rarityResult.assetId}`} type="video/ogg" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl sm:text-4xl mb-4">🎮</div>
                        <div className="text-white font-bold text-sm sm:text-base">Meka_ID {rarityResult.metadata.id}</div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-center mt-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
                    Meka_ID {rarityResult.metadata.id}
                  </h3>
                  {rarityResult.assetId && (
                    <button
                      onClick={() => openOnBazar(rarityResult.assetId!)}
                      className="bg-[#fcee0a] text-black px-4 py-2 rounded font-semibold hover:bg-[#fcee0a]/90 transition-colors flex items-center gap-2 mx-auto"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span>View on Bazar</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Traits Grid - 3 Columns */}
              <div className="xl:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {columns.map((column, columnIndex) => (
                    <div key={columnIndex} className="space-y-4 lg:space-y-6">
                      {column.map((traitType) => (
                        <div key={traitType} className="space-y-1">
                          <h4 className="text-white font-bold text-sm sm:text-base lg:text-lg uppercase tracking-wide">
                            {traitType}
                          </h4>
                          <p className="text-[#fcee0a] text-sm sm:text-base break-words">
                            {traitMap.get(traitType) || 'No Trait'}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Back Button - Now at bottom */}
          <button
            onClick={onBack}
            className="text-white hover:text-[#fcee0a] transition-colors mt-6 flex items-center justify-center text-sm sm:text-base"
          >
            ← Check another NFT
          </button>
        </div>
      </div>
    </Background>
  );
} 
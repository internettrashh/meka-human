import { NFTRarityResult, formatRarityScore, sortTraitsByRarity, RARITY_TIERS } from '@/utils/rarity';

interface RarityOverviewProps {
  rarityResult: NFTRarityResult;
}

export function RarityOverview({ rarityResult }: RarityOverviewProps) {
  const sortedTraits = sortTraitsByRarity(rarityResult.traits);
  const rarestTrait = sortedTraits[0];
  const rarestTierInfo = rarestTrait ? RARITY_TIERS[rarestTrait.tier] : null;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-[#fcee0a]/30 rounded-xl p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#fcee0a] mb-2">
          {rarityResult.metadata.name} #{rarityResult.metadata.id}
        </h2>
        <p className="text-gray-300 text-sm">
          {rarityResult.metadata.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Rarity Score */}
        <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="text-3xl font-bold text-[#fcee0a] mb-1">
            {formatRarityScore(rarityResult.totalRarityScore)}
          </div>
          <div className="text-gray-400 text-sm uppercase tracking-wide">
            Total Score
          </div>
        </div>

        {/* Rarest Trait */}
        {rarestTrait && rarestTierInfo && (
          <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div 
              className="text-2xl font-bold mb-1 flex items-center justify-center"
              style={{ color: rarestTierInfo.color }}
            >
              {rarestTierInfo.emoji}
              <span className="ml-2">{rarestTierInfo.label}</span>
            </div>
            <div className="text-gray-400 text-sm uppercase tracking-wide">
              Rarest Trait
            </div>
            <div className="text-white text-xs mt-1">
              {rarestTrait.trait_type.replace(/_/g, ' ')}: {rarestTrait.value}
            </div>
          </div>
        )}

        {/* Trait Count */}
        <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="text-3xl font-bold text-white mb-1">
            {rarityResult.traits.length}
          </div>
          <div className="text-gray-400 text-sm uppercase tracking-wide">
            Total Traits
          </div>
        </div>
      </div>

      {/* Rank (if available) */}
      {rarityResult.overallRank && (
        <div className="text-center p-4 bg-[#fcee0a]/10 border border-[#fcee0a]/30 rounded-lg">
          <div className="text-2xl font-bold text-[#fcee0a] mb-1">
            #{rarityResult.overallRank}
          </div>
          <div className="text-gray-300 text-sm">
            Rank in Collection
          </div>
        </div>
      )}

      {/* Rarity Distribution */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-white mb-3">Rarity Distribution</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {Object.entries(RARITY_TIERS).map(([tier, info]) => {
            const count = rarityResult.traits.filter(t => t.tier === tier).length;
            return (
              <div key={tier} className="text-center p-2 bg-gray-800/30 rounded">
                <div 
                  className="text-lg font-bold"
                  style={{ color: info.color }}
                >
                  {info.emoji} {count}
                </div>
                <div className="text-xs text-gray-400">
                  {info.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 
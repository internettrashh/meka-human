import { CalculatedRarity, RARITY_TIERS, formatRarityPercentage } from '@/utils/rarity';

interface TraitCardProps {
  trait: CalculatedRarity;
}

export function TraitCard({ trait }: TraitCardProps) {
  const tierInfo = RARITY_TIERS[trait.tier];

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-[#fcee0a]/50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-white text-sm uppercase tracking-wide">
            {trait.trait_type.replace(/_/g, ' ')}
          </h4>
          <p className="text-[#fcee0a] font-medium mt-1">
            {trait.value}
          </p>
        </div>
        <div className="text-right">
          <div 
            className="text-lg font-bold flex items-center"
            style={{ color: tierInfo.color }}
          >
            {tierInfo.emoji}
            <span className="ml-1 text-sm">{tierInfo.label}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Rarity:</span>
          <span className="text-white font-medium">
            {formatRarityPercentage(trait.rarity.percentage)}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Count:</span>
          <span className="text-white">
            {trait.rarity.count.toLocaleString()} / 3,000
          </span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Score:</span>
          <span className="text-[#fcee0a] font-bold">
            {trait.rarity.rarity_score.toFixed(1)}
          </span>
        </div>
        
        {/* Rarity Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
          <div 
            className="h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${Math.max(100 - trait.rarity.percentage, 5)}%`,
              backgroundColor: tierInfo.color
            }}
          />
        </div>
      </div>
    </div>
  );
} 
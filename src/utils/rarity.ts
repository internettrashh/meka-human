// Trait rarity tiers
export const RARITY_TIERS = {
  LEGENDARY: { min: 0, max: 1, color: '#FF6B35', emoji: '🔥', label: 'Legendary' },
  EPIC: { min: 1.1, max: 5, color: '#B83DFF', emoji: '💜', label: 'Epic' },
  RARE: { min: 5.1, max: 15, color: '#00D9FF', emoji: '💎', label: 'Rare' },
  UNCOMMON: { min: 15.1, max: 30, color: '#4AFF4A', emoji: '💚', label: 'Uncommon' },
  COMMON: { min: 30.1, max: 100, color: '#FFFFFF', emoji: '⚪', label: 'Common' }
} as const;

export interface NFTAttribute {
  trait_type: string;
  value: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
  id: number;
}

export interface TraitRarity {
  count: number;
  percentage: number;
  rarity_score: number;
}

export interface RarityData {
  trait_frequencies: Record<string, Record<string, number>>;
  trait_rarities: Record<string, Record<string, TraitRarity>>;
  [id: string]: any; // For NFT metadata entries
}

export interface CalculatedRarity {
  trait_type: string;
  value: string;
  rarity: TraitRarity;
  tier: keyof typeof RARITY_TIERS;
}

export interface NFTRarityResult {
  metadata: NFTMetadata;
  traits: CalculatedRarity[];
  totalRarityScore: number;
  overallRank?: number;
  assetId?: string;
}

// Load rarity data from public/data.json
export async function loadRarityData(): Promise<RarityData> {
  const response = await fetch('/data.json');
  if (!response.ok) {
    throw new Error('Failed to load rarity data');
  }
  return response.json();
}

// Determine rarity tier based on percentage
export function getRarityTier(percentage: number): keyof typeof RARITY_TIERS {
  for (const [tier, bounds] of Object.entries(RARITY_TIERS)) {
    if (percentage >= bounds.min && percentage <= bounds.max) {
      return tier as keyof typeof RARITY_TIERS;
    }
  }
  return 'COMMON';
}

// Calculate rarity for a single NFT
export function calculateNFTRarity(metadata: NFTMetadata, rarityData: RarityData): NFTRarityResult {
  const traits: CalculatedRarity[] = [];
  let totalRarityScore = 0;

  for (const attribute of metadata.attributes) {
    const traitRarity = rarityData.trait_rarities[attribute.trait_type]?.[attribute.value];
    
    if (traitRarity) {
      const tier = getRarityTier(traitRarity.percentage);
      traits.push({
        trait_type: attribute.trait_type,
        value: attribute.value,
        rarity: traitRarity,
        tier
      });
      totalRarityScore += traitRarity.rarity_score;
    }
  }

  return {
    metadata,
    traits,
    totalRarityScore
  };
}

// Get NFT metadata by ID from rarity data
export function getNFTMetadata(id: string, rarityData: RarityData): NFTMetadata | null {
  const nftData = rarityData[id];
  if (nftData && typeof nftData === 'object' && 'attributes' in nftData) {
    return nftData as NFTMetadata;
  }
  return null;
}

// Format rarity percentage for display
export function formatRarityPercentage(percentage: number): string {
  if (percentage < 0.01) {
    return '<0.01%';
  }
  if (percentage < 1) {
    return percentage.toFixed(2) + '%';
  }
  return percentage.toFixed(1) + '%';
}

// Format rarity score for display
export function formatRarityScore(score: number): string {
  if (score >= 1000) {
    return (score / 1000).toFixed(1) + 'K';
  }
  return score.toFixed(1);
}

// Sort traits by rarity (rarest first)
export function sortTraitsByRarity(traits: CalculatedRarity[]): CalculatedRarity[] {
  return [...traits].sort((a, b) => a.rarity.percentage - b.rarity.percentage);
}

// Get rarity rank among collection (if we have all NFT data)
export function calculateRarityRank(nftResult: NFTRarityResult, allNFTs: NFTRarityResult[]): number {
  const sortedByRarity = allNFTs.sort((a, b) => b.totalRarityScore - a.totalRarityScore);
  return sortedByRarity.findIndex(nft => nft.metadata.id === nftResult.metadata.id) + 1;
} 
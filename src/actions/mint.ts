// Mint API functions for the complete NFT minting workflow
const API_BASE_URL = 'https://vmi2322729.contaboserver.net/backend';

export interface EligibilityResponse {
  success: boolean;
  walletAddress: string;
  eligibility: {
    totalEligible: number;
    totalMinted: number;
    remainingToMint: number;
    canMintMore: boolean;
    maxBatchSize: number;
    eligibleAssets: number[];
    remainingAssets: number[];
  };
}

export interface MintStartResponse {
  success: boolean;
  sessionId: string;
  message: string;
  status: string;
  walletAddress: string;
  recipientProfileId: string;
  quantity: number;
  estimatedTime: string;
  rateLimit: {
    minDelay: string;
    maxBatchSize: number;
  };
}

export interface MintedAsset {
  assetBaseName: string;
  assetId: string;
  assetName: string;
  transferSuccess: boolean;
  transferId: string;
  transactionUrl: string;
}

export interface MintStatusResponse {
  success: boolean;
  status: 'in_progress' | 'completed' | 'failed';
  currentStep?: string;
  steps?: Array<{
    step: string;
    status: 'completed' | 'in_progress' | 'failed';
    assetBaseName?: string;
    assetId?: string;
    transferSuccess?: boolean;
    transferId?: string;
    assetIndex?: number;
    totalAssets?: number;
  }>;
  result?: {
    message: string;
    batchResults: {
      totalRequested: number;
      successfulMints: number;
      failedMints: number;
      successfulTransfers: number;
    };
    mintedAssets: MintedAsset[];
    failedAssets?: Array<{
      assetBaseName: string;
      error: string;
    }>;
  };
  error?: string;
  endTime?: string;
}

export interface MintedAssetsResponse {
  success: boolean;
  walletAddress: string;
  mintingHistory: {
    totalAttempts: number;
    successfulMints: number;
    inProgressMints: number;
    failedMints: number;
    successfulTransfers: number;
  };
  mintedAssets: Array<{
    assetBaseName: string;
    assetId: string;
    assetName: string;
    mekaNumber: string;
    mintedAt: string;
    sessionId: string;
    transferSuccess: boolean;
    transferId: string;
    transactionUrl: string;
    recipientProfileId: string;
  }>;
  inProgressAssets: Array<{
    assetBaseName: string;
    sessionId: string;
    startedAt: string;
    recipientProfileId: string;
  }>;
  failedAssets: any[];
}

// Check wallet mint eligibility
export async function checkMintEligibility(walletAddress: string): Promise<EligibilityResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/wallet/${walletAddress}/eligibility`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to check eligibility');
    }
    
    return data;
  } catch (error) {
    console.error('Error checking mint eligibility:', error);
    throw error;
  }
}

// Start minting process
export async function startMinting(
  walletAddress: string, 
  recipientProfileId: string, 
  quantity: number
): Promise<MintStartResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/mint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress,
        recipientProfileId,
        quantity,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to start minting');
    }
    
    return data;
  } catch (error) {
    console.error('Error starting mint:', error);
    throw error;
  }
}

// Poll minting status
export async function getMintStatus(sessionId: string): Promise<MintStatusResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/paid-mint/status/${sessionId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get mint status');
    }
    
    return data;
  } catch (error) {
    console.error('Error getting mint status:', error);
    throw error;
  }
}

// Get user's minted assets history
export async function getMintedAssets(walletAddress: string): Promise<MintedAssetsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/wallet/${walletAddress}/minted`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get minted assets');
    }
    
    return data;
  } catch (error) {
    console.error('Error getting minted assets:', error);
    throw error;
  }
}

// Get wallet summary
export async function getWalletSummary(walletAddress: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/wallet/${walletAddress}/summary`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get wallet summary');
    }
    
    return data;
  } catch (error) {
    console.error('Error getting wallet summary:', error);
    throw error;
  }
} 
export interface ArweaveTag {
  name: string;
  value: string;
}

export interface ArweaveTransaction {
  id: string;
  tags: ArweaveTag[];
  data: {
    size: string;
  };
  owner: {
    address: string;
  };
  block: {
    timestamp: number;
    height: number;
  };
}

export interface ArweaveQueryResponse {
  data: {
    transactions: {
      edges: Array<{
        node: ArweaveTransaction;
      }>;
    };
  };
}

// GraphQL query to fetch transaction data by ID
const ARWEAVE_QUERY = `
  query ($id: ID!) {
    transactions(
      ids: [$id]
      tags: [{name: "Data-Protocol", values: ["ao"]}]
      ingested_at: {min: 1696107600}
    ) {
      edges {
        node {
          id
          ingested_at
          recipient
          block {
            timestamp
            height
          }
          tags {
            name
            value
          }
          data {
            size
          }
          owner {
            address
          }
        }
      }
    }
  }
`;

// Fetch NFT metadata from Arweave using GraphQL
export async function fetchArweaveNFTData(assetId: string): Promise<ArweaveTransaction | null> {
  try {
    const response = await fetch('https://arweave-search.goldsky.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/graphql-response+json, application/graphql+json, application/json',
      },
      body: JSON.stringify({
        query: ARWEAVE_QUERY,
        variables: { id: assetId }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ArweaveQueryResponse = await response.json();
    
    if (data.data.transactions.edges.length === 0) {
      return null;
    }

    return data.data.transactions.edges[0].node;
  } catch (error) {
    console.error('Error fetching Arweave NFT data:', error);
    return null;
  }
}

// Extract metadata from Arweave transaction tags
export function extractMetadataFromTags(tags: ArweaveTag[]): any {
  const metadataTag = tags.find(tag => tag.name === 'Bootloader-OriginalMetadata');
  
  if (!metadataTag) {
    return null;
  }

  try {
    return JSON.parse(metadataTag.value);
  } catch (error) {
    console.error('Error parsing metadata:', error);
    return null;
  }
}

// Get specific tag value from transaction
export function getTagValue(tags: ArweaveTag[], tagName: string): string | null {
  const tag = tags.find(t => t.name === tagName);
  return tag ? tag.value : null;
}

// Get Meka number from tags
export function getMekaNumber(tags: ArweaveTag[]): string | null {
  return getTagValue(tags, 'Bootloader-MekaNumber');
}

// Get asset type from tags
export function getAssetType(tags: ArweaveTag[]): string | null {
  return getTagValue(tags, 'Asset-Type');
}

// Check if transaction is a valid Meka NFT
export function isValidMekaNFT(tags: ArweaveTag[]): boolean {
  const hasBootloader = tags.some(tag => tag.name === 'Bootloader-OriginalMetadata');
  const hasMekaNumber = tags.some(tag => tag.name === 'Bootloader-MekaNumber');
  const isVideoAsset = tags.some(tag => tag.name === 'Asset-Type' && tag.value === 'Video Asset');
  
  return hasBootloader && hasMekaNumber && isVideoAsset;
}

// Full workflow to get NFT metadata
export async function getMekaNFTMetadata(assetId: string) {
  const transaction = await fetchArweaveNFTData(assetId);
  
  if (!transaction) {
    throw new Error('NFT not found');
  }

  if (!isValidMekaNFT(transaction.tags)) {
    throw new Error('Not a valid Meka NFT');
  }

  const metadata = extractMetadataFromTags(transaction.tags);
  const mekaNumber = getMekaNumber(transaction.tags);
  const assetType = getAssetType(transaction.tags);

  return {
    transaction,
    metadata,
    mekaNumber,
    assetType,
    assetId
  };
} 
import { Background } from '@/components/background'
import { Card, CardContent } from '@/components/ui/card'
import { useConnection, useActiveAddress } from '@arweave-wallet-kit/react'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePermawebProvider } from '@/providers/PermawebProvider'
import { ExternalLink, X, Wallet, Copy, Check, AlertCircle } from 'lucide-react'
import { createDataItemSigner, dryrun, message } from "@permaweb/aoconnect"

// Types for AO responses
interface Tag {
  name: string;
  value: string;
}

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
  const safeTotal = Math.max(total, 1);
  const safeCurrent = Math.min(Math.max(current, 0), safeTotal);
  const percentage = Math.min((safeCurrent / safeTotal) * 100, 100);

  return (
    <div className="w-full bg-gray-700 rounded-full h-2">
      <div 
        className="bg-[#fcee0a] h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// Quantity slider component
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

// Payment configuration
const PAYMENT_CONFIG = {
  recipientAddress: 'TqcUc15NJ2U5OxbXEUu2DkUYvYFyIADS6Wi-_A8-e7M',
  tokenId: 'xU9zFkq3X2ZQ6olwNVvr1vUWIjc3kXTWr7xKQD6dh10',
  pricePerNFT: '1000000000000', // 1 WAR (12 decimals)
  maxQuantity: 10,
  decimals: 12 // wAR token uses 12 decimals
};

// API configuration
const API_BASE_URL = 'https://vmi2322729.contaboserver.net/backend';

// API functions
const createMintingSession = async (walletAddress: string, quantity: number, recipientProfileId?: string) => {
  const requestBody: any = {
    walletAddress,
    quantity
  };
  
  // Include recipientProfileId if provided
  if (recipientProfileId) {
    requestBody.recipientProfileId = recipientProfileId;
  }
  
  const response = await fetch(`${API_BASE_URL}/paid-mint/create-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });
  
  if (!response.ok) {
    throw new Error('Failed to create minting session');
  }
  
  return response.json();
};

const verifyPayment = async (sessionId: string, txId: string) => {
  const response = await fetch(`${API_BASE_URL}/paid-mint/verify-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionId,
      txId
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to verify payment');
  }
  
  return response.json();
};

const getSessionStatus = async (sessionId: string) => {
  // Use the universal status endpoint for both regular and paid minting
  const response = await fetch(`${API_BASE_URL}/paid-mint/status/${sessionId}`);
  
  if (!response.ok) {
    throw new Error('Failed to get session status');
  }
  
  return response.json();
};

// Types
interface PaidMintSession {
  sessionId: string;
  sessionType: 'paid_minting' | 'regular_minting';
  status: 'pending_payment' | 'payment_verified' | 'minting' | 'completed' | 'failed' | 'expired' | 'started' | 'in_progress';
  walletAddress: string;
  recipientProfileId?: string;
  quantity: number;
  paymentRequired?: {
    total: {
      winstons: string;
      ar: string;
    };
    perNFT: {
      winstons: string;
      ar: string;
    };
    recipient: string;
    tokenId: string;
  };
  paymentAmount?: {
    winstons: string;
    ar: string;
  };
  txId?: string;
  mintedAssets?: Array<{
    assetId: string;
    assetBaseName: string;
    transferId: string;
  }>;
  error?: string;
  expiresAt?: string;
  isExpired: boolean;
  timeToExpiry?: number;
}

// NFT Grid Component
interface MintedNFT {
  assetId: string;
  assetBaseName: string;
  transferId: string;
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
                      {nft.assetBaseName.charAt(0)}
                    </span>
                  </div>
                  <div className="text-white text-xs font-medium">
                    {nft.assetBaseName}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    {nft.assetId.slice(0, 6)}...
                  </div>
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-center text-white">
                <ExternalLink className="w-6 h-6 mx-auto mb-2 text-[#fcee0a]" />
                <div className="text-xs font-medium">View on Bazar</div>
              </div>
            </div>

            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Minted
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <div className="text-white text-sm font-medium truncate">
                {nft.assetBaseName}
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
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-sm mx-4 bg-[#121211] border border-[#646464] rounded-lg p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-[#fcee0a]/10 rounded-full flex items-center justify-center">
            <Wallet className="w-8 h-8 text-[#fcee0a]" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-2 [font-family:'Space_Grotesk',Helvetica]">
              Connect Your Wallet
            </h3>
            <p className="text-gray-400 text-sm [font-family:'Open_Sans',Helvetica]">
              You need to connect your wallet to purchase and mint NFTs.
            </p>
          </div>

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

// Copy to clipboard component
const CopyButton = ({ text, label }: { text: string; label: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#fcee0a] transition-colors"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Copied!' : `Copy ${label}`}
    </button>
  );
};

type MintingState = 'idle' | 'quantity-selection' | 'checking-rns' | 'rns-required' | 'checking-balance' | 'session-created' | 'payment-ready' | 'payment-sent' | 'verifying-payment' | 'minting' | 'minting-in-progress' | 'completed' | 'error';

function PaidMintingInterface() {
  const connected = useConnection();
  const activeAddress = useActiveAddress();
  const navigate = useNavigate();
  const { getProfileIdFromWallet } = usePermawebProvider();
  
  // State management
  const [state, setState] = useState<MintingState>('quantity-selection'); // Allow anyone to mint
  const [quantity, setQuantity] = useState(1);
  const [session, setSession] = useState<PaidMintSession | null>(null);
  const [paymentTxId, setPaymentTxId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [mintProgress, setMintProgress] = useState<any>(null);
  const [userBalance, setUserBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  
  // Check if user is on mobile
  const isMobile = () => {
    return window.innerWidth < 1024;
  };
  
  // Scramble effects
  const scrambledBuyText = useScrambleText("BUY MEKAID NFTs", state === 'quantity-selection');
  const scrambledCheckingText = useScrambleText("CHECKING BALANCE", state === 'checking-balance');
  const scrambledPaymentText = useScrambleText("PAYMENT READY", state === 'payment-ready');
  const scrambledMintingText = useScrambleText("MINTING IN PROGRESS", state === 'minting');

  // Check user's token balance and create session
  const checkBalanceAndCreateSession = useCallback(async () => {
    if (!connected || !activeAddress) {
      setErrorMessage('Wallet not connected.');
      setState('error');
      setIsLoading(false);
      return false;
    }

    try {
      setState('checking-balance');
      setIsLoading(true);
      setErrorMessage('');
      
      // Step 1: Check balance using AO dryrun with correct process ID
      console.log('Starting balance check with dryrun...');
      console.log('Process ID:', PAYMENT_CONFIG.tokenId);
      console.log('Active Address:', activeAddress);
      
      const balanceResponse = await dryrun({
        process: PAYMENT_CONFIG.tokenId,
        tags: [
          { name: "Action", value: "Balance" },
          { name: "Recipient", value: activeAddress },
          { name: "Data-Protocol", value: "ao" },
          { name: "Type", value: "Message" },
          { name: "Variant", value: "ao.TN.1" }
        ],
        Owner: activeAddress
      });
      
      // console.log('=== FULL DRYRUN RESPONSE ===');
      // console.log(JSON.stringify(balanceResponse, null, 2));
      // console.log('=== END DRYRUN RESPONSE ===');
      
      const balanceData = balanceResponse;
      
      // Parse balance from API response with error handling
      if (!balanceData.Messages || balanceData.Messages.length === 0) {
        console.error('No messages in response:', balanceData);
        throw new Error('No balance response received from API');
      }
      
      console.log('Messages found:', balanceData.Messages.length);
      console.log('First message:', balanceData.Messages[0]);
      console.log('First message tags:', balanceData.Messages[0]?.Tags);
      
      const balanceTag = balanceData.Messages[0]?.Tags?.find((tag: Tag) => tag.name === "Balance");
      const balanceInWinstons = balanceTag?.value || "0";
      
      console.log('Balance tag found:', balanceTag);
      console.log('Balance in winstons (raw):', balanceInWinstons);
      console.log('Balance in winstons (type):', typeof balanceInWinstons);
      
      // Validate balance is a valid number
      if (!/^\d+$/.test(balanceInWinstons)) {
        throw new Error('Invalid balance format received from API');
      }
      
      // Store the balance in winstons for calculations
      setUserBalance(balanceInWinstons);
      
      // Test different decimal places to find the correct one
      const balanceWith18Decimals = (Number(balanceInWinstons) / 1e18);
      const balanceWith12Decimals = (Number(balanceInWinstons) / 1e12);
      const balanceWith6Decimals = (Number(balanceInWinstons) / 1e6);
      
      // console.log(`User balance: ${balanceInWinstons} winstons`);
      // console.log('With 18 decimals (1e18):', balanceWith18Decimals, 'WAR');
      // console.log('With 12 decimals (1e12):', balanceWith12Decimals, 'WAR');
      // console.log('With 6 decimals (1e6):', balanceWith6Decimals, 'WAR');
      
      // Based on your expectation of 0.1 WAR from 100000000000, it should be 12 decimals
      const balanceInAR = balanceWith12Decimals;
      
      // Calculate required amount in winstons
      const requiredAmount = BigInt(PAYMENT_CONFIG.pricePerNFT) * BigInt(quantity);
      const userBalanceBigInt = BigInt(balanceInWinstons);
      
      if (userBalanceBigInt < requiredAmount) {
        const requiredAR = (Number(requiredAmount) / 1e12).toFixed(1);
        const availableAR = (Number(balanceInWinstons) / 1e12).toFixed(1);
        setErrorMessage(`Insufficient balance for purchase. Required: ${requiredAR} WAR, Available: ${availableAR} WAR`);
        setState('error');
        setIsLoading(false);
        return false;
      }
      
      // Step 2: Create session after balance verification
      setState('session-created');
      const profileId = await getProfileIdFromWallet(activeAddress);
      
      if (!profileId) {
        setErrorMessage('Could not get profile ID from wallet address. Please try again.');
        setState('error');
        setIsLoading(false);
        return false;
      }
      
      console.log('Profile ID for minting session:', profileId);
      
      const sessionResult = await createMintingSession(activeAddress, quantity, profileId);
      setSession(sessionResult);
      setState('payment-ready');
      setIsLoading(false);
      
      return true;
    } catch (error: any) {
      console.error('Balance check or session creation failed:', error);
      setErrorMessage(error.message || 'Failed to verify balance or create session. Please try again.');
      setState('error');
      setIsLoading(false);
      return false;
    }
  }, [connected, activeAddress, quantity, getProfileIdFromWallet]);

  // Simplified function to create session with balance checking
  const handleCreateSession = useCallback(async () => {
    // Strict wallet connection check - prevent any action without wallet
    if (!connected || !activeAddress) {
      setErrorMessage('Wallet must be connected to proceed.');
      setState('error');
      return;
    }

    await checkBalanceAndCreateSession();
  }, [connected, activeAddress, checkBalanceAndCreateSession]);

  // Send payment function - only called when user clicks Pay Now
  const handleSendPayment = useCallback(async () => {
    if (!connected || !activeAddress || !session) {
      setErrorMessage('Session not found or wallet not connected.');
      setState('error');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      
      const totalAmount = (BigInt(PAYMENT_CONFIG.pricePerNFT) * BigInt(quantity)).toString();
      
      // Send payment using AO message function
      const paymentResponse = await message({
        process: PAYMENT_CONFIG.tokenId,
        tags: [
          { name: "Action", value: "Transfer" },
          { name: "Recipient", value: PAYMENT_CONFIG.recipientAddress },
          { name: "Quantity", value: totalAmount },
          { name: "Session-Id", value: session.sessionId }
        ],
        signer: createDataItemSigner(window.arweaveWallet),
        data: "",
      });

      const transactionId = paymentResponse;

      // Only set payment-sent state if we actually got a transaction ID
      if (transactionId && transactionId.trim() !== '') {
        setPaymentTxId(transactionId);
        setState('payment-sent');
        
        // Auto-verify payment after a short delay
        setTimeout(() => {
          handleVerifyPayment(transactionId);
        }, 3000);
      } else {
        throw new Error('No transaction ID received from payment');
      }
      
    } catch (error: any) {
      console.error('Payment failed:', error);
      setErrorMessage(error.message || 'Failed to send payment. Please try again.');
      setState('error');
      setIsLoading(false);
    }
  }, [connected, activeAddress, session, quantity]);



  // Verify payment
  const handleVerifyPayment = useCallback(async (txId?: string) => {
    if (!session) {
      setErrorMessage('No session found.');
      setState('error');
      setIsLoading(false);
      return;
    }

    const transactionId = txId || paymentTxId;
    if (!transactionId || transactionId.trim() === '') {
      setErrorMessage('No valid transaction ID provided for verification.');
      setState('error');
      setIsLoading(false);
      return;
    }

    console.log(`Verifying payment with transaction ID: ${transactionId}`);
    setState('verifying-payment');
    setErrorMessage('');

    try {
      const result = await verifyPayment(session.sessionId, transactionId);
      
      if (result.success) {
        console.log('Payment verified successfully, starting minting...');
        setState('minting');
        // Start polling for minting status
        pollMintingStatus(session.sessionId);
      } else {
        console.log('Payment verification failed:', result);
        setErrorMessage('Payment verification failed. Please try again.');
        setState('error');
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
      setErrorMessage(error.message || 'Failed to verify payment. Please try again.');
      setState('error');
      setIsLoading(false);
    }
  }, [session, paymentTxId]);

  // Poll minting status with proper interval management
  const pollMintingStatus = useCallback(async (sessionId: string) => {
    let localPollCount = 0;
    const maxPolls = 60; // 5 minutes max (60 * 5 seconds)
    
    setIsPolling(true);
    setPollCount(0);
    
    const pollInterval = setInterval(async () => {
      localPollCount++;
      setPollCount(localPollCount);
      
      try {
        console.log(`Polling mint status (attempt ${localPollCount}/${maxPolls})...`);
        const status = await getSessionStatus(sessionId);
        
        if (status.success && status.session) {
          const sessionData = status.session;
          setSession(sessionData);
          
          console.log(`Session type: ${sessionData.sessionType}, status: ${sessionData.status}`);
          
          // Handle different session types and statuses
          if (sessionData.status === 'completed') {
            console.log('Minting completed!');
            clearInterval(pollInterval);
            setState('completed');
            setMintProgress(sessionData);
            setIsLoading(false);
            setIsPolling(false);
          } else if (sessionData.status === 'failed') {
            console.log('Minting failed:', sessionData.error);
            clearInterval(pollInterval);
            setErrorMessage(sessionData.error || 'Minting failed. Please try again.');
            setState('error');
            setIsLoading(false);
            setIsPolling(false);
          } else if (sessionData.status === 'expired') {
            console.log('Session expired');
            clearInterval(pollInterval);
            setErrorMessage('Session expired. Please try again.');
            setState('error');
            setIsLoading(false);
            setIsPolling(false);
          } else if (sessionData.status === 'minting' || sessionData.status === 'in_progress') {
            // Update progress if we have minted assets
            if (sessionData.mintedAssets && sessionData.mintedAssets.length > 0) {
              console.log(`Minted ${sessionData.mintedAssets.length}/${quantity} NFTs`);
            }
            // Set state to minting-in-progress for better UX
            if (sessionData.status === 'in_progress') {
              setState('minting-in-progress');
            }
          } else if (sessionData.status === 'payment_verified') {
            console.log('Payment verified, minting should start soon...');
            setState('minting');
          } else if (sessionData.status === 'pending_payment') {
            console.log('Payment still pending...');
          } else if (sessionData.status === 'started') {
            console.log('Minting started...');
            setState('minting');
          }
        } else {
          console.log('Invalid status response:', status);
        }
        
        // Stop polling if we've reached max attempts
        if (localPollCount >= maxPolls) {
          clearInterval(pollInterval);
          setErrorMessage('Minting is taking longer than expected. Please check your wallet for the minted NFTs.');
          setState('error');
          setIsLoading(false);
          setIsPolling(false);
        }
      } catch (error: any) {
        console.error('Polling error:', error);
        clearInterval(pollInterval);
        setErrorMessage('Error checking mint status. Please refresh and try again.');
        setState('error');
        setIsLoading(false);
        setIsPolling(false);
      }
    }, 5000); // Poll every 5 seconds

    // Cleanup function
    return () => {
      clearInterval(pollInterval);
      setIsPolling(false);
    };
  }, [quantity]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      setIsPolling(false);
      setPollCount(0);
    };
  }, []);

  // Auto-connect behavior - skip RNS check for public minting
  useEffect(() => {
    if (connected && activeAddress && state === 'idle') {
      // Skip RNS check and go directly to quantity selection
      setState('quantity-selection');
    }
  }, [connected, activeAddress, state]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      setIsPolling(false);
      setPollCount(0);
    };
  }, []);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      setIsPolling(false);
      setPollCount(0);
    };
  }, []);

  // Calculate total cost
  const totalCost = {
    winstons: (BigInt(PAYMENT_CONFIG.pricePerNFT) * BigInt(quantity)).toString(),
    ar: (parseFloat(PAYMENT_CONFIG.pricePerNFT) / Math.pow(10, PAYMENT_CONFIG.decimals) * quantity).toFixed(1)
  };

  // Get status display
  const getStatusDisplay = () => {
    switch (state) {
      case 'checking-rns':
        return {
          title: 'CHECKING WALLET',
          message: 'Verifying your wallet...',
          messageColor: 'text-yellow-400',
          showControls: false
        };
      
      case 'rns-required':
        // This state should not be reached anymore, but keep it for safety
        return {
          title: 'PUBLIC MINTING AVAILABLE',
          message: 'Anyone can mint now! Connect your wallet to get started.',
          messageColor: 'text-[#fcee0a]',
          showControls: true
        };
      
      case 'quantity-selection':
        return {
          title: scrambledBuyText,
          message: connected && activeAddress ?
            `Select quantity (1 WAR per NFT)` :
            `Connect wallet to select quantity and mint`,
          messageColor: connected && activeAddress ? 'text-[#fcee0a]' : 'text-red-400',
          showControls: connected && activeAddress
        };
      
      case 'checking-balance':
        return {
          title: scrambledCheckingText,
          message: 'Checking your WAR token balance...',
          messageColor: 'text-yellow-400',
          showControls: false
        };
      
      case 'session-created':
        return {
          title: 'SESSION CREATED',
          message: 'Session created successfully, preparing payment...',
          messageColor: 'text-green-400',
          showControls: false
        };
      
      case 'payment-ready':
        return {
          title: scrambledPaymentText,
          message: 'Ready to send payment - click Pay Now to proceed',
          messageColor: 'text-yellow-400',
          showControls: false
        };
      
      case 'payment-sent':
        return {
          title: 'PAYMENT SENT',
          message: paymentTxId ? 
            `Payment sent successfully (TX: ${paymentTxId.slice(0, 8)}...), verifying...` : 
            'Payment sent successfully, verifying...',
          messageColor: 'text-yellow-400',
          showControls: false
        };
      
      case 'verifying-payment':
        return {
          title: 'VERIFYING PAYMENT',
          message: paymentTxId ? 
            `Verifying transaction ${paymentTxId.slice(0, 8)}...` : 
            'Please wait while we verify your payment...',
          messageColor: 'text-yellow-400',
          showControls: false
        };
      
      case 'minting':
        return {
          title: scrambledMintingText,
          message: `Minting ${quantity} NFT${quantity > 1 ? 's' : ''}... (${session?.mintedAssets?.length || 0}/${quantity} completed)`,
          messageColor: 'text-[#fcee0a]',
          showControls: false
        };
      
      case 'minting-in-progress':
        return {
          title: 'MINTING IN PROGRESS',
          message: `Processing ${quantity} NFT${quantity > 1 ? 's' : ''}... (${session?.mintedAssets?.length || 0}/${quantity} completed)`,
          messageColor: 'text-[#fcee0a]',
          showControls: false
        };
      
      case 'completed':
        return {
          title: 'MINTING COMPLETED!',
          message: `Successfully minted ${session?.mintedAssets?.length || 0} NFT${session?.mintedAssets?.length !== 1 ? 's' : ''}`,
          messageColor: 'text-green-400',
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
          title: connected && activeAddress ? `${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}` : 'Connect Wallet to Buy',
          message: 'Connect your wallet to purchase MEKA NFTs',
          messageColor: 'text-gray-400',
          showControls: false
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <Background>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="[font-family:'Space_Grotesk',Helvetica] font-bold text-[#fcee0a] text-2xl sm:text-3xl lg:text-4xl tracking-[1.5px] lg:tracking-[2px] leading-tight">
                BUY MEKAID NFTs
              </h1>
              <div 
                className="w-full max-w-[280px] sm:max-w-[320px] h-[3px] bg-[url(/line-seperator.svg)] bg-no-repeat bg-center mx-auto"
                style={{ 
                  backgroundSize: 'contain',
                  filter: 'brightness(0) saturate(100%) invert(92%) sepia(97%) saturate(1352%) hue-rotate(348deg) brightness(103%) contrast(103%)',
                }}
              />
              <p className="[font-family:'Space_Grotesk',Helvetica] font-normal text-[#c4c4c4] text-sm sm:text-base tracking-[1.20px]">
                Public Minting Now Available
              </p>
            </div>
          </div>

          {/* Status Card */}
          <Card className="w-full max-w-3xl mx-auto border-[0.5px] border-solid border-[#646464] rounded-lg bg-black/50 backdrop-blur-sm mb-8">
            <CardContent className="flex flex-col items-center p-6 sm:p-8 justify-center min-h-[300px] space-y-6">
              <div className="flex flex-col items-center w-full">
                <div className={`[font-family:'Space_Grotesk',Helvetica] font-bold text-lg sm:text-xl text-center tracking-[0] leading-7 ${
                  state === 'quantity-selection' || state === 'completed' ? 'text-[#fcee0a]' : 'text-white'
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
              {state === 'quantity-selection' && connected && activeAddress && (
                <div className="w-full max-w-md space-y-4">
                  {/* RNS Ownership Badge */}
                 
                  
                 
                  
                  
                  <QuantitySlider 
                    max={PAYMENT_CONFIG.maxQuantity}
                    value={quantity}
                    onChange={setQuantity}
                  />
                  <div className="text-center">
                    <div className="text-[#fcee0a] text-lg font-bold">
                      Total: {totalCost.ar} WAR
                    </div>
                    
                  </div>
                </div>
              )}

              {/* Payment Instructions */}
              {state === 'payment-ready' && session && !paymentTxId && (
                <div className="w-full max-w-md space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                    <div className="text-center text-[#fcee0a] font-bold">
                      Payment Required: {session.paymentRequired?.total.ar || session.paymentAmount?.ar || '0'} WAR
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Recipient:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-mono">{PAYMENT_CONFIG.recipientAddress.slice(0, 8)}...</span>
                          <CopyButton text={PAYMENT_CONFIG.recipientAddress} label="address" />
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">Amount:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-mono">{session.paymentRequired?.total.ar || session.paymentAmount?.ar || '0'}</span>
                          <CopyButton text={session.paymentRequired?.total.winstons || session.paymentAmount?.winstons || '0'} label="amount" />
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">Session ID:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-mono">{session.sessionId.slice(0, 8)}...</span>
                          <CopyButton text={session.sessionId} label="session" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSendPayment}
                    disabled={isLoading}
                    className={`relative w-full h-12 group ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
                    }`}
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
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </div>
                      ) : (
                        'Pay Now'
                      )}
                    </div>
                  </button>
                </div>
              )}

              {/* Payment Status Display */}
              {paymentTxId && (state === 'payment-sent' || state === 'verifying-payment') && (
                <div className="w-full max-w-md space-y-4">
                  <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                    <div className="text-center text-[#fcee0a] font-bold">
                      Transaction ID: {paymentTxId.slice(0, 12)}...
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className="text-white font-medium">
                          {state === 'payment-sent' ? 'Payment Sent' : 'Verifying Payment'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">Amount:</span>
                        <span className="text-white font-mono">{session?.paymentRequired?.total.ar || session?.paymentAmount?.ar || '0'} WAR</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">Session:</span>
                        <span className="text-white font-mono">{session?.sessionId.slice(0, 8)}...</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-4 h-4 border-2 border-[#fcee0a] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <div className="text-sm text-gray-400 mt-2">
                      {state === 'payment-sent' ? 'Processing payment...' : 'Verifying transaction...'}
                    </div>
                  </div>
                </div>
              )}

              {/* Minting Progress */}
              {(state === 'minting' || state === 'minting-in-progress') && (
                <div className="w-full max-w-md space-y-4">
                  <ProgressBar current={session?.mintedAssets?.length || 0} total={quantity} />
                  <div className="text-center space-y-2">
                    <div className="text-sm text-gray-400">
                      {session?.mintedAssets?.length || 0}/{quantity} NFTs minted
                    </div>
                    
                  </div>
                </div>
              )}

              {/* RNS Checking Loading */}
              {state === 'checking-rns' && (
                <div className="w-full max-w-md space-y-4">
                  <div className="text-center space-y-4">
                    <div className="w-8 h-8 border-2 border-[#fcee0a] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <div className="text-sm text-gray-400">
                      Checking ARNS ownership...
                    </div>
                  </div>
                </div>
              )}

              {/* RNS Required Message - Now allows continuation */}
              {state === 'rns-required' && (
                <div className="w-full max-w-md space-y-4">
                  <div className="bg-[#fcee0a]/10 border border-[#fcee0a]/30 rounded-lg p-6 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-[#fcee0a]/20 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-[#fcee0a]" />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold text-[#fcee0a] mb-2">
                        🎉 Public Minting Available!
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Anyone can mint now! No ARNS name required.
                        Continue to select your quantity and mint your MEKAID NFTs.
                      </p>
                    </div>
                    
                    <button
                      onClick={() => setState('quantity-selection')}
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
                        Continue to Mint
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Minted NFTs Display */}
              {state === 'completed' && session?.mintedAssets && session.mintedAssets.length > 0 && (
                <div className="w-full">
                  <NFTGrid nfts={session.mintedAssets} />
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

            {/* Main Action Button - Only show for non-phase2-closed states */}
            {(state === 'idle' || state === 'error' || state === 'quantity-selection' || state === 'rns-required') && (
              <button 
                onClick={state === 'quantity-selection' && connected && activeAddress ? handleCreateSession : () => {
                  if (!connected || !activeAddress) {
                    if (isMobile()) {
                      setShowConnectModal(true);
                    } else {
                      setErrorMessage('Please connect your wallet first.');
                      setState('error');
                    }
                  } else if (state === 'rns-required') {
                    // Go directly to quantity selection for public minting
                    setState('quantity-selection');
                  } else {
                    setState('quantity-selection');
                  }
                }}
                disabled={isLoading || (state === 'quantity-selection' && (!connected || !activeAddress))}
                className={`relative w-[200px] sm:w-[240px] h-[50px] sm:h-[60px] order-1 sm:order-2 transition-opacity ${
                  isLoading || (state === 'quantity-selection' && (!connected || !activeAddress)) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
                }`}
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
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  ) : (
                    state === 'quantity-selection' ?
                      (connected && activeAddress ? 'MINT NOW ' : 'Connect Wallet') :
                    state === 'rns-required' ?
                      'Continue to Mint' :
                      'Start Purchase'
                  )}
                </div>
              </button>
            )}

            {/* Buy More Button for completed state */}
            {state === 'completed' && (
              <button 
                onClick={() => {
                  setState('quantity-selection');
                  setSession(null);
                  setPaymentTxId('');
                  setQuantity(1);
                  setErrorMessage('');
                  setIsLoading(false);
                  setMintProgress(null);
                }}
                className="relative w-[200px] sm:w-[240px] h-[50px] sm:h-[60px] order-1 sm:order-2 hover:opacity-80 transition-opacity"
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
                  Buy More
                </div>
              </button>
            )}
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

export default PaidMintingInterface;

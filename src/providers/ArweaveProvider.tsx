import React from 'react';
import { useConnection, useActiveAddress } from '@arweave-wallet-kit/react';

interface ArweaveContextState {
  wallet: any | null;
  connected: boolean;
  address: string | null;
}

const ArweaveContext = React.createContext<ArweaveContextState>({
  wallet: null,
  connected: false,
  address: null,
});

export function useArweaveProvider(): ArweaveContextState {
  return React.useContext(ArweaveContext);
}

export function ArweaveProvider(props: { children: React.ReactNode }) {
  const { connected } = useConnection();
  const address = useActiveAddress();

  // Get the wallet instance from the global window object
  const [wallet, setWallet] = React.useState<any>(null);

  React.useEffect(() => {
    if (connected && typeof window !== 'undefined' && (window as any).arweaveWallet) {
      setWallet((window as any).arweaveWallet);
    } else {
      setWallet(null);
    }
  }, [connected]);

  return (
    <ArweaveContext.Provider 
      value={{ 
        wallet, 
        connected, 
        address: address || null 
      }}
    >
      {props.children}
    </ArweaveContext.Provider>
  );
} 
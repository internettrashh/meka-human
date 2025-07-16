import React from 'react';
import Arweave from 'arweave';
import { connect, createDataItemSigner } from '@permaweb/aoconnect';
// @ts-ignore - No type declarations available for @permaweb/libs
import Permaweb from '@permaweb/libs';
import { useArweaveProvider } from './ArweaveProvider';

interface PermawebContextState {
  libs: any | null;
  getProfileIdFromWallet: (walletAddress: string) => Promise<string | null>;
}

const PermawebContext = React.createContext<PermawebContextState>({
  libs: null,
  getProfileIdFromWallet: async () => null,
});

export function usePermawebProvider(): PermawebContextState {
  return React.useContext(PermawebContext);
}

export function PermawebProvider(props: { children: React.ReactNode }) {
  const arProvider = useArweaveProvider();
  const [libs, setLibs] = React.useState<any>(null);

  React.useEffect(() => {
    const dependencies: any = { 
      //@ts-ignore
      ao: connect(), 
      arweave: Arweave.init({
        host: 'arweave.net',
        port: 443,
        protocol: 'https'
      }) 
    };
    if (arProvider.wallet) {
      dependencies.signer = createDataItemSigner(arProvider.wallet);
    }

    const permawebInstance = Permaweb.init(dependencies);
    setLibs(permawebInstance);
  }, [arProvider.wallet]);

  const getProfileIdFromWallet = React.useCallback(async (walletAddress: string): Promise<string | null> => {
    if (!libs) {
      console.warn('Permaweb libs not initialized');
      return null;
    }

    try {
      const profile = await libs.getProfileByWalletAddress(walletAddress);
      console.log('Fetched profile ID:', profile?.id);
      return profile?.id || null;
    } catch (error) {
      console.error('Error fetching profile from wallet address:', error);
      return null;
    }
  }, [libs]);

  return (
    <PermawebContext.Provider 
      value={{ 
        libs,
        getProfileIdFromWallet 
      }}
    >
      {props.children}
    </PermawebContext.Provider>
  );
} 
import { useState } from 'react';
import { Search, Loader } from 'lucide-react';

interface NFTSelectorProps {
  onSearch: (query: string) => void;
  loading?: boolean;
  error?: string;
}

export function NFTSelector({ onSearch, loading = false, error }: NFTSelectorProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            Check Your NFT Rarity
          </h3>
          <p className="text-gray-400 text-sm">
            Enter your Asset ID or Meka Number to see detailed rarity information
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Asset ID (e.g., zsdYojNFvPy7SH5ecFp4ctMoY_92meEQqGzNykL27bo) or Meka # (e.g., 1646)"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#fcee0a] focus:outline-none transition-colors"
              disabled={loading}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {loading ? (
                <Loader className="w-5 h-5 text-[#fcee0a] animate-spin" />
              ) : (
                <Search className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="w-full px-6 py-3 bg-[#fcee0a] text-black font-semibold rounded-lg hover:bg-[#fcee0a]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Analyzing...' : 'Check Rarity'}
          </button>
        </form>

        {error && (
          <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-300 text-sm text-center">
              {error}
            </p>
          </div>
        )}

        <div className="text-center">
          <p className="text-gray-500 text-xs">
             Tip: You can find your Asset ID on{' '}
            <a 
              href="https://bazar.ar.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#fcee0a] hover:underline"
            >
              Bazar
            </a>
            {' '}or in your wallet
          </p>
        </div>
      </div>
    </div>
  );
} 

import React, { useState } from 'react';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';

interface StockInputFormProps {
  onSubmit: (ticker: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

export const StockInputForm: React.FC<StockInputFormProps> = ({ onSubmit, isLoading, disabled }) => {
  const [ticker, setTicker] = useState<string>('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ticker.trim()) return;
    onSubmit(ticker.toUpperCase());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
      <label htmlFor="stockTicker" className="sr-only">
        Stock Ticker
      </label>
      <input
        id="stockTicker"
        type="text"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        placeholder="Enter NASDAQ Ticker (e.g., AAPL)"
        className="flex-grow w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Stock Ticker Input"
        disabled={isLoading || disabled}
      />
      <button
        type="submit"
        disabled={isLoading || disabled || !ticker.trim()}
        className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          <>
            <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
            Get Signal
          </>
        )}
      </button>
    </form>
  );
};
    
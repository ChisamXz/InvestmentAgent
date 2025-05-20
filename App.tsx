
import React, { useState, useCallback } from 'react';
import { StockInputForm } from './components/StockInputForm';
import { SignalDisplayCard } from './components/SignalDisplayCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { generateInvestmentSignal } from './services/geminiService';
import type { SignalData } from './types';
import { InfoIcon } from './components/icons/InfoIcon';

const App: React.FC = () => {
  const [signalData, setSignalData] = useState<SignalData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyAvailable, setApiKeyAvailable] = useState<boolean>(true);

  React.useEffect(() => {
    if (!process.env.API_KEY) {
      setError("Gemini API Key is not configured. Please set the API_KEY environment variable.");
      setApiKeyAvailable(false);
    }
  }, []);

  const handleFetchSignal = useCallback(async (stockTicker: string) => {
    if (!apiKeyAvailable) {
      setError("Gemini API Key is not configured. Cannot fetch signal.");
      return;
    }
    if (!stockTicker.trim()) {
      setError("Please enter a stock ticker.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSignalData(null);

    try {
      // Use process.env.API_KEY directly as per requirements
      const apiKey = process.env.API_KEY as string; 
      const data = await generateInvestmentSignal(apiKey, stockTicker);
      setSignalData(data);
    } catch (err) {
      console.error("Error fetching signal:", err);
      if (err instanceof Error) {
        setError(`Failed to fetch signal: ${err.message}. Ensure the stock ticker is valid and the API key is correct.`);
      } else {
        setError("An unknown error occurred while fetching the signal.");
      }
      setSignalData(null);
    } finally {
      setIsLoading(false);
    }
  }, [apiKeyAvailable]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-slate-100 flex flex-col items-center p-4 sm:p-8">
      <header className="w-full max-w-3xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
          AI Investment Signal Agent
        </h1>
        <p className="mt-3 text-slate-300 text-sm sm:text-base">
          Enter a NASDAQ stock ticker to get a hypothetical daily signal, target price, and reasoning.
        </p>
      </header>

      <main className="w-full max-w-xl bg-slate-800 shadow-2xl rounded-lg p-6 sm:p-8">
        <StockInputForm onSubmit={handleFetchSignal} isLoading={isLoading} disabled={!apiKeyAvailable} />

        {isLoading && (
          <div className="mt-8 flex justify-center">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <div className="mt-6 bg-red-700/50 border border-red-500 text-red-200 px-4 py-3 rounded-md relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {!isLoading && signalData && (
          <div className="mt-8">
            <SignalDisplayCard data={signalData} />
          </div>
        )}

        {!isLoading && !signalData && !error && apiKeyAvailable && (
          <div className="mt-8 text-center text-slate-400">
            <p>Enter a stock ticker symbol (e.g., AAPL, MSFT, GOOGL) to begin.</p>
          </div>
        )}
      </main>
      
  
    </div>
  );
};

export default App;
    
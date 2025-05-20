
import React from 'react';
import type { SignalData } from '../types';
import { SignalType } from '../types';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { ArrowDownIcon } from './icons/ArrowDownIcon';
import { MinusCircleIcon } from './icons/MinusCircleIcon'; // For HOLD signal

interface SignalDisplayCardProps {
  data: SignalData;
}

export const SignalDisplayCard: React.FC<SignalDisplayCardProps> = ({ data }) => {
  const { stockTicker, signal, targetPrice, reasoning, currentPrice } = data;

  const signalColor =
    signal === SignalType.BUY ? 'text-green-400' :
    signal === SignalType.SELL ? 'text-red-400' :
    'text-yellow-400';
  
  const signalBgColor =
    signal === SignalType.BUY ? 'bg-green-500/20' :
    signal === SignalType.SELL ? 'bg-red-500/20' :
    'bg-yellow-500/20';

  const SignalIcon = 
    signal === SignalType.BUY ? ArrowUpIcon :
    signal === SignalType.SELL ? ArrowDownIcon :
    MinusCircleIcon;

  return (
    <div className="bg-slate-700/50 shadow-xl rounded-lg p-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-slate-600">
        <h2 className="text-3xl font-bold text-sky-300 mb-2 sm:mb-0">{stockTicker}</h2>
        <div className={`flex items-center px-4 py-2 rounded-full text-lg font-semibold ${signalColor} ${signalBgColor}`}>
          <SignalIcon className="w-6 h-6 mr-2" />
          {signal}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {currentPrice && (
          <div>
            <p className="text-sm text-slate-400">Hypothetical Current Price:</p>
            <p className="text-xl font-semibold text-slate-100">{currentPrice}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-slate-400">Target Price:</p>
          <p className="text-xl font-semibold text-slate-100">{targetPrice}</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-sky-400 mb-2">Reasoning:</h3>
        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{reasoning}</p>
      </div>
      {/* Fixed: Removed non-standard 'jsx' and 'global' props from the style tag.
          These props are specific to frameworks like Next.js with styled-jsx.
          For standard React, a plain <style> tag injects global CSS. */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};


export enum SignalType {
  BUY = "BUY",
  SELL = "SELL",
  HOLD = "HOLD" // Adding HOLD as a potential signal
}

export interface SignalData {
  stockTicker: string;
  signal: SignalType;
  targetPrice: string; // e.g., "USD 150.75"
  reasoning: string;
  currentPrice?: string; // Optional, Gemini might provide it
}
    
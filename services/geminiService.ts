
import { GoogleGenAI } from "@google/genai";
import type { SignalData } from '../types';
import { SignalType } from '../types'; // Ensure SignalType is imported for use as values

// Ensure SignalType enum values are valid strings for comparison
const validSignalTypes = Object.values(SignalType) as string[];

export async function generateInvestmentSignal(apiKey: string, stockTicker: string): Promise<SignalData> {
  if (!apiKey) {
    throw new Error("API Key is not provided.");
  }
  const ai = new GoogleGenAI({ apiKey });

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const prompt = `
You are an expert investment agent specializing in NASDAQ stocks.
For the stock ticker "${stockTicker.toUpperCase()}", provide a daily trading signal (BUY, SELL, or HOLD), a hypothetical current price, a target price for this signal, and concise reasoning (2-4 sentences).
Assume today's date is ${currentDate}.
Your analysis should sound professional and consider general market factors or hypothetical news relevant to the stock.

Provide your response in the following JSON format ONLY. Do not include any other text, explanations, or markdown formatting outside of the JSON object:
{
  "stockTicker": "${stockTicker.toUpperCase()}",
  "signal": "BUY" | "SELL" | "HOLD",
  "currentPrice": "USD XXX.XX",
  "targetPrice": "USD YYY.YY",
  "reasoning": "Your concise reasoning here, focusing on why this signal is appropriate at this hypothetical price point."
}
Example for currentPrice and targetPrice: "USD 175.50".
The signal must be one of "BUY", "SELL", or "HOLD".
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17", // Using specified model
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5, // Slightly creative but still factual for this context
      },
    });

    let jsonStr = response.text.trim();
    
    // Remove potential markdown fences if responseMimeType: "application/json" doesn't fully strip them
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }

    const parsedData = JSON.parse(jsonStr) as Partial<SignalData>;

    if (!parsedData.stockTicker || !parsedData.signal || !parsedData.targetPrice || !parsedData.reasoning) {
      throw new Error("Received incomplete data structure from API.");
    }
    
    if (!validSignalTypes.includes(parsedData.signal.toUpperCase())) {
        throw new Error(`Received invalid signal type: ${parsedData.signal}. Expected BUY, SELL, or HOLD.`);
    }
    
    // Normalize signal to enum
    const signalEnumKey = parsedData.signal.toUpperCase() as keyof typeof SignalType;


    return {
        stockTicker: parsedData.stockTicker,
        signal: SignalType[signalEnumKey],
        currentPrice: parsedData.currentPrice,
        targetPrice: parsedData.targetPrice,
        reasoning: parsedData.reasoning,
    };

  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
}
    
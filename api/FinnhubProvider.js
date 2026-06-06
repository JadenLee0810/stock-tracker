// src/api/FinnhubProvider.js
const API_KEY = import.meta.env.VITE_MARKET_DATA_API_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';

export const marketApi = {
  getQuote: async (ticker) => {
    if (!API_KEY) {
      console.error("Missing VITE_MARKET_DATA_API_KEY in .env");
      return { currentPrice: 100 }; // Safe fallback if key is missing
    }
    try {
      const res = await fetch(`${BASE_URL}/quote?symbol=${ticker.toUpperCase()}&token=${API_KEY}`);
      const data = await res.json();
      return { currentPrice: data.c };
    } catch (error) {
      console.error("Failed to fetch live quote:", error);
      return null;
    }
  },

  getHistoricalPrices: async (ticker) => {
    if (!API_KEY) return {};

    try {
      // Fetch the last 5 years of daily closing prices
      const to = Math.floor(Date.now() / 1000);
      const from = to - (5 * 365 * 24 * 60 * 60); 

      const res = await fetch(`${BASE_URL}/stock/candle?symbol=${ticker.toUpperCase()}&resolution=D&from=${from}&to=${to}&token=${API_KEY}`);
      const data = await res.json();
      
      if (data.s !== 'ok') return {}; 

      const priceMap = {};
      // data.t = array of unix timestamps, data.c = array of closing prices
      data.t.forEach((timestamp, index) => {
        const dateStr = new Date(timestamp * 1000).toISOString().split('T')[0];
        priceMap[dateStr] = data.c[index];
      });
      
      return priceMap;
    } catch (error) {
      console.error("Failed to fetch historical data:", error);
      return {};
    }
  }
};
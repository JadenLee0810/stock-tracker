/**
 * MarketDataInterface
 * * This defines the standard contract that any API provider must follow.
 * If you ever swap Finnhub for Polygon or Alpha Vantage, just ensure
 * the new class has these exact methods.
 */
export class MarketDataInterface {
  
  /**
   * Fetch current quote data
   * @param {string} ticker 
   * @returns {Promise<{currentPrice: number, previousClose: number, todayChange: number, todayChangePercent: number}>}
   */
  async getQuote(ticker) {
    throw new Error("Method 'getQuote()' must be implemented.");
  }

  /**
   * Search for a ticker symbol
   * @param {string} query 
   * @returns {Promise<Array>}
   */
  async searchSymbols(query) {
    throw new Error("Method 'searchSymbols()' must be implemented.");
  }

  /**
   * Get historical data for charting
   * @param {string} ticker 
   * @param {string} range (1D, 1W, 1M, etc.)
   * @returns {Promise<Array<{time: string|number, value: number}>>}
   */
  async getChartData(ticker, range) {
    throw new Error("Method 'getChartData()' must be implemented.");
  }
}
// src/utils/portfolioMath.js

export const derivePortfolioState = (transactions) => {
  let cash = 0;
  const holdings = {};

  const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

  sorted.forEach(tx => {
    if (tx.type === 'DEPOSIT') {
      cash += tx.amount;
    } else if (tx.type === 'WITHDRAW') {
      cash -= tx.amount;
    } else if (tx.type === 'BUY') {
      const cost = tx.shares * tx.price;
      cash -= cost;
      if (!holdings[tx.ticker]) holdings[tx.ticker] = { shares: 0, totalCost: 0 };
      holdings[tx.ticker].shares += tx.shares;
      holdings[tx.ticker].totalCost += cost;
    } else if (tx.type === 'SELL') {
      const revenue = tx.shares * tx.price;
      cash += revenue;
      if (holdings[tx.ticker]) {
        const costPerShare = holdings[tx.ticker].totalCost / holdings[tx.ticker].shares;
        holdings[tx.ticker].shares -= tx.shares;
        holdings[tx.ticker].totalCost -= (costPerShare * tx.shares);
        if (holdings[tx.ticker].shares <= 0) delete holdings[tx.ticker];
      }
    }
  });

  const holdingsArray = Object.keys(holdings).map(ticker => ({
    ticker,
    shares: holdings[ticker].shares,
    purchasePrice: holdings[ticker].totalCost / holdings[ticker].shares
  }));

  return { cash, holdings: holdingsArray };
};

export const generateLedgerChartData = (transactions, livePrices, historicalPrices, range = 'ALL') => {
  if (!transactions || transactions.length === 0) return [];

  const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  const firstTxDate = new Date(sorted[0].date);
  const today = new Date();

  const cutoffDate = new Date();
  if (range === '1D') cutoffDate.setDate(today.getDate() - 1);
  else if (range === '1W') cutoffDate.setDate(today.getDate() - 7);
  else if (range === '1M') cutoffDate.setMonth(today.getMonth() - 1);
  else if (range === '3M') cutoffDate.setMonth(today.getMonth() - 3);
  else if (range === '1Y') cutoffDate.setFullYear(today.getFullYear() - 1);
  else cutoffDate.setTime(firstTxDate.getTime());

  const simStart = firstTxDate < cutoffDate ? firstTxDate : cutoffDate;

  const data = [];
  let runningCash = 0;
  let runningInvested = 0;
  const runningHoldings = {};

  for (let d = new Date(simStart); d <= today; d.setDate(d.getDate() + 1)) {
    const currentDateStr = d.toISOString().split('T')[0];

    const dayTransactions = sorted.filter(tx => tx.date === currentDateStr);
    dayTransactions.forEach(tx => {
      if (tx.type === 'DEPOSIT') runningCash += tx.amount;
      if (tx.type === 'WITHDRAW') runningCash -= tx.amount;
      if (tx.type === 'BUY') {
        const cost = tx.shares * tx.price;
        runningCash -= cost;
        runningInvested += cost;
        if (!runningHoldings[tx.ticker]) runningHoldings[tx.ticker] = 0;
        runningHoldings[tx.ticker] += tx.shares;
      }
      if (tx.type === 'SELL') {
        const revenue = tx.shares * tx.price;
        runningCash += revenue;
        runningInvested -= (tx.shares * tx.price);
        if (runningHoldings[tx.ticker]) runningHoldings[tx.ticker] -= tx.shares;
      }
    });

    let stocksValue = 0;
    Object.keys(runningHoldings).forEach(ticker => {
      const shares = runningHoldings[ticker];
      if (shares > 0) {
        // 1. Try to get the exact closing price for this day
        let priceForDay = historicalPrices[ticker]?.[currentDateStr];
        
        // 2. If it's a weekend/holiday, loop backward to find the last known market close
        if (!priceForDay) {
          for (let i = 1; i <= 5; i++) {
            const pastDate = new Date(d);
            pastDate.setDate(pastDate.getDate() - i);
            const pastStr = pastDate.toISOString().split('T')[0];
            if (historicalPrices[ticker]?.[pastStr]) {
              priceForDay = historicalPrices[ticker][pastStr];
              break;
            }
          }
        }
        
        // 3. Ultimate fallback: Use live price
        if (!priceForDay) priceForDay = livePrices[ticker]?.currentPrice || 0;
        
        stocksValue += shares * priceForDay;
      }
    });

    const currentD = new Date(d).setHours(0,0,0,0);
    const cutoffD = new Date(cutoffDate).setHours(0,0,0,0);

    if (currentD >= cutoffD) {
      data.push({
        time: currentDateStr,
        value: Math.max(0, runningCash + stocksValue),
        costBasis: runningCash + runningInvested
      });
    }
  }

  return data;
};
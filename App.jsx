import { useState, useEffect, useRef, useMemo } from 'react';
import { marketApi } from './api/FinnhubProvider';
import { derivePortfolioState, generateLedgerChartData } from './utils/portfolioMath';

import PortfolioChart from './components/PortfolioChart';
import TimeRangeSelector from './components/TimeRangeSelector';
import BuyingPowerCard from './components/BuyingPowerCard';
import HoldingsList from './components/HoldingsList';
import TransactionModal from './components/TransactionModal';

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [liveData, setLiveData] = useState({});
  const [historicalData, setHistoricalData] = useState({}); // New state for chart data
  const [scrubValue, setScrubValue] = useState(null);
  const [activeRange, setActiveRange] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const saved = localStorage.getItem('portfolioLedger');
    if (saved) setTransactions(JSON.parse(saved));
    isFirstLoad.current = false;
  }, []);

  useEffect(() => {
    if (isFirstLoad.current) return;
    localStorage.setItem('portfolioLedger', JSON.stringify(transactions));
  }, [transactions]);

  const { cash: buyingPower, holdings } = useMemo(() => {
    return derivePortfolioState(transactions);
  }, [transactions]);

  // Safely track when new tickers are added to trigger data fetches
  const holdingTickers = holdings.map(h => h.ticker).sort().join(',');

  useEffect(() => {
    if (!holdingTickers) return;

    const fetchMarketData = async () => {
      const tickers = holdingTickers.split(',');
      const newLiveData = { ...liveData }; 
      const newHistData = { ...historicalData };
      let changed = false;

      for (const ticker of tickers) {
        if (!newLiveData[ticker]) {
          const quote = await marketApi.getQuote(ticker);
          if (quote) { newLiveData[ticker] = quote; changed = true; }
        }
        if (!newHistData[ticker]) {
          const hist = await marketApi.getHistoricalPrices(ticker);
          if (hist && Object.keys(hist).length > 0) { 
            newHistData[ticker] = hist; 
            changed = true; 
          }
        }
      }
      if (changed) {
        setLiveData(newLiveData);
        setHistoricalData(newHistData);
      }
    };
    
    fetchMarketData();
  }, [holdingTickers]); // Only runs when a new stock is added to your portfolio

  const handleSaveTransaction = (tx) => {
    setTransactions(prev => [...prev, tx]);
  };

  // The math engine now uses the real historicalData!
  const chartData = useMemo(() => {
    return generateLedgerChartData(transactions, liveData, historicalData, activeRange);
  }, [transactions, liveData, historicalData, activeRange]);
  
  const latestDataPoint = chartData[chartData.length - 1];
  const firstDataPoint = chartData[0];

  const totalValue = latestDataPoint ? latestDataPoint.value : buyingPower;
  const displayValue = scrubValue !== null ? scrubValue : totalValue;
  
  let referenceValue = firstDataPoint ? firstDataPoint.value : 0;
  if (activeRange === 'ALL') {
    referenceValue = latestDataPoint ? latestDataPoint.costBasis : 0;
  }

  const valueChange = displayValue - referenceValue;
  const percentChange = referenceValue > 0 ? (valueChange / referenceValue) * 100 : 0;
  const isPositive = displayValue >= referenceValue;

  const rangeLabel = {
    '1D': 'Today',
    '1W': 'Past Week',
    '1M': 'Past Month',
    '3M': 'Past 3 Months',
    '1Y': 'Past Year',
    'ALL': 'All time'
  }[activeRange];

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto pb-20">
        
        <header className="mb-6 pt-8">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight">
            ${displayValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h1>
          <p className={`text-base mt-2 font-medium ${isPositive ? 'text-[#00C805]' : 'text-[#FF5000]'}`}>
            {isPositive ? '+' : ''}${valueChange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({isPositive ? '+' : ''}{percentChange.toFixed(2)}%) {rangeLabel}
          </p>
        </header>

        <PortfolioChart 
          data={chartData} 
          costBasis={latestDataPoint?.costBasis || 0} 
          isPositive={isPositive}
          onHover={setScrubValue}
        />
        <TimeRangeSelector 
          activeRange={activeRange} 
          onSelectRange={setActiveRange} 
          isPositive={isPositive} 
        />

        <BuyingPowerCard 
          buyingPower={buyingPower} 
          onEditClick={() => setIsModalOpen(true)} 
        />

        <HoldingsList 
          holdings={holdings} 
          liveData={liveData} 
          onEdit={() => setIsModalOpen(true)} 
        />

        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full mt-8 py-4 rounded-full font-bold text-black bg-white hover:bg-gray-200 transition-colors"
        >
          Log New Transaction
        </button>

      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTransaction} 
      />
    </div>
  );
}
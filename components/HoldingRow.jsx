// src/components/HoldingRow.jsx
export default function HoldingRow({ holding, liveData, onEdit }) {
  // Fallback to purchase price if live data is still loading
  const currentPrice = liveData?.currentPrice || holding.purchasePrice;
  const holdingValue = holding.shares * currentPrice;
  
  const costBasis = holding.shares * holding.purchasePrice;
  const totalReturnPercent = ((currentPrice - holding.purchasePrice) / holding.purchasePrice) * 100;
  
  const isPositive = totalReturnPercent >= 0;
  const themeColor = isPositive ? 'text-[#00C805]' : 'text-[#FF5000]';

  return (
    <div 
      onClick={onEdit}
      className="flex justify-between items-center py-4 border-b border-gray-900 cursor-pointer hover:bg-gray-900 transition-colors group"
    >
      <div>
        <h3 className="font-bold text-lg text-white">{holding.ticker}</h3>
        <p className="text-sm text-gray-500">{holding.shares} Shares</p>
      </div>
      
      {/* Optional: If you pull historical data for each ticker, 
        you can drop a mini Recharts line chart here for the "sparkline" 
      */}
      <div className="hidden sm:block w-24 h-8 bg-gray-900 group-hover:bg-gray-800 rounded">
         {/* Placeholder for mini-chart */}
      </div>

      <div className="text-right">
        <p className="font-bold text-white">${holdingValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p className={`text-sm font-medium ${themeColor}`}>
          {isPositive ? '+' : ''}{totalReturnPercent.toFixed(2)}%
        </p>
      </div>
    </div>
  );
}
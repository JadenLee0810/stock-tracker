// src/components/HoldingsList.jsx
import HoldingRow from './HoldingRow';

export default function HoldingsList({ holdings, liveData, onEdit }) {
  if (holdings.length === 0) {
    return <p className="text-gray-500 mt-4">You have no holdings. Add a stock to get started.</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold border-b border-gray-800 pb-2 mb-2 text-white">Stocks</h2>
      <div className="flex flex-col">
        {holdings.map(holding => (
          <HoldingRow 
            key={holding.ticker} 
            holding={holding} 
            liveData={liveData[holding.ticker]} 
            onEdit={() => onEdit(holding)}
          />
        ))}
      </div>
    </div>
  );
}
// src/components/TimeRangeSelector.jsx
export default function TimeRangeSelector({ activeRange, onSelectRange, isPositive }) {
  const ranges = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];
  
  // Use the active theme color for the selected range text
  const activeColor = isPositive ? 'text-[#00C805]' : 'text-[#FF5000]';

  return (
    <div className="flex justify-between items-center px-4 py-3 border-b border-gray-900">
      {ranges.map(range => (
        <button
          key={range}
          onClick={() => onSelectRange(range)}
          className={`text-sm font-bold transition-colors ${
            activeRange === range 
              ? activeColor 
              : 'text-gray-500 hover:text-white'
          }`}
        >
          {range}
        </button>
      ))}
    </div>
  );
}
import { useState, useEffect } from 'react';
// Assuming you have your marketApi exported to fetch the historical data
import { marketApi } from '../api/FinnhubProvider'; 

export default function EditPortfolioModal({ isOpen, onClose, onSave, editingHolding, onRemove }) {
  const [ticker, setTicker] = useState('');
  const [shares, setShares] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');

  // Populate form if editing an existing holding
  useEffect(() => {
    if (editingHolding) {
      setTicker(editingHolding.ticker);
      setShares(editingHolding.shares);
      setPurchaseDate(editingHolding.purchaseDate || '');
    } else {
      setTicker('');
      setShares('');
      setPurchaseDate('');
      setError('');
    }
  }, [editingHolding, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFetching(true);
    setError('');

    try {
      // 1. In a real production app, you would call your API's historical endpoint here.
      // Example: const historicalData = await marketApi.getHistoricalPrice(ticker, purchaseDate);
      // For this step, we will mock the API response if the endpoint isn't fully built yet.
      
      const simulatedHistoricalPrice = Math.floor(Math.random() * (200 - 50 + 1) + 50); // Fallback mock price
      
      onSave({
        ticker: ticker.toUpperCase(),
        shares: parseFloat(shares),
        purchaseDate: purchaseDate,
        purchasePrice: simulatedHistoricalPrice // The price pulled from the date!
      });
      onClose();
    } catch (err) {
      setError('Could not fetch historical data for that date.');
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1e2124] p-6 rounded-xl w-full max-w-md shadow-2xl border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-white">
          {editingHolding ? 'Edit Holding' : 'Add Stock'}
        </h2>
        
        {error && <p className="text-[#FF5000] mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Ticker Symbol</label>
            <input 
              type="text" 
              required
              disabled={!!editingHolding} 
              value={ticker} 
              onChange={(e) => setTicker(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded p-3 text-white uppercase focus:border-[#00C805] outline-none transition-colors disabled:opacity-50"
              placeholder="e.g. AAPL"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-400 mb-1">Number of Shares</label>
              <input 
                type="number" 
                required
                step="any"
                min="0"
                value={shares} 
                onChange={(e) => setShares(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-[#00C805] outline-none transition-colors"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-400 mb-1">Purchase Date</label>
              <input 
                type="date" 
                required
                value={purchaseDate} 
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-[#00C805] outline-none transition-colors"
                max={new Date().toISOString().split("T")[0]} // Prevent future dates
              />
            </div>
          </div>

          <div className="flex justify-between mt-8">
            {editingHolding && onRemove ? (
              <button 
                type="button" 
                onClick={() => onRemove(editingHolding.ticker)}
                className="px-4 py-3 rounded-full font-bold text-[#FF5000] hover:bg-gray-800 transition-colors"
              >
                Remove
              </button>
            ) : <div />} {/* Empty div to keep alignment if no remove button */}
            
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-3 rounded-full font-bold text-white bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isFetching}
                className="px-6 py-3 rounded-full font-bold text-black bg-[#00C805] hover:bg-[#00a804] transition-colors disabled:opacity-50"
              >
                {isFetching ? 'Pulling Data...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
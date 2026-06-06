import { useState } from 'react';

export default function TransactionModal({ isOpen, onClose, onSave }) {
  const [tab, setTab] = useState('TRADE'); // 'TRADE' or 'TRANSFER'
  const [type, setType] = useState('BUY'); // 'BUY', 'SELL', 'DEPOSIT', 'WITHDRAW'
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isFetching, setIsFetching] = useState(false);
  
  // Trade specific
  const [ticker, setTicker] = useState('');
  const [shares, setShares] = useState('');
  
  // Transfer specific
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFetching(true);
    
    const transaction = {
      id: crypto.randomUUID(), // Unique ID for the ledger
      type,
      date,
    };

    if (tab === 'TRADE') {
      // In a real production app, call your API's historical endpoint here:
      // const fetchedPrice = await marketApi.getHistoricalPrice(ticker, date);
      
      // For now, we simulate the market API returning a real price for that historical day:
      const simulatedHistoricalPrice = Math.floor(Math.random() * (200 - 50 + 1) + 50);

      transaction.ticker = ticker.toUpperCase();
      transaction.shares = parseFloat(shares);
      transaction.price = simulatedHistoricalPrice; // Automatically set by the "API"
    } else {
      transaction.amount = parseFloat(amount);
    }

    onSave(transaction);
    setIsFetching(false);
    onClose();
    
    // Reset form
    setTicker(''); 
    setShares(''); 
    setAmount('');
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1e2124] p-6 rounded-xl w-full max-w-md shadow-2xl border border-gray-800">
        
        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-700">
          <button 
            className={`flex-1 pb-2 font-bold ${tab === 'TRADE' ? 'text-white border-b-2 border-[#00C805]' : 'text-gray-500'}`}
            onClick={() => { setTab('TRADE'); setType('BUY'); }}
          >
            Trade Stock
          </button>
          <button 
            className={`flex-1 pb-2 font-bold ${tab === 'TRANSFER' ? 'text-white border-b-2 border-[#00C805]' : 'text-gray-500'}`}
            onClick={() => { setTab('TRANSFER'); setType('DEPOSIT'); }}
          >
            Transfer Cash
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="flex gap-2 mb-4 bg-black p-1 rounded-lg">
            <button type="button" onClick={() => setType(tab === 'TRADE' ? 'BUY' : 'DEPOSIT')} className={`flex-1 py-2 rounded text-sm font-bold transition-colors ${type === 'BUY' || type === 'DEPOSIT' ? 'bg-gray-800 text-white' : 'text-gray-500'}`}>
              {tab === 'TRADE' ? 'Buy' : 'Deposit'}
            </button>
            <button type="button" onClick={() => setType(tab === 'TRADE' ? 'SELL' : 'WITHDRAW')} className={`flex-1 py-2 rounded text-sm font-bold transition-colors ${type === 'SELL' || type === 'WITHDRAW' ? 'bg-gray-800 text-white' : 'text-gray-500'}`}>
              {tab === 'TRADE' ? 'Sell' : 'Withdraw'}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Date</label>
            <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-[#00C805] outline-none transition-colors" max={new Date().toISOString().split("T")[0]} />
          </div>

          {tab === 'TRADE' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Ticker Symbol</label>
                <input type="text" required value={ticker} onChange={(e) => setTicker(e.target.value)} className="w-full bg-black border border-gray-700 rounded p-3 text-white uppercase focus:border-[#00C805] outline-none transition-colors" placeholder="e.g. AAPL" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Shares</label>
                <input type="number" required step="any" min="0" value={shares} onChange={(e) => setShares(e.target.value)} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-[#00C805] outline-none transition-colors" placeholder="0" />
              </div>
            </>
          ) : (
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Amount ($)</label>
                <input type="number" required step="any" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-[#00C805] outline-none transition-colors" placeholder="1000.00" />
              </div>
          )}

          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-full font-bold text-white bg-gray-800 hover:bg-gray-700 transition-colors">Cancel</button>
            <button 
              type="submit" 
              disabled={isFetching}
              className="px-6 py-3 rounded-full font-bold text-black bg-[#00C805] hover:bg-[#00a804] transition-colors disabled:opacity-50"
            >
              {isFetching ? 'Fetching Price...' : 'Log Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
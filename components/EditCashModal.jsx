// src/components/EditCashModal.jsx
import { useState, useEffect } from 'react';

export default function EditCashModal({ isOpen, onClose, onSave, currentCash }) {
  const [cash, setCash] = useState('');

  useEffect(() => {
    if (isOpen) setCash(currentCash);
  }, [isOpen, currentCash]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(parseFloat(cash) || 0);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1e2124] p-6 rounded-xl w-full max-w-sm shadow-2xl border border-gray-800">
        <h2 className="text-xl font-bold mb-4 text-white">Edit Buying Power</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-400 mb-1">Available Cash ($)</label>
          <input 
            type="number" 
            step="any"
            value={cash} 
            onChange={(e) => setCash(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-[#00C805] outline-none transition-colors mb-6"
            placeholder="1000.00"
          />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-full font-bold text-white bg-gray-800 hover:bg-gray-700 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-full font-bold text-black bg-[#00C805] hover:bg-[#00a804] transition-colors">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
// src/components/BuyingPowerCard.jsx
export default function BuyingPowerCard({ buyingPower, onEditClick }) {
  return (
    <div 
      onClick={onEditClick}
      className="flex justify-between items-center py-4 border-b border-gray-900 cursor-pointer hover:bg-gray-900 transition-colors mt-8"
    >
      <h2 className="text-lg font-semibold text-white">Buying Power</h2>
      <p className="text-lg font-bold text-white">
        ${buyingPower.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
  );
}
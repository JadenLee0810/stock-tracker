import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function PortfolioChart({ data, costBasis, isPositive, onHover }) {
  const themeColor = isPositive ? '#00C805' : '#FF5000'; 

  return (
    <div className="h-64 w-full bg-black">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={data}
          onMouseMove={(e) => {
            if (e.activePayload) onHover(e.activePayload[0].payload.value);
          }}
          onMouseLeave={() => onHover(null)} 
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={themeColor} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={themeColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="time" hide />
          {/* Tighter scaling so the chart utilizes the full height */}
          <YAxis domain={['dataMin', 'dataMax']} hide />
          <Tooltip 
            content={<></>} 
            cursor={{ stroke: '#333', strokeWidth: 1, strokeDasharray: '4 4' }} 
            isAnimationActive={false} // Makes the scrub line instantly responsive
          />
          <ReferenceLine y={costBasis} stroke="#555" strokeDasharray="3 3" />
          <Area 
            type="linear" // Changed from monotone to linear for realistic jagged edges
            dataKey="value" 
            stroke={themeColor} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            isAnimationActive={false} // Stops the initial slow drawing animation
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
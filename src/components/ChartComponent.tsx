import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ReferenceLine } from 'recharts';

interface ChartComponentProps {
  data: { time: string; price: number; signal?: 'buy' | 'sell' | null; sma5?: number; sma10?: number }[];
}

const ChartComponent: React.FC<ChartComponentProps> = ({ data }) => {
  // Prepare signal data for scatter plot
  const buySignals = data.filter(d => d.signal === 'buy').map(d => ({ time: d.time, price: d.price }));
  const sellSignals = data.filter(d => d.signal === 'sell').map(d => ({ time: d.time, price: d.price }));

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-center">Live Trading Chart with Signals</h2>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
          <YAxis stroke="#9CA3AF" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
            labelStyle={{ color: '#F9FAFB' }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            name="Price"
          />
          <Line
            type="monotone"
            dataKey="sma5"
            stroke="#10B981"
            strokeWidth={1}
            strokeDasharray="5 5"
            dot={false}
            name="SMA 5"
          />
          <Line
            type="monotone"
            dataKey="sma10"
            stroke="#F59E0B"
            strokeWidth={1}
            strokeDasharray="5 5"
            dot={false}
            name="SMA 10"
          />
          {/* Buy Signals */}
          <Scatter
            data={buySignals}
            fill="#10B981"
            shape="triangle"
            name="Buy Signal"
          />
          {/* Sell Signals */}
          <Scatter
            data={sellSignals}
            fill="#EF4444"
            shape="triangle"
            name="Sell Signal"
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 flex justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-blue-400"></div>
          <span>Price</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-green-400 border-dashed"></div>
          <span>SMA 5</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-yellow-400 border-dashed"></div>
          <span>SMA 10</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 transform rotate-180"></div>
          <span>Buy</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-400 transform rotate-180"></div>
          <span>Sell</span>
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
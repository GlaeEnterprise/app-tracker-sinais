"use client";

import React, { useState, useEffect } from 'react';
import ChartComponent from '@/components/ChartComponent';
import ControlPanel from '@/components/ControlPanel';
import { TrendingUp, DollarSign, BarChart3 } from 'lucide-react';

interface DataPoint {
  time: string;
  price: number;
  signal?: 'buy' | 'sell' | null;
  sma5?: number;
  sma10?: number;
}

interface HistoryItem {
  action: 'buy' | 'sell';
  asset: string;
  amount: string;
  time: string;
}

const fetchRealData = async (symbol: string, interval: string): Promise<DataPoint[]> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'demo';
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${apiKey}`
    );
    const data = await response.json();

    if (data['Error Message']) {
      console.error('API Error:', data['Error Message']);
      return generateMockData(symbol, interval); // Fallback to mock
    }

    const timeSeries = data['Time Series (5min)'] || data['Time Series (15min)'] || data['Time Series (30min)'] || data['Time Series (60min)'];
    if (!timeSeries) return generateMockData(symbol, interval);

    const points: DataPoint[] = Object.keys(timeSeries).slice(0, 50).reverse().map((time: string) => ({
      time: new Date(time).toLocaleTimeString(),
      price: parseFloat(timeSeries[time]['1. open']),
    }));

    // Calculate SMAs and signals
    const prices = points.map(p => p.price);
    const sma5 = calculateSMA(prices, 5);
    const sma10 = calculateSMA(prices, 10);

    points.forEach((point, index) => {
      point.sma5 = sma5[index];
      point.sma10 = sma10[index];
      if (index > 0 && point.sma5 && point.sma10 && points[index - 1].sma5 && points[index - 1].sma10) {
        if (point.price > point.sma5 && points[index - 1].price <= points[index - 1].sma5) {
          point.signal = 'buy';
        } else if (point.price < point.sma5 && points[index - 1].price >= points[index - 1].sma5) {
          point.signal = 'sell';
        }
      }
    });

    return points;
  } catch (error) {
    console.error('Error fetching data:', error);
    return generateMockData(symbol, interval);
  }
};

const calculateSMA = (prices: number[], period: number): number[] => {
  const sma: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      sma.push(NaN);
    } else {
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
  }
  return sma;
};

const generateMockData = (asset: string, timeframe: string): DataPoint[] => {
  const data: DataPoint[] = [];
  const basePrice = asset === 'BTC' ? 50000 : asset === 'ETH' ? 3000 : asset === 'AAPL' ? 150 : asset === 'USD' ? 1 : 0.9;
  const points = 50;

  for (let i = 0; i < points; i++) {
    const price = basePrice + Math.random() * 1000 - 500;
    data.push({
      time: `${i}:00`,
      price: Math.round(price * 100) / 100,
    });
  }

  // Add SMAs and signals to mock data
  const prices = data.map(p => p.price);
  const sma5 = calculateSMA(prices, 5);
  const sma10 = calculateSMA(prices, 10);

  data.forEach((point, index) => {
    point.sma5 = sma5[index];
    point.sma10 = sma10[index];
    if (index > 0 && point.sma5 && point.sma10 && data[index - 1].sma5 && data[index - 1].sma10) {
      if (point.price > point.sma5 && data[index - 1].price <= data[index - 1].sma5) {
        point.signal = 'buy';
      } else if (point.price < point.sma5 && data[index - 1].price >= data[index - 1].sma5) {
        point.signal = 'sell';
      }
    }
  });

  return data;
};

export default function Home() {
  const [selectedAsset, setSelectedAsset] = useState('AAPL');
  const [selectedTimeframe, setSelectedTimeframe] = useState('5min');
  const [investment, setInvestment] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchRealData(selectedAsset, selectedTimeframe);
      setChartData(data);
      setLoading(false);
    };
    loadData();
  }, [selectedAsset, selectedTimeframe]);

  const handleBuy = () => {
    if (!investment) return;
    const newItem: HistoryItem = {
      action: 'buy',
      asset: selectedAsset,
      amount: investment,
      time: new Date().toLocaleString(),
    };
    setHistory([newItem, ...history]);
    setInvestment('');
  };

  const handleSell = () => {
    if (!investment) return;
    const newItem: HistoryItem = {
      action: 'sell',
      asset: selectedAsset,
      amount: investment,
      time: new Date().toLocaleString(),
    };
    setHistory([newItem, ...history]);
    setInvestment('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              ProTrader Signals
            </h1>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span>Live Trading Signals</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="h-4 w-4 text-yellow-400" />
              <span>Real-time Data</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        <div className="flex gap-6">
          <div className="flex-1">
            {loading ? (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p>Loading real-time data...</p>
              </div>
            ) : (
              <ChartComponent data={chartData} />
            )}
          </div>
          <ControlPanel
            selectedAsset={selectedAsset}
            setSelectedAsset={setSelectedAsset}
            selectedTimeframe={selectedTimeframe}
            setSelectedTimeframe={setSelectedTimeframe}
            investment={investment}
            setInvestment={setInvestment}
            onBuy={handleBuy}
            onSell={handleSell}
            history={history}
          />
        </div>
      </div>
    </div>
  );
}
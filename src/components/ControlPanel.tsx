import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface ControlPanelProps {
  selectedAsset: string;
  setSelectedAsset: (asset: string) => void;
  selectedTimeframe: string;
  setSelectedTimeframe: (timeframe: string) => void;
  investment: string;
  setInvestment: (investment: string) => void;
  onBuy: () => void;
  onSell: () => void;
  history: { action: 'buy' | 'sell'; asset: string; amount: string; time: string }[];
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedAsset,
  setSelectedAsset,
  selectedTimeframe,
  setSelectedTimeframe,
  investment,
  setInvestment,
  onBuy,
  onSell,
  history,
}) => {
  const assets = [
    { value: 'AAPL', label: 'Apple (AAPL)', type: 'stock' },
    { value: 'GOOGL', label: 'Google (GOOGL)', type: 'stock' },
    { value: 'MSFT', label: 'Microsoft (MSFT)', type: 'stock' },
    { value: 'TSLA', label: 'Tesla (TSLA)', type: 'stock' },
    { value: 'BTC', label: 'Bitcoin (BTC)', type: 'crypto' },
    { value: 'ETH', label: 'Ethereum (ETH)', type: 'crypto' },
    { value: 'ADA', label: 'Cardano (ADA)', type: 'crypto' },
    { value: 'USD', label: 'Dólar (USD)', type: 'currency' },
    { value: 'EUR', label: 'Euro (EUR)', type: 'currency' },
  ];

  const timeframes = [
    { value: '5min', label: '5 Minutos' },
    { value: '15min', label: '15 Minutos' },
    { value: '30min', label: '30 Minutos' },
    { value: '60min', label: '1 Hora' },
  ];

  return (
    <div className="w-80 space-y-4">
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Trading Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="asset" className="text-white">Select Asset</Label>
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Choose an asset" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {assets.map((asset) => (
                  <SelectItem key={asset.value} value={asset.value} className="text-white hover:bg-gray-600">
                    {asset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="timeframe" className="text-white">Timeframe</Label>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {timeframes.map((tf) => (
                  <SelectItem key={tf.value} value={tf.value} className="text-white hover:bg-gray-600">
                    {tf.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="investment" className="text-white">Investment Amount ($)</Label>
            <Input
              id="investment"
              type="number"
              value={investment}
              onChange={(e) => setInvestment(e.target.value)}
              placeholder="Enter amount"
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={onBuy} className="bg-green-600 hover:bg-green-700 flex-1 flex items-center justify-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Buy</span>
            </Button>
            <Button onClick={onSell} className="bg-red-600 hover:bg-red-700 flex-1 flex items-center justify-center space-x-2">
              <TrendingDown className="h-4 w-4" />
              <span>Sell</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Trading History</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            {history.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No transactions yet.</p>
            ) : (
              history.map((item, index) => (
                <div key={index} className="mb-3 p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className={`font-semibold ${item.action === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                      {item.action === 'buy' ? 'Buy' : 'Sell'} {item.asset}
                    </span>
                    <span className="text-sm text-gray-400">{item.time}</span>
                  </div>
                  <p className="text-white">Amount: ${item.amount}</p>
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ControlPanel;
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Stock, PortfolioSummary } from '@/types';
import DashboardHeader from './DashboardHeader';
import PortfolioTable from './PortfolioTable';
import { RefreshCw, PlusCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import StockForm from './StockForm';
import { Database } from 'lucide-react';

export default function Dashboard() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchPortfolioData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);

      const API_URL = 'http://localhost:5002/api/stocks';

      // 1. Fetch stock list from Backend
      const { data: stockList } = await axios.get<Stock[]>(API_URL);
      
      // 2. Fetch latest prices from Backend
      const { data: priceData } = await axios.get(`${API_URL}/prices`);
      
      // 3. Map prices to stocks
      const updatedStocks = stockList.map(stock => {
        const live = priceData.find((p: any) => p.symbol === stock.symbol);
        return {
          ...stock,
          cmp: live?.cmp || null,
          peRatio: live?.peRatio || 'N/A',
          latestEarnings: live?.latestEarnings || 'N/A'
        };
      });

      setStocks(updatedStocks);
      setError(null);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError('Failed to fetch data. Please check if your backend is running at http://localhost:5002');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleSeed = async () => {
    try {
      setSeeding(true);
      await axios.post('http://localhost:5002/api/stocks/seed');
      fetchPortfolioData();
    } catch (err) {
      setError('Failed to seed database');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();

    // Set interval for real-time updates (15 seconds)
    const interval = setInterval(() => {
      fetchPortfolioData(true);
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchPortfolioData]);

  const summary = useMemo<PortfolioSummary>(() => {
    const totalInvestment = stocks.reduce((acc, s) => acc + (s.purchasePrice * s.quantity), 0);
    const currentValue = stocks.reduce((acc, s) => acc + ((s.cmp || s.purchasePrice) * s.quantity), 0);
    const totalGainLoss = currentValue - totalInvestment;
    const totalGainLossPercentage = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;

    return {
      totalInvestment,
      currentValue,
      totalGainLoss,
      totalGainLossPercentage
    };
  }, [stocks]);

  if (loading && stocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="animate-spin text-primary mb-4" size={48} />
        <p className="text-gray-400">Loading your dynamic portfolio...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gradient tracking-tight">
            Portfolio Dashboard
          </h1>
          <p className="text-gray-400 mt-1 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse"></span>
            Real-time market insights
          </p>
        </div>
        <div className="flex gap-3">
          {stocks.length === 0 && (
            <button 
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-white px-4 py-2 rounded-lg transition-all font-medium border border-border"
            >
              <Database size={20} className={seeding ? "animate-bounce" : ""} />
              <span>{seeding ? 'Seeding...' : 'Seed Data'}</span>
            </button>
          )}
          <button 
            onClick={() => fetchPortfolioData(true)}
            className={cn(
              "p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-all border border-border",
              refreshing && "animate-spin"
            )}
            title="Refresh"
          >
            <RefreshCw size={20} />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-all font-medium shadow-lg shadow-primary/20"
          >
            <PlusCircle size={20} />
            <span>Add Stock</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg flex items-center gap-3 text-error animate-in">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <DashboardHeader summary={summary} />
      
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Your Holdings</h2>
        <span className="text-xs text-gray-500 italic">Auto-refreshing every 15s</span>
      </div>
      
      <PortfolioTable data={stocks} />

      {isModalOpen && (
        <StockForm 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => fetchPortfolioData()} 
        />
      )}
    </div>
  );
}



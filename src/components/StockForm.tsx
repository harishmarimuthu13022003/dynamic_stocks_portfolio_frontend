'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

interface StockFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function StockForm({ onClose, onSuccess }: StockFormProps) {
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    purchasePrice: '',
    quantity: '',
    sector: '',
    exchange: 'NSE'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        purchasePrice: parseFloat(formData.purchasePrice),
        quantity: parseInt(formData.quantity)
      };

      await axios.post('https://dynamic-stocks-portfolio-backend-1.onrender.com/api/stocks', payload);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to add stock');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in">
      <div className="glass-card w-full max-w-md p-6 bg-card border-border shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Add New Holding</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Symbol (Ticker)</label>
              <input
                required
                type="text"
                placeholder="e.g. RELIANCE.NS"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Company Name</label>
              <input
                required
                type="text"
                placeholder="Reliance Ind."
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Purchase Price</label>
              <input
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                value={formData.purchasePrice}
                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Quantity</label>
              <input
                required
                type="number"
                placeholder="0"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Sector</label>
            <input
              required
              type="text"
              placeholder="e.g. Energy, Technology"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Exchange</label>
            <select
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
              value={formData.exchange}
              onChange={(e) => setFormData({ ...formData, exchange: e.target.value })}
            >
              <option value="NSE">NSE</option>
              <option value="BSE">BSE</option>
            </select>
          </div>

          {error && (
            <div className="text-error text-sm bg-error/10 border border-error/20 p-2 rounded">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 mt-4 shadow-lg shadow-primary/20"
          >
            {loading ? 'Adding...' : 'Save Holding'}
          </button>
        </form>
      </div>
    </div>
  );
}

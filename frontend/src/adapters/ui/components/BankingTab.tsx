//
//  BankingTab.tsx
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import React, { useState } from 'react';
import { useBanking } from '../hooks/useBanking';
import { Banknote, TrendingUp, TrendingDown } from 'lucide-react';

const BankingTab: React.FC = () => {
  const [shipId, setShipId] = useState('SHIP001');
  const [year, setYear] = useState('2025');
  const [amount, setAmount] = useState('1000');
  const [cbBefore, setCbBefore] = useState('5000');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { bankSurplus, applyBanked, loading, error } = useBanking();

  const handleBank = async (): Promise<void> => {
    try {
      setMessage(null);
      const amountNum = parseFloat(amount);
      const cbNum = parseFloat(cbBefore);

      if (cbNum <= 0) {
        setMessage({ type: 'error', text: 'Cannot bank when CB is not positive' });
        return;
      }

      await bankSurplus({
        shipId,
        year: parseInt(year),
        amount: amountNum,
      });

      setCbBefore((cbNum - amountNum).toString());
      setMessage({ type: 'success', text: `Successfully banked ${amountNum} gCO₂eq` });
    } catch (err: any) {
      setMessage({ type: 'error', text: error || 'Failed to bank surplus' });
    }
  };

  const handleApply = async (): Promise<void> => {
    try {
      setMessage(null);
      const amountNum = parseFloat(amount);

      await applyBanked({
        shipId,
        year: parseInt(year),
        amount: amountNum,
      });

      const cbNum = parseFloat(cbBefore);
      setCbBefore((cbNum + amountNum).toString());
      setMessage({ type: 'success', text: `Successfully applied ${amountNum} gCO₂eq from bank` });
    } catch (err: any) {
      setMessage({ type: 'error', text: error || 'Failed to apply banked surplus' });
    }
  };

  const cbNum = parseFloat(cbBefore);
  const amountNum = parseFloat(amount);
  const cbAfter = cbNum - amountNum;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Banknote className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Banking (Article 20)</h3>
        </div>
        <p className="text-sm text-gray-600">
          Bank positive compliance balance for future use, or apply previously banked surplus to cover deficits.
        </p>
      </div>

      {message && (
        <div
          className={`rounded-lg p-4 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Ship ID</label>
          <input
            type="text"
            value={shipId}
            onChange={(e) => setShipId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount (gCO₂eq)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Current Compliance Balance</h4>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">CB Before (gCO₂eq)</label>
          <input
            type="number"
            value={cbBefore}
            onChange={(e) => setCbBefore(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-1">CB Before</p>
            <p className={`text-2xl font-bold ${cbNum >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {cbNum.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">gCO₂eq</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-1">Amount</p>
            <p className="text-2xl font-bold text-gray-900">{amountNum.toLocaleString()}</p>
            <p className="text-xs text-gray-500">gCO₂eq</p>
          </div>

          <div className="bg-indigo-50 rounded-lg p-4">
            <p className="text-xs text-gray-600 mb-1">CB After (Banking)</p>
            <p className={`text-2xl font-bold ${cbAfter >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {cbAfter.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">gCO₂eq</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleBank}
            disabled={loading || cbNum <= 0}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <TrendingDown className="w-5 h-5" />
            Bank Surplus
          </button>

          <button
            onClick={handleApply}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <TrendingUp className="w-5 h-5" />
            Apply Banked
          </button>
        </div>

        {cbNum <= 0 && (
          <p className="mt-4 text-sm text-orange-600 bg-orange-50 rounded p-3">
            ⚠️ Banking is disabled when CB is not positive
          </p>
        )}
      </div>
    </div>
  );
};

export default BankingTab;

//
//  PoolingTab.tsx
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import React, { useState } from 'react';
import { usePooling } from '../hooks/usePooling';
import { Users, AlertCircle, CheckCircle } from 'lucide-react';

interface PoolMemberInput {
  shipId: string;
  cbBefore: string;
}

const PoolingTab: React.FC = () => {
  const [year, setYear] = useState('2025');
  const [members, setMembers] = useState<PoolMemberInput[]>([
    { shipId: 'SHIP001', cbBefore: '1000' },
    { shipId: 'SHIP002', cbBefore: '-400' },
  ]);
  const [result, setResult] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { createPool, loading, error } = usePooling();

  const addMember = (): void => {
    setMembers([...members, { shipId: `SHIP${members.length + 1}`.padStart(7, '0'), cbBefore: '0' }]);
  };

  const updateMember = (index: number, field: keyof PoolMemberInput, value: string): void => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const removeMember = (index: number): void => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const totalCb = members.reduce((sum, m) => sum + parseFloat(m.cbBefore || '0'), 0);
  const isValid = totalCb >= 0;

  const handleCreatePool = async (): Promise<void> => {
    try {
      setMessage(null);
      setResult(null);

      const poolMembers = members.map((m) => ({
        shipId: m.shipId,
        cbBefore: parseFloat(m.cbBefore),
      }));

      const poolResult = await createPool(parseInt(year), poolMembers);
      setResult(poolResult);
      setMessage({ type: 'success', text: `Pool ${poolResult.poolId} created successfully!` });
    } catch (err: any) {
      setMessage({ type: 'error', text: error || 'Failed to create pool' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Pooling (Article 21)</h3>
        </div>
        <p className="text-sm text-gray-600">
          Create a compliance pool where surplus ships can transfer credits to deficit ships. Total pool CB must be
          non-negative.
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

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Pool Configuration</h4>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>

        <div className="space-y-3 mb-4">
          {members.map((member, index) => (
            <div key={index} className="flex gap-3 items-center">
              <input
                type="text"
                value={member.shipId}
                onChange={(e) => updateMember(index, 'shipId', e.target.value)}
                placeholder="Ship ID"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="number"
                value={member.cbBefore}
                onChange={(e) => updateMember(index, 'cbBefore', e.target.value)}
                placeholder="CB Before"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={() => removeMember(index)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addMember}
          className="w-full mb-4 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
        >
          + Add Member
        </button>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Total Pool CB:</span>
            <span
              className={`text-xl font-bold ${
                totalCb >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {totalCb.toLocaleString()} gCO₂eq
            </span>
          </div>
          {!isValid && (
            <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              Pool is invalid: total CB must be non-negative
            </div>
          )}
        </div>

        <button
          onClick={handleCreatePool}
          disabled={loading || !isValid || members.length < 2}
          className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Creating Pool...' : 'Create Pool'}
        </button>
      </div>

      {result && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h4 className="font-semibold text-gray-900">Pool Created Successfully</h4>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Pool ID: <span className="font-mono font-semibold">{result.poolId}</span>
            </p>
            <p className="text-sm text-gray-600">
              Year: <span className="font-semibold">{result.year}</span>
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ship ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CB Before</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CB After</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {result.members.map((member: any) => {
                  const change = member.cbAfter - member.cbBefore;
                  return (
                    <tr key={member.shipId}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{member.shipId}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        <span className={member.cbBefore >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {member.cbBefore.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        <span className={member.cbAfter >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {member.cbAfter.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={change >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {change >= 0 ? '+' : ''}
                          {change.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoolingTab;

//
//  CompareTab.tsx
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import React from 'react';
import { useComparison } from '../hooks/useComparison';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CheckCircle, XCircle } from 'lucide-react';

const CompareTab: React.FC = () => {
  const { data, loading, error } = useComparison();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-gray-500">
        No comparison data available. Please set a baseline route first.
      </div>
    );
  }

  const TARGET_INTENSITY = 89.3368;

  const chartData = [
    {
      name: data.baseline.routeId,
      intensity: data.baseline.ghgIntensity,
      type: 'Baseline',
    },
    ...data.comparisons.map((c) => ({
      name: c.comparison.routeId,
      intensity: c.comparison.ghgIntensity,
      type: 'Comparison',
    })),
    {
      name: 'Target',
      intensity: TARGET_INTENSITY,
      type: 'Target',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Baseline Route</h3>
        <p className="text-blue-800">
          {data.baseline.routeId} - {data.baseline.vesselType} - {data.baseline.ghgIntensity.toFixed(2)} gCO₂e/MJ
        </p>
        <p className="text-sm text-blue-700 mt-1">
          Target: {TARGET_INTENSITY} gCO₂e/MJ (2% below 91.16)
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">GHG Intensity Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'gCO₂e/MJ', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="intensity" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                GHG Intensity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                % Difference
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Compliant
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.comparisons.map((comp) => (
              <tr key={comp.comparison.routeId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {comp.comparison.routeId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {comp.comparison.ghgIntensity.toFixed(2)} gCO₂e/MJ
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`font-medium ${
                      comp.percentDiff < 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {comp.percentDiff > 0 ? '+' : ''}
                    {comp.percentDiff.toFixed(2)}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {comp.compliant ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-1" />
                      Compliant
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <XCircle className="w-5 h-5 mr-1" />
                      Non-Compliant
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompareTab;

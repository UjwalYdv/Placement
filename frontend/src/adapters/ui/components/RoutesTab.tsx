//
//  RoutesTab.tsx
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import React, { useState } from 'react';
import { useRoutes } from '../hooks/useRoutes';
import { Filter, CheckCircle } from 'lucide-react';

const RoutesTab: React.FC = () => {
  const [vesselType, setVesselType] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [year, setYear] = useState('');

  const filters = {
    vesselType: vesselType || undefined,
    fuelType: fuelType || undefined,
    year: year ? parseInt(year) : undefined,
  };

  const { routes, loading, error, setBaseline } = useRoutes(filters);

  const handleSetBaseline = async (routeId: string): Promise<void> => {
    try {
      await setBaseline(routeId);
      alert(`Baseline set to ${routeId}`);
    } catch (err) {
      alert('Failed to set baseline');
    }
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Filter className="w-5 h-5 text-gray-400" />
        <select
          value={vesselType}
          onChange={(e) => setVesselType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">All Vessel Types</option>
          <option value="Container">Container</option>
          <option value="BulkCarrier">Bulk Carrier</option>
          <option value="Tanker">Tanker</option>
          <option value="RoRo">RoRo</option>
        </select>

        <select
          value={fuelType}
          onChange={(e) => setFuelType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">All Fuel Types</option>
          <option value="HFO">HFO</option>
          <option value="LNG">LNG</option>
          <option value="MGO">MGO</option>
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">All Years</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vessel Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fuel Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                GHG Intensity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Consumption (t)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Distance (km)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Emissions (t)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {routes.map((route) => (
              <tr key={route.id} className={route.isBaseline ? 'bg-blue-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {route.routeId}
                  {route.isBaseline && (
                    <CheckCircle className="inline-block ml-2 w-4 h-4 text-blue-600" />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {route.vesselType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {route.fuelType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {route.year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {route.ghgIntensity.toFixed(2)} gCO₂e/MJ
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {route.fuelConsumption.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {route.distance.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {route.totalEmissions.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {!route.isBaseline && (
                    <button
                      onClick={() => handleSetBaseline(route.routeId)}
                      className="text-primary-600 hover:text-primary-900 font-medium"
                    >
                      Set Baseline
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {routes.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No routes found matching the selected filters.
        </div>
      )}
    </div>
  );
};

export default RoutesTab;

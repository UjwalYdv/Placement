//
//  useRoutes.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { useState, useEffect } from 'react';
import { Route } from '../../../core/domain/Route';
import { RouteService } from '../../infrastructure/api/RouteService';

const routeService = new RouteService();

export const useRoutes = (filters?: {
  vesselType?: string;
  fuelType?: string;
  year?: number;
}) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoutes();
  }, [filters?.vesselType, filters?.fuelType, filters?.year]);

  const fetchRoutes = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await routeService.getAllRoutes(filters);
      setRoutes(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setBaseline = async (routeId: string): Promise<void> => {
    try {
      await routeService.setBaseline(routeId);
      await fetchRoutes();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { routes, loading, error, refetch: fetchRoutes, setBaseline };
};

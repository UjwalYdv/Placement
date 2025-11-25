//
//  useComparison.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { useState, useEffect } from 'react';
import { ComparisonData } from '../../../core/domain/Route';
import { RouteService } from '../../infrastructure/api/RouteService';

const routeService = new RouteService();

export const useComparison = () => {
  const [data, setData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComparison();
  }, []);

  const fetchComparison = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const result = await routeService.getComparison();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch: fetchComparison };
};

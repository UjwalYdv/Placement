//
//  usePooling.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { useState } from 'react';
import { PoolMember, Pool } from '../../../core/domain/Pooling';
import { PoolingService } from '../../infrastructure/api/PoolingService';

const poolingService = new PoolingService();

export const usePooling = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPool = async (year: number, members: PoolMember[]): Promise<Pool> => {
    try {
      setLoading(true);
      setError(null);
      return await poolingService.createPool(year, members);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createPool, loading, error };
};

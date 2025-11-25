//
//  PoolingService.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { IPoolingService } from '../../../core/ports/IPoolingService';
import { Pool, PoolMember } from '../../../core/domain/Pooling';
import { apiClient } from './apiClient';

export class PoolingService implements IPoolingService {
  async createPool(year: number, members: PoolMember[]): Promise<Pool> {
    const response = await apiClient.post<Pool>('/pools', { year, members });
    return response.data;
  }

  async getPoolsByYear(year: number): Promise<Pool[]> {
    const response = await apiClient.get<Pool[]>('/pools', {
      params: { year },
    });
    return response.data;
  }
}

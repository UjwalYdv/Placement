//
//  IPoolingService.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { Pool, PoolMember } from '../domain/Pooling';

export interface IPoolingService {
  createPool(year: number, members: PoolMember[]): Promise<Pool>;
  getPoolsByYear(year: number): Promise<Pool[]>;
}

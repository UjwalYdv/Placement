//
//  PoolingRepository.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { IPoolingRepository } from '../../../core/ports/IPoolingRepository';
import { Pool, PoolMember } from '../../../core/domain/Pooling';
import { query } from '../../../infrastructure/db/connection';

export class PoolingRepository implements IPoolingRepository {
  async createPool(year: number): Promise<Pool> {
    const result = await query(
      'INSERT INTO pools (year) VALUES ($1) RETURNING *',
      [year]
    );
    
    const row = result.rows[0];
    return {
      id: row.id,
      year: row.year,
      createdAt: row.created_at,
    };
  }

  async addMembers(poolId: number, members: Omit<PoolMember, 'poolId'>[]): Promise<void> {
    for (const member of members) {
      await query(
        'INSERT INTO pool_members (pool_id, ship_id, cb_before, cb_after) VALUES ($1, $2, $3, $4)',
        [poolId, member.shipId, member.cbBefore, member.cbAfter]
      );
    }
  }

  async findPoolsByYear(year: number): Promise<Pool[]> {
    const result = await query(
      'SELECT * FROM pools WHERE year = $1 ORDER BY created_at DESC',
      [year]
    );
    
    return result.rows.map(row => ({
      id: row.id,
      year: row.year,
      createdAt: row.created_at,
    }));
  }

  async findMembersByPool(poolId: number): Promise<PoolMember[]> {
    const result = await query(
      'SELECT * FROM pool_members WHERE pool_id = $1',
      [poolId]
    );
    
    return result.rows.map(row => ({
      poolId: row.pool_id,
      shipId: row.ship_id,
      cbBefore: parseFloat(row.cb_before),
      cbAfter: parseFloat(row.cb_after),
    }));
  }
}

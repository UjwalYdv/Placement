//
//  BankingRepository.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { IBankingRepository } from '../../../core/ports/IBankingRepository';
import { BankEntry, BankingOperation } from '../../../core/domain/Banking';
import { query } from '../../../infrastructure/db/connection';

export class BankingRepository implements IBankingRepository {
  async bank(operation: BankingOperation): Promise<BankEntry> {
    const result = await query(
      'INSERT INTO bank_entries (ship_id, year, amount_gco2eq) VALUES ($1, $2, $3) RETURNING *',
      [operation.shipId, operation.year, operation.amount]
    );
    
    const row = result.rows[0];
    return {
      id: row.id,
      shipId: row.ship_id,
      year: row.year,
      amountGCO2eq: parseFloat(row.amount_gco2eq),
      createdAt: row.created_at,
    };
  }

  async apply(operation: BankingOperation): Promise<void> {
    await query(
      'INSERT INTO bank_entries (ship_id, year, amount_gco2eq) VALUES ($1, $2, $3)',
      [operation.shipId, operation.year, -operation.amount]
    );
  }

  async getTotalBanked(shipId: string, year: number): Promise<number> {
    const result = await query(
      'SELECT COALESCE(SUM(amount_gco2eq), 0) as total FROM bank_entries WHERE ship_id = $1 AND year <= $2',
      [shipId, year]
    );
    return parseFloat(result.rows[0].total);
  }

  async getRecords(shipId: string, year: number): Promise<BankEntry[]> {
    const result = await query(
      'SELECT * FROM bank_entries WHERE ship_id = $1 AND year = $2 ORDER BY created_at DESC',
      [shipId, year]
    );
    
    return result.rows.map(row => ({
      id: row.id,
      shipId: row.ship_id,
      year: row.year,
      amountGCO2eq: parseFloat(row.amount_gco2eq),
      createdAt: row.created_at,
    }));
  }
}

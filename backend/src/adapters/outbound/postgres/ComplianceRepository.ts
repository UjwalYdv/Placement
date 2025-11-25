//
//  ComplianceRepository.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { IComplianceRepository } from '../../../core/ports/IComplianceRepository';
import { ComplianceBalance, AdjustedComplianceBalance } from '../../../core/domain/Compliance';
import { query } from '../../../infrastructure/db/connection';

export class ComplianceRepository implements IComplianceRepository {
  async saveCB(cb: ComplianceBalance): Promise<void> {
    await query(
      `INSERT INTO ship_compliance (ship_id, year, cb_gco2eq, target_intensity, actual_intensity, energy_in_scope)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (ship_id, year) DO UPDATE SET
       cb_gco2eq = $3, target_intensity = $4, actual_intensity = $5, energy_in_scope = $6`,
      [cb.shipId, cb.year, cb.cbGCO2eq, cb.targetIntensity, cb.actualIntensity, cb.energyInScope]
    );
  }

  async findCB(shipId: string, year: number): Promise<ComplianceBalance | null> {
    const result = await query(
      'SELECT * FROM ship_compliance WHERE ship_id = $1 AND year = $2',
      [shipId, year]
    );
    
    if (!result.rows[0]) return null;
    
    const row = result.rows[0];
    return {
      shipId: row.ship_id,
      year: row.year,
      cbGCO2eq: parseFloat(row.cb_gco2eq),
      targetIntensity: parseFloat(row.target_intensity),
      actualIntensity: parseFloat(row.actual_intensity),
      energyInScope: parseFloat(row.energy_in_scope),
    };
  }

  async findAdjustedCB(shipId: string, year: number): Promise<AdjustedComplianceBalance | null> {
    const cb = await this.findCB(shipId, year);
    if (!cb) return null;

    const bankResult = await query(
      'SELECT COALESCE(SUM(amount_gco2eq), 0) as total FROM bank_entries WHERE ship_id = $1 AND year <= $2',
      [shipId, year]
    );

    const bankedApplied = parseFloat(bankResult.rows[0].total);
    const adjustedCbGCO2eq = cb.cbGCO2eq + bankedApplied;

    return {
      shipId,
      year,
      cbGCO2eq: cb.cbGCO2eq,
      adjustedCbGCO2eq,
      bankedApplied,
    };
  }
}

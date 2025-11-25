//
//  ComplianceService.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { IComplianceService } from '../../../core/ports/IComplianceService';
import { ComplianceBalance, AdjustedComplianceBalance } from '../../../core/domain/Compliance';
import { apiClient } from './apiClient';

export class ComplianceService implements IComplianceService {
  async getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance> {
    const response = await apiClient.get<ComplianceBalance>('/compliance/cb', {
      params: { shipId, year },
    });
    return response.data;
  }

  async getAdjustedCB(shipId: string, year: number): Promise<AdjustedComplianceBalance> {
    const response = await apiClient.get<AdjustedComplianceBalance>('/compliance/adjusted-cb', {
      params: { shipId, year },
    });
    return response.data;
  }
}

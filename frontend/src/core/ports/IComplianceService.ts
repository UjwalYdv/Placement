//
//  IComplianceService.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { ComplianceBalance, AdjustedComplianceBalance } from '../domain/Compliance';

export interface IComplianceService {
  getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance>;
  getAdjustedCB(shipId: string, year: number): Promise<AdjustedComplianceBalance>;
}

//
//  IComplianceRepository.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { ComplianceBalance, AdjustedComplianceBalance } from '../domain/Compliance';

export interface IComplianceRepository {
  saveCB(cb: ComplianceBalance): Promise<void>;
  findCB(shipId: string, year: number): Promise<ComplianceBalance | null>;
  findAdjustedCB(shipId: string, year: number): Promise<AdjustedComplianceBalance | null>;
}

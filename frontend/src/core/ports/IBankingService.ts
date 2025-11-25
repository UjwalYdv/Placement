//
//  IBankingService.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { BankEntry, BankingOperation } from '../domain/Banking';

export interface IBankingService {
  bankSurplus(operation: BankingOperation): Promise<BankEntry>;
  applyBanked(operation: BankingOperation): Promise<void>;
  getRecords(shipId: string, year: number): Promise<BankEntry[]>;
}

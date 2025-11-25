//
//  IBankingRepository.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { BankEntry, BankingOperation } from '../domain/Banking';

export interface IBankingRepository {
  bank(operation: BankingOperation): Promise<BankEntry>;
  apply(operation: BankingOperation): Promise<void>;
  getTotalBanked(shipId: string, year: number): Promise<number>;
  getRecords(shipId: string, year: number): Promise<BankEntry[]>;
}

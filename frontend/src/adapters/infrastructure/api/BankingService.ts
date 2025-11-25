//
//  BankingService.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { IBankingService } from '../../../core/ports/IBankingService';
import { BankEntry, BankingOperation } from '../../../core/domain/Banking';
import { apiClient } from './apiClient';

export class BankingService implements IBankingService {
  async bankSurplus(operation: BankingOperation): Promise<BankEntry> {
    const response = await apiClient.post<BankEntry>('/banking/bank', operation);
    return response.data;
  }

  async applyBanked(operation: BankingOperation): Promise<void> {
    await apiClient.post('/banking/apply', operation);
  }

  async getRecords(shipId: string, year: number): Promise<BankEntry[]> {
    const response = await apiClient.get<BankEntry[]>('/banking/records', {
      params: { shipId, year },
    });
    return response.data;
  }
}

//
//  ApplyBankedUseCase.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { BankingOperation } from '../domain/Banking';

export class ApplyBankedUseCase {
  execute(operation: BankingOperation, availableBanked: number): void {
    if (operation.amount <= 0) {
      throw new Error('Cannot apply non-positive amount');
    }

    if (operation.amount > availableBanked) {
      throw new Error(`Insufficient banked surplus. Available: ${availableBanked}, Requested: ${operation.amount}`);
    }

    // Business logic validated
  }
}

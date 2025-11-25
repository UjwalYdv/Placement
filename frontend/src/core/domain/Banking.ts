//
//  Banking.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

export interface BankEntry {
  id: number;
  shipId: string;
  year: number;
  amountGCO2eq: number;
  createdAt: string;
}

export interface BankingOperation {
  shipId: string;
  year: number;
  amount: number;
}

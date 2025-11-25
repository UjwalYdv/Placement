//
//  Pooling.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

export interface PoolMember {
  shipId: string;
  cbBefore: number;
  cbAfter?: number;
}

export interface Pool {
  poolId: number;
  year: number;
  members: PoolMember[];
  totalCbBefore: number;
  totalCbAfter: number;
  valid: boolean;
}

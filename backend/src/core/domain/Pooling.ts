//
//  Pooling.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//
export interface Pool {
  id: number;
  year: number;
  createdAt: Date;
}

export interface PoolMember {
  poolId: number;
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface PoolRequest {
  year: number;
  members: Array<{
    shipId: string;
    cbBefore: number;
  }>;
}

export interface PoolResult {
  poolId: number;
  year: number;
  members: Array<{
    shipId: string;
    cbBefore: number;
    cbAfter: number;
  }>;
  totalCbBefore: number;
  totalCbAfter: number;
  valid: boolean;
}


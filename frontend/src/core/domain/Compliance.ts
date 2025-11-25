//
//  Compliance.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

export interface ComplianceBalance {
  shipId: string;
  year: number;
  cbGCO2eq: number;
  targetIntensity: number;
  actualIntensity: number;
  energyInScope: number;
}

export interface AdjustedComplianceBalance {
  shipId: string;
  year: number;
  cbGCO2eq: number;
  adjustedCbGCO2eq: number;
  bankedApplied: number;
}

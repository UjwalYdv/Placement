//
//  ComputeComplianceBalanceUseCase.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { ComplianceBalance } from '../domain/Compliance';
import { COMPLIANCE_CONSTANTS } from '../domain/constants';

export class ComputeComplianceBalanceUseCase {
  execute(
    shipId: string,
    year: number,
    actualIntensity: number,
    fuelConsumption: number
  ): ComplianceBalance {
    const targetIntensity = COMPLIANCE_CONSTANTS.TARGET_INTENSITY_2025;
    const energyInScope = fuelConsumption * COMPLIANCE_CONSTANTS.ENERGY_CONVERSION_FACTOR;
    
    // CB = (Target - Actual) × Energy in scope
    const cbGCO2eq = (targetIntensity - actualIntensity) * energyInScope;

    return {
      shipId,
      year,
      cbGCO2eq,
      targetIntensity,
      actualIntensity,
      energyInScope,
    };
  }
}

//
//  ComputeCB.test.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { ComputeComplianceBalanceUseCase } from '../../src/core/application/ComputeComplianceBalanceUseCase';

describe('ComputeComplianceBalanceUseCase', () => {
  const useCase = new ComputeComplianceBalanceUseCase();

  it('should compute positive CB for better performance', () => {
    const result = useCase.execute('SHIP001', 2025, 88.0, 5000);

    expect(result.cbGCO2eq).toBeGreaterThan(0);
    expect(result.targetIntensity).toBe(89.3368);
  });

  it('should compute negative CB for worse performance', () => {
    const result = useCase.execute('SHIP001', 2025, 92.0, 5000);

    expect(result.cbGCO2eq).toBeLessThan(0);
  });

  it('should compute correct energy in scope', () => {
    const result = useCase.execute('SHIP001', 2025, 89.0, 5000);

    expect(result.energyInScope).toBe(5000 * 41000);
  });
});

//
//  ComputeComparison.test.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { ComputeComparisonUseCase } from '../../src/core/application/ComputeComparisonUseCase';
import { Route } from '../../src/core/domain/Route';

describe('ComputeComparisonUseCase', () => {
  const useCase = new ComputeComparisonUseCase();

  const baseline: Route = {
    id: 1,
    routeId: 'R001',
    vesselType: 'Container',
    fuelType: 'HFO',
    year: 2024,
    ghgIntensity: 91.0,
    fuelConsumption: 5000,
    distance: 12000,
    totalEmissions: 4500,
    isBaseline: true,
  };

  it('should compute correct percentage difference', () => {
    const comparison: Route = { ...baseline, routeId: 'R002', ghgIntensity: 88.0 };
    const result = useCase.execute(baseline, comparison);

    expect(result.percentDiff).toBeCloseTo(-3.297, 2);
  });

  it('should mark as compliant when comparison is better', () => {
    const comparison: Route = { ...baseline, routeId: 'R002', ghgIntensity: 88.0 };
    const result = useCase.execute(baseline, comparison);

    expect(result.compliant).toBe(true);
  });

  it('should mark as non-compliant when comparison is worse', () => {
    const comparison: Route = { ...baseline, routeId: 'R003', ghgIntensity: 95.0 };
    const result = useCase.execute(baseline, comparison);

    expect(result.compliant).toBe(false);
  });
});

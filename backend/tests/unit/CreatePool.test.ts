//
//  CreatePool.test.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { CreatePoolUseCase } from '../../src/core/application/CreatePoolUseCase';

describe('CreatePoolUseCase', () => {
  const useCase = new CreatePoolUseCase();

  it('should create valid pool with positive total CB', () => {
    const request = {
      year: 2025,
      members: [
        { shipId: 'SHIP001', cbBefore: 1000 },
        { shipId: 'SHIP002', cbBefore: -500 },
      ],
    };

    const result = useCase.execute(request);

    expect(result.valid).toBe(true);
    expect(result.totalCbBefore).toBe(500);
  });

  it('should throw error for negative total CB', () => {
    const request = {
      year: 2025,
      members: [
        { shipId: 'SHIP001', cbBefore: -1000 },
        { shipId: 'SHIP002', cbBefore: -500 },
      ],
    };

    expect(() => useCase.execute(request)).toThrow('Pool invalid');
  });

  it('should allocate surplus to deficit correctly', () => {
    const request = {
      year: 2025,
      members: [
        { shipId: 'SHIP001', cbBefore: 1000 },
        { shipId: 'SHIP002', cbBefore: -400 },
      ],
    };

    const result = useCase.execute(request);

    const ship1 = result.members.find(m => m.shipId === 'SHIP001');
    const ship2 = result.members.find(m => m.shipId === 'SHIP002');

    expect(ship1?.cbAfter).toBe(600);
    expect(ship2?.cbAfter).toBe(0);
  });

  it('should not allow deficit ship to exit worse', () => {
    const request = {
      year: 2025,
      members: [
        { shipId: 'SHIP001', cbBefore: 100 },
        { shipId: 'SHIP002', cbBefore: -500 },
      ],
    };

    const result = useCase.execute(request);
    const ship2 = result.members.find(m => m.shipId === 'SHIP002');

    expect(ship2!.cbAfter).toBeGreaterThanOrEqual(ship2!.cbBefore);
  });
});

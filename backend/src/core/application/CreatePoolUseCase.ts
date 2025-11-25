//
//  CreatePoolUseCase.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { PoolRequest, PoolResult, PoolMember } from '../domain/Pooling';

export class CreatePoolUseCase {
  execute(request: PoolRequest): PoolResult {
    const members = request.members;
    
    // Calculate total CB
    const totalCbBefore = members.reduce((sum, m) => sum + m.cbBefore, 0);
    
    // Validation: Sum of CB must be >= 0
    if (totalCbBefore < 0) {
      throw new Error(`Pool invalid: total CB is negative (${totalCbBefore})`);
    }

    // Greedy allocation algorithm
    const allocatedMembers = this.allocatePool(members);
    
    // Validate constraints
    this.validatePoolConstraints(members, allocatedMembers);

    const totalCbAfter = allocatedMembers.reduce((sum, m) => sum + m.cbAfter, 0);

    return {
      poolId: 0, // Will be set by repository
      year: request.year,
      members: allocatedMembers,
      totalCbBefore,
      totalCbAfter,
      valid: true,
    };
  }

  private allocatePool(
    members: Array<{ shipId: string; cbBefore: number }>
  ): Array<{ shipId: string; cbBefore: number; cbAfter: number }> {
    // Sort by CB descending (surplus ships first)
    const sorted = [...members].sort((a, b) => b.cbBefore - a.cbBefore);
    
    const allocated = sorted.map(m => ({
      shipId: m.shipId,
      cbBefore: m.cbBefore,
      cbAfter: m.cbBefore,
    }));

    // Transfer surplus to deficit
    for (let i = 0; i < allocated.length; i++) {
      if (allocated[i].cbAfter > 0) {
        // Surplus ship
        for (let j = allocated.length - 1; j > i; j--) {
          if (allocated[j].cbAfter < 0) {
            // Deficit ship
            const transfer = Math.min(allocated[i].cbAfter, -allocated[j].cbAfter);
            allocated[i].cbAfter -= transfer;
            allocated[j].cbAfter += transfer;
            
            if (allocated[i].cbAfter === 0) break;
          }
        }
      }
    }

    return allocated;
  }

  private validatePoolConstraints(
    before: Array<{ shipId: string; cbBefore: number }>,
    after: Array<{ shipId: string; cbBefore: number; cbAfter: number }>
  ): void {
    for (let i = 0; i < before.length; i++) {
      const b = before[i];
      const a = after[i];

      // Deficit ship cannot exit worse
      if (b.cbBefore < 0 && a.cbAfter < b.cbBefore) {
        throw new Error(`Ship ${a.shipId}: deficit ship cannot exit worse`);
      }

      // Surplus ship cannot exit negative
      if (b.cbBefore > 0 && a.cbAfter < 0) {
        throw new Error(`Ship ${a.shipId}: surplus ship cannot exit negative`);
      }
    }
  }
}

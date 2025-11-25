//
//  PoolingController.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { Request, Response } from 'express';
import { IPoolingRepository } from '../../../core/ports/IPoolingRepository';
import { CreatePoolUseCase } from '../../../core/application/CreatePoolUseCase';

export class PoolingController {
  constructor(
    private poolingRepo: IPoolingRepository,
    private createPoolUseCase: CreatePoolUseCase
  ) {}

  createPool = async (req: Request, res: Response): Promise<void> => {
    try {
      const { year, members } = req.body;

      const poolResult = this.createPoolUseCase.execute({ year, members });
      
      const pool = await this.poolingRepo.createPool(year);
      await this.poolingRepo.addMembers(pool.id, poolResult.members);

      poolResult.poolId = pool.id;
      res.json(poolResult);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getPools = async (req: Request, res: Response): Promise<void> => {
    try {
      const { year } = req.query;

      if (!year) {
        res.status(400).json({ error: 'year is required' });
        return;
      }

      const pools = await this.poolingRepo.findPoolsByYear(parseInt(year as string));
      res.json(pools);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}

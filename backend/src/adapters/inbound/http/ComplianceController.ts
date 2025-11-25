//
//  ComplianceController.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { Request, Response } from 'express';
import { IComplianceRepository } from '../../../core/ports/IComplianceRepository';
import { ComputeComplianceBalanceUseCase } from '../../../core/application/ComputeComplianceBalanceUseCase';

export class ComplianceController {
  constructor(
    private complianceRepo: IComplianceRepository,
    private computeCBUseCase: ComputeComplianceBalanceUseCase
  ) {}

  getComplianceBalance = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shipId, year } = req.query;
      
      if (!shipId || !year) {
        res.status(400).json({ error: 'shipId and year are required' });
        return;
      }

      const cb = await this.complianceRepo.findCB(
        shipId as string,
        parseInt(year as string)
      );

      if (!cb) {
        res.status(404).json({ error: 'Compliance balance not found' });
        return;
      }

      res.json(cb);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  computeAndSaveCB = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shipId, year, actualIntensity, fuelConsumption } = req.body;

      const cb = this.computeCBUseCase.execute(
        shipId,
        year,
        actualIntensity,
        fuelConsumption
      );

      await this.complianceRepo.saveCB(cb);
      res.json(cb);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getAdjustedCB = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shipId, year } = req.query;
      
      if (!shipId || !year) {
        res.status(400).json({ error: 'shipId and year are required' });
        return;
      }

      const adjusted = await this.complianceRepo.findAdjustedCB(
        shipId as string,
        parseInt(year as string)
      );

      if (!adjusted) {
        res.status(404).json({ error: 'Adjusted CB not found' });
        return;
      }

      res.json(adjusted);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}

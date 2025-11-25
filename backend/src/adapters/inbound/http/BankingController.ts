//
//  BankingController.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { Request, Response } from 'express';
import { IBankingRepository } from '../../../core/ports/IBankingRepository';
import { BankSurplusUseCase } from '../../../core/application/BankSurplusUseCase';
import { ApplyBankedUseCase } from '../../../core/application/ApplyBankedUseCase';

export class BankingController {
  constructor(
    private bankingRepo: IBankingRepository,
    private bankSurplusUseCase: BankSurplusUseCase,
    private applyBankedUseCase: ApplyBankedUseCase
  ) {}

  bankSurplus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shipId, year, amount } = req.body;

      this.bankSurplusUseCase.execute({ shipId, year, amount });
      const entry = await this.bankingRepo.bank({ shipId, year, amount });

      res.json(entry);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  applyBanked = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shipId, year, amount } = req.body;

      const available = await this.bankingRepo.getTotalBanked(shipId, year);
      this.applyBankedUseCase.execute({ shipId, year, amount }, available);
      
      await this.bankingRepo.apply({ shipId, year, amount });

      res.json({ message: 'Banked surplus applied', amount, available: available - amount });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getRecords = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shipId, year } = req.query;

      if (!shipId || !year) {
        res.status(400).json({ error: 'shipId and year are required' });
        return;
      }

      const records = await this.bankingRepo.getRecords(
        shipId as string,
        parseInt(year as string)
      );

      res.json(records);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}

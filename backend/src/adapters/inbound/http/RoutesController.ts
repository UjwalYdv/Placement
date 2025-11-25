//
//  RoutesController.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { Request, Response } from 'express';
import { IRouteRepository } from '../../../core/ports/IRouteRepository';
import { ComputeComparisonUseCase } from '../../../core/application/ComputeComparisonUseCase';

export class RoutesController {
  constructor(
    private routeRepo: IRouteRepository,
    private compareUseCase: ComputeComparisonUseCase
  ) {}

  getAllRoutes = async (req: Request, res: Response): Promise<void> => {
    try {
      const { vesselType, fuelType, year } = req.query;
      
      const filters: any = {};
      if (vesselType) filters.vesselType = vesselType as string;
      if (fuelType) filters.fuelType = fuelType as string;
      if (year) filters.year = parseInt(year as string);

      const routes = Object.keys(filters).length > 0
        ? await this.routeRepo.findByFilters(filters)
        : await this.routeRepo.findAll();

      res.json(routes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  setBaseline = async (req: Request, res: Response): Promise<void> => {
    try {
      const { routeId } = req.params;
      await this.routeRepo.setBaseline(routeId);
      res.json({ message: 'Baseline set successfully', routeId });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getComparison = async (req: Request, res: Response): Promise<void> => {
    try {
      const baseline = await this.routeRepo.findBaseline();
      if (!baseline) {
        res.status(404).json({ error: 'No baseline route set' });
        return;
      }

      const allRoutes = await this.routeRepo.findAll();
      const comparisons = allRoutes
        .filter(r => !r.isBaseline)
        .map(r => this.compareUseCase.execute(baseline, r));

      res.json({ baseline, comparisons });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}

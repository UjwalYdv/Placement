//
//  IRouteService.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { Route, ComparisonData } from '../domain/Route';

export interface IRouteService {
  getAllRoutes(filters?: {
    vesselType?: string;
    fuelType?: string;
    year?: number;
  }): Promise<Route[]>;
  setBaseline(routeId: string): Promise<void>;
  getComparison(): Promise<ComparisonData>;
}

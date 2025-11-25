//
//  Route.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

export interface Route {
  id: number;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
}

export interface RouteComparison {
  baseline: Route;
  comparison: Route;
  percentDiff: number;
  compliant: boolean;
}

export interface ComparisonData {
  baseline: Route;
  comparisons: RouteComparison[];
}

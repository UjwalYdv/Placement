//
//  RouteService.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { IRouteService } from '../../../core/ports/IRouteService';
import { Route, ComparisonData } from '../../../core/domain/Route';
import { apiClient } from './apiClient';

export class RouteService implements IRouteService {
  async getAllRoutes(filters?: {
    vesselType?: string;
    fuelType?: string;
    year?: number;
  }): Promise<Route[]> {
    const params = new URLSearchParams();
    if (filters?.vesselType) params.append('vesselType', filters.vesselType);
    if (filters?.fuelType) params.append('fuelType', filters.fuelType);
    if (filters?.year) params.append('year', filters.year.toString());

    const response = await apiClient.get<Route[]>(`/routes?${params.toString()}`);
    return response.data;
  }

  async setBaseline(routeId: string): Promise<void> {
    await apiClient.post(`/routes/${routeId}/baseline`);
  }

  async getComparison(): Promise<ComparisonData> {
    const response = await apiClient.get<ComparisonData>('/routes/comparison');
    return response.data;
  }
}

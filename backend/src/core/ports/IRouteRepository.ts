//
//  IRouteRepository.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { Route } from '../domain/Route';

export interface IRouteRepository {
  findAll(): Promise<Route[]>;
  findById(id: number): Promise<Route | null>;
  findByRouteId(routeId: string): Promise<Route | null>;
  findBaseline(): Promise<Route | null>;
  setBaseline(routeId: string): Promise<void>;
  create(route: Omit<Route, 'id'>): Promise<Route>;
  findByFilters(filters: {
    vesselType?: string;
    fuelType?: string;
    year?: number;
  }): Promise<Route[]>;
}

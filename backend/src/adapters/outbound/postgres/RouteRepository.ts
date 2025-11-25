//
//  RouteRepository.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { IRouteRepository } from '../../../core/ports/IRouteRepository';
import { Route } from '../../../core/domain/Route';
import { query } from '../../../infrastructure/db/connection';

export class RouteRepository implements IRouteRepository {
  async findAll(): Promise<Route[]> {
    const result = await query('SELECT * FROM routes ORDER BY year DESC, route_id');
    return result.rows.map(this.mapToRoute);
  }

  async findById(id: number): Promise<Route | null> {
    const result = await query('SELECT * FROM routes WHERE id = $1', [id]);
    return result.rows[0] ? this.mapToRoute(result.rows[0]) : null;
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    const result = await query('SELECT * FROM routes WHERE route_id = $1', [routeId]);
    return result.rows[0] ? this.mapToRoute(result.rows[0]) : null;
  }

  async findBaseline(): Promise<Route | null> {
    const result = await query('SELECT * FROM routes WHERE is_baseline = true LIMIT 1');
    return result.rows[0] ? this.mapToRoute(result.rows[0]) : null;
  }

  async setBaseline(routeId: string): Promise<void> {
    await query('UPDATE routes SET is_baseline = false');
    await query('UPDATE routes SET is_baseline = true WHERE route_id = $1', [routeId]);
  }

  async create(route: Omit<Route, 'id'>): Promise<Route> {
    const result = await query(
      `INSERT INTO routes (route_id, vessel_type, fuel_type, year, ghg_intensity, 
       fuel_consumption, distance, total_emissions, is_baseline)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        route.routeId,
        route.vesselType,
        route.fuelType,
        route.year,
        route.ghgIntensity,
        route.fuelConsumption,
        route.distance,
        route.totalEmissions,
        route.isBaseline,
      ]
    );
    return this.mapToRoute(result.rows[0]);
  }

  async findByFilters(filters: {
    vesselType?: string;
    fuelType?: string;
    year?: number;
  }): Promise<Route[]> {
    const conditions: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (filters.vesselType) {
      conditions.push(`vessel_type = $${paramCount++}`);
      values.push(filters.vesselType);
    }
    if (filters.fuelType) {
      conditions.push(`fuel_type = $${paramCount++}`);
      values.push(filters.fuelType);
    }
    if (filters.year) {
      conditions.push(`year = $${paramCount++}`);
      values.push(filters.year);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT * FROM routes ${whereClause} ORDER BY year DESC, route_id`;
    
    const result = await query(sql, values);
    return result.rows.map(this.mapToRoute);
  }

  private mapToRoute(row: any): Route {
    return {
      id: row.id,
      routeId: row.route_id,
      vesselType: row.vessel_type,
      fuelType: row.fuel_type,
      year: row.year,
      ghgIntensity: parseFloat(row.ghg_intensity),
      fuelConsumption: parseFloat(row.fuel_consumption),
      distance: parseFloat(row.distance),
      totalEmissions: parseFloat(row.total_emissions),
      isBaseline: row.is_baseline,
    };
  }
}

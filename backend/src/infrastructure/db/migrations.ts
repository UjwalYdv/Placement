//
//  migrations.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { pool } from './connection';

export async function runMigrations(): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Routes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS routes (
        id SERIAL PRIMARY KEY,
        route_id VARCHAR(50) UNIQUE NOT NULL,
        vessel_type VARCHAR(50) NOT NULL,
        fuel_type VARCHAR(50) NOT NULL,
        year INTEGER NOT NULL,
        ghg_intensity DECIMAL(10, 4) NOT NULL,
        fuel_consumption DECIMAL(12, 2) NOT NULL,
        distance DECIMAL(10, 2) NOT NULL,
        total_emissions DECIMAL(12, 2) NOT NULL,
        is_baseline BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ship compliance table
    await client.query(`
      CREATE TABLE IF NOT EXISTS ship_compliance (
        id SERIAL PRIMARY KEY,
        ship_id VARCHAR(50) NOT NULL,
        year INTEGER NOT NULL,
        cb_gco2eq DECIMAL(15, 2) NOT NULL,
        target_intensity DECIMAL(10, 4) NOT NULL,
        actual_intensity DECIMAL(10, 4) NOT NULL,
        energy_in_scope DECIMAL(15, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(ship_id, year)
      );
    `);

    // Bank entries table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bank_entries (
        id SERIAL PRIMARY KEY,
        ship_id VARCHAR(50) NOT NULL,
        year INTEGER NOT NULL,
        amount_gco2eq DECIMAL(15, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Pools table
    await client.query(`
      CREATE TABLE IF NOT EXISTS pools (
        id SERIAL PRIMARY KEY,
        year INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Pool members table
    await client.query(`
      CREATE TABLE IF NOT EXISTS pool_members (
        id SERIAL PRIMARY KEY,
        pool_id INTEGER REFERENCES pools(id) ON DELETE CASCADE,
        ship_id VARCHAR(50) NOT NULL,
        cb_before DECIMAL(15, 2) NOT NULL,
        cb_after DECIMAL(15, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed data
    await client.query(`
      INSERT INTO routes (route_id, vessel_type, fuel_type, year, ghg_intensity, fuel_consumption, distance, total_emissions, is_baseline)
      VALUES 
        ('R001', 'Container', 'HFO', 2024, 91.0, 5000, 12000, 4500, true),
        ('R002', 'BulkCarrier', 'LNG', 2024, 88.0, 4800, 11500, 4200, false),
        ('R003', 'Tanker', 'MGO', 2024, 93.5, 5100, 12500, 4700, false),
        ('R004', 'RoRo', 'HFO', 2025, 89.2, 4900, 11800, 4300, false),
        ('R005', 'Container', 'LNG', 2025, 90.5, 4950, 11900, 4400, false)
      ON CONFLICT (route_id) DO NOTHING;
    `);

    await client.query('COMMIT');
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

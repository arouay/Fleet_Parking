import { Pool } from 'pg';
import { Fleet } from '../Domain/Entities/Fleet';
import { Vehicle } from '../Domain/Entities/Vehicle';
import { Location } from '../Domain/ValueObjects/Location';
import { FleetRepository } from '../Domain/Repositories/FleetRepository';
import { DomainError } from '../Domain/Exceptions/DomainError';

export class PostgresFleetRepository implements FleetRepository {
  constructor(private readonly pool: Pool) {}

  async init(): Promise<void> {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS fleets (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL
      )
    `);
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        plate_number TEXT PRIMARY KEY,
        lat DOUBLE PRECISION,
        lng DOUBLE PRECISION,
        alt DOUBLE PRECISION
      )
    `);
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS fleet_vehicles (
        fleet_id TEXT REFERENCES fleets(id),
        plate_number TEXT REFERENCES vehicles(plate_number),
        PRIMARY KEY (fleet_id, plate_number)
      )
    `);
  }

  async save(fleet: Fleet): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const vehiclesResult = await client.query(
        'SELECT plate_number FROM fleet_vehicles WHERE fleet_id = $1',
        [fleet.id]
      );
      const existingPlates = new Set(
        vehiclesResult.rows.map((row: { plate_number: string }) => row.plate_number)
      );

      const vehicles = fleet.getRegisteredVehicles();

      for (const vehicle of vehicles) {
        await client.query(
          `INSERT INTO vehicles (plate_number, lat, lng, alt)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (plate_number) DO UPDATE SET lat = $2, lng = $3, alt = $4`,
          [
            vehicle.plateNumber,
            vehicle.location?.lat ?? null,
            vehicle.location?.lng ?? null,
            vehicle.location?.alt ?? null,
          ]
        );

        if (!existingPlates.has(vehicle.plateNumber)) {
          await client.query(
            'INSERT INTO fleet_vehicles (fleet_id, plate_number) VALUES ($1, $2)',
            [fleet.id, vehicle.plateNumber]
          );
        }
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async getById(id: string): Promise<Fleet> {
    const fleetResult = await this.pool.query(
      'SELECT id FROM fleets WHERE id = $1',
      [id]
    );

    if (fleetResult.rows.length === 0) {
      throw new DomainError(`Fleet not found: ${id}`);
    }

    const fleet = new Fleet(fleetResult.rows[0].id);

    const vehiclesResult = await this.pool.query(
      `SELECT v.plate_number, v.lat, v.lng, v.alt
       FROM vehicles v
       JOIN fleet_vehicles fv ON fv.plate_number = v.plate_number
       WHERE fv.fleet_id = $1`,
      [id]
    );

    for (const row of vehiclesResult.rows) {
      const vehicle = new Vehicle(row.plate_number);
      if (row.lat !== null && row.lng !== null) {
        vehicle.park(new Location(row.lat, row.lng, row.alt ?? undefined));
      }
      fleet.registerVehicle(vehicle);
    }

    return fleet;
  }

  async create(userId: string): Promise<Fleet> {
    const id = `fleet-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const fleet = new Fleet(id);

    await this.pool.query(
      'INSERT INTO fleets (id, user_id) VALUES ($1, $2)',
      [id, userId]
    );

    return fleet;
  }
}

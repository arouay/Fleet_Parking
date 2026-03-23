import Database from 'better-sqlite3';
import { Fleet } from '../Domain/Entities/Fleet';
import { Vehicle } from '../Domain/Entities/Vehicle';
import { Location } from '../Domain/ValueObjects/Location';
import { FleetRepository } from '../Domain/Repositories/FleetRepository';
import { DomainError } from '../Domain/Exceptions/DomainError';

export class SqliteFleetRepository implements FleetRepository {
  private db: Database.Database;

  constructor() {
    this.db = new Database();
  }

  async init(): Promise<void> {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS fleets (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL
      )
    `);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS vehicles (
        plate_number TEXT PRIMARY KEY,
        lat REAL,
        lng REAL,
        alt REAL
      )
    `);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS fleet_vehicles (
        fleet_id TEXT REFERENCES fleets(id),
        plate_number TEXT REFERENCES vehicles(plate_number),
        PRIMARY KEY (fleet_id, plate_number)
      )
    `);
  }

  async save(fleet: Fleet): Promise<void> {
    const saveTransaction = this.db.transaction(() => {
      this.db.prepare(
        'INSERT OR IGNORE INTO fleets (id, user_id) VALUES (?, ?)'
      ).run(fleet.id, fleet.id);

      const existingRows = this.db.prepare(
        'SELECT plate_number FROM fleet_vehicles WHERE fleet_id = ?'
      ).all(fleet.id) as Array<{ plate_number: string }>;

      const existingPlates = new Set(existingRows.map(r => r.plate_number));

      for (const vehicle of fleet.getRegisteredVehicles()) {
        this.db.prepare(
          `INSERT INTO vehicles (plate_number, lat, lng, alt)
           VALUES (?, ?, ?, ?)
           ON CONFLICT (plate_number) DO UPDATE SET lat = ?, lng = ?, alt = ?`
        ).run(
          vehicle.plateNumber,
          vehicle.location?.lat ?? null,
          vehicle.location?.lng ?? null,
          vehicle.location?.alt ?? null,
          vehicle.location?.lat ?? null,
          vehicle.location?.lng ?? null,
          vehicle.location?.alt ?? null,
        );

        if (!existingPlates.has(vehicle.plateNumber)) {
          this.db.prepare(
            'INSERT INTO fleet_vehicles (fleet_id, plate_number) VALUES (?, ?)'
          ).run(fleet.id, vehicle.plateNumber);
        }
      }
    });

    saveTransaction();
  }

  async getById(id: string): Promise<Fleet> {
    const row = this.db.prepare('SELECT id FROM fleets WHERE id = ?').get(id) as { id: string } | undefined;

    if (!row) {
      throw new DomainError(`Fleet not found: ${id}`);
    }

    const fleet = new Fleet(row.id);

    const vehicleRows = this.db.prepare(`
      SELECT v.plate_number, v.lat, v.lng, v.alt
      FROM vehicles v
      JOIN fleet_vehicles fv ON fv.plate_number = v.plate_number
      WHERE fv.fleet_id = ?
    `).all(id) as Array<{ plate_number: string; lat: number | null; lng: number | null; alt: number | null }>;

    for (const vRow of vehicleRows) {
      const vehicle = new Vehicle(vRow.plate_number);
      if (vRow.lat !== null && vRow.lng !== null) {
        vehicle.park(new Location(vRow.lat, vRow.lng, vRow.alt ?? undefined));
      }
      fleet.registerVehicle(vehicle);
    }

    return fleet;
  }

  async create(userId: string): Promise<Fleet> {
    const id = `fleet-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const fleet = new Fleet(id);

    this.db.prepare('INSERT INTO fleets (id, user_id) VALUES (?, ?)').run(id, userId);

    return fleet;
  }

  close(): void {
    this.db.close();
  }
}

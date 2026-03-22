import { setWorldConstructor, World, Before, After } from '@cucumber/cucumber';
import { Pool } from 'pg';
import { Fleet } from '../src/Domain/Entities/Fleet';
import { Vehicle } from '../src/Domain/Entities/Vehicle';
import { Location } from '../src/Domain/ValueObjects/Location';
import { FleetRepository } from '../src/Domain/Repositories/FleetRepository';
import { PostgresFleetRepository } from '../src/Infra/PostgresFleetRepository';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://localhost:5432/fleet_test';

export class FleetWorld extends World {
  myFleet!: Fleet;
  otherFleet!: Fleet;
  vehicle!: Vehicle;
  location!: Location;
  error: Error | null = null;
  repository!: FleetRepository;
  pool!: Pool;
}

setWorldConstructor(FleetWorld);

Before(async function (this: FleetWorld) {
  this.pool = new Pool({ connectionString: DATABASE_URL });
  const repo = new PostgresFleetRepository(this.pool);
  await repo.init();

  await this.pool.query('DELETE FROM fleet_vehicles');
  await this.pool.query('DELETE FROM vehicles');
  await this.pool.query('DELETE FROM fleets');

  this.repository = repo;
});

After(async function (this: FleetWorld) {
  await this.pool.end();
});

import { setWorldConstructor, World, Before, After } from '@cucumber/cucumber';
import { Pool } from 'pg';
import { Fleet } from '../src/Domain/Entities/Fleet';
import { Vehicle } from '../src/Domain/Entities/Vehicle';
import { Location } from '../src/Domain/ValueObjects/Location';
import { FleetRepository } from '../src/Domain/Repositories/FleetRepository';
import { PostgresFleetRepository } from '../src/Infra/PostgresFleetRepository';
import { DATABASE_CONFIG } from '../src/Infra/Config/database';

export class FleetWorld extends World {
  myFleet!: Fleet;
  otherFleet!: Fleet;
  vehicle!: Vehicle;
  location!: Location;
  error: Error | null = null;
  repository!: FleetRepository;
  pool!: Pool;

  constructor(options: ConstructorParameters<typeof World>[0]) {
    super(options);
    
    this.pool = new Pool(DATABASE_CONFIG);
    this.repository = new PostgresFleetRepository(this.pool);
  }
}

setWorldConstructor(FleetWorld);

Before(async function (this: FleetWorld) {
  await this.repository.init();

  await this.pool.query('DELETE FROM fleet_vehicles');
  await this.pool.query('DELETE FROM vehicles');
  await this.pool.query('DELETE FROM fleets');
});

After(async function (this: FleetWorld) {
  await this.pool.end();
});

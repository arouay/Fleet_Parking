import { setWorldConstructor, World, After } from '@cucumber/cucumber';
import { Fleet } from '../src/Domain/Entities/Fleet';
import { Vehicle } from '../src/Domain/Entities/Vehicle';
import { Location } from '../src/Domain/ValueObjects/Location';
import { FleetRepository } from '../src/Domain/Repositories/FleetRepository';
import { SqliteFleetRepository } from '../src/Infra/SqliteFleetRepository';

export class FleetWorld extends World {
  myFleet!: Fleet;
  otherFleet!: Fleet;
  vehicle!: Vehicle;
  location!: Location;
  error: Error | null = null;
  repository: FleetRepository;
  sqliteRepo: SqliteFleetRepository;

  constructor(options: ConstructorParameters<typeof World>[0]) {
    super(options);
    this.sqliteRepo = new SqliteFleetRepository(':memory:');
    this.repository = this.sqliteRepo;
  }
}

setWorldConstructor(FleetWorld);

After(function (this: FleetWorld) {
  this.sqliteRepo.close();
});

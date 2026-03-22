import { setWorldConstructor, World } from '@cucumber/cucumber';
import { Fleet } from '../src/Domain/Entities/Fleet';
import { Vehicle } from '../src/Domain/Entities/Vehicle';
import { Location } from '../src/Domain/ValueObjects/Location';
import { FleetRepository } from '../src/Domain/Repositories/FleetRepository';
import { InMemoryFleetRepository } from '../src/Infra/InMemoryFleetRepository';

export class FleetWorld extends World {
  myFleet!: Fleet;
  otherFleet!: Fleet;
  vehicle!: Vehicle;
  location!: Location;
  error: Error | null = null;
  repository: FleetRepository = new InMemoryFleetRepository();
}

setWorldConstructor(FleetWorld);

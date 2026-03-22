import { setWorldConstructor, World } from '@cucumber/cucumber';
import { Fleet } from '../src/Domain/Entities/Fleet';
import { Vehicle } from '../src/Domain/Entities/Vehicle';
import { Location } from '../src/Domain/ValueObjects/Location';

export class FleetWorld extends World {
  myFleet!: Fleet;
  otherFleet!: Fleet;
  vehicle!: Vehicle;
  location!: Location;
  error: Error | null = null;
}

setWorldConstructor(FleetWorld);

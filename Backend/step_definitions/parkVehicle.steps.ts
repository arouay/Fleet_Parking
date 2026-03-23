import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { Location } from '../src/Domain/ValueObjects/Location';
import { ParkVehicleCommand } from '../src/App/Commands/ParkVehicleCommand';
import { ParkVehicleHandler } from '../src/App/Handlers/ParkVehicleHandler';
import { VehicleAlreadyParkedError } from '../src/Domain/Exceptions/VehicleAlreadyParkedError';
import { FleetWorld } from './world';

Given('a location', function (this: FleetWorld) {
  this.location = new Location(48.8566, 2.3522);
});

Given('my vehicle has been parked into this location', async function (this: FleetWorld) {
  const handler = new ParkVehicleHandler(this.repository);
  await handler.handle(new ParkVehicleCommand(
    this.myFleet.id, this.vehicle.plateNumber,
    this.location.lat, this.location.lng, this.location.alt
  ));
  this.myFleet = await this.repository.getById(this.myFleet.id);
});

When('I park my vehicle at this location', async function (this: FleetWorld) {
  try {
    const handler = new ParkVehicleHandler(this.repository);
    await handler.handle(new ParkVehicleCommand(
      this.myFleet.id, this.vehicle.plateNumber,
      this.location.lat, this.location.lng, this.location.alt
    ));
    this.myFleet = await this.repository.getById(this.myFleet.id);
    this.error = null;
  } catch (err) {
    this.error = err as Error;
  }
});

When('I try to park my vehicle at this location', async function (this: FleetWorld) {
  try {
    const handler = new ParkVehicleHandler(this.repository);
    await handler.handle(new ParkVehicleCommand(
      this.myFleet.id, this.vehicle.plateNumber,
      this.location.lat, this.location.lng, this.location.alt
    ));
    this.error = null;
  } catch (err) {
    this.error = err as Error;
  }
});

Then('the known location of my vehicle should verify this location', async function (this: FleetWorld) {
  const fleet = await this.repository.getById(this.myFleet.id);
  const vehicleLocation = fleet.getVehicleLocation(this.vehicle);
  assert.notStrictEqual(vehicleLocation, null);
  assert.strictEqual(vehicleLocation!.equals(this.location), true);
});

Then('I should be informed that my vehicle is already parked at this location', function (this: FleetWorld) {
  assert.notStrictEqual(this.error, null);
  assert.ok(this.error instanceof VehicleAlreadyParkedError);
});

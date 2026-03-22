import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { Location } from '../src/Domain/ValueObjects/Location';
import { FleetWorld } from './world';

Given('a location', function (this: FleetWorld) {
  this.location = new Location(48.8566, 2.3522);
});

Given('my vehicle has been parked into this location', function (this: FleetWorld) {
  this.myFleet.parkVehicle(this.vehicle, this.location);
});

When('I park my vehicle at this location', function (this: FleetWorld) {
  try {
    this.myFleet.parkVehicle(this.vehicle, this.location);
    this.error = null;
  } catch (err) {
    this.error = err as Error;
  }
});

When('I try to park my vehicle at this location', function (this: FleetWorld) {
  try {
    this.myFleet.parkVehicle(this.vehicle, this.location);
    this.error = null;
  } catch (err) {
    this.error = err as Error;
  }
});

Then('the known location of my vehicle should verify this location', function (this: FleetWorld) {
  const vehicleLocation = this.myFleet.getVehicleLocation(this.vehicle);
  assert.notStrictEqual(vehicleLocation, null);
  assert.strictEqual(vehicleLocation!.equals(this.location), true);
});

Then('I should be informed that my vehicle is already parked at this location', function (this: FleetWorld) {
  assert.notStrictEqual(this.error, null);
  assert.strictEqual(this.error!.message, 'Vehicle is already parked at this location');
});

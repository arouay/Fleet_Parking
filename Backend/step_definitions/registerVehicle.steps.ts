import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { Fleet } from '../src/Domain/Entities/Fleet';
import { Vehicle } from '../src/Domain/Entities/Vehicle';
import { FleetWorld } from './world';

Given('my fleet', function (this: FleetWorld) {
  this.myFleet = new Fleet('fleet-1');
});

Given('a vehicle', function (this: FleetWorld) {
  this.vehicle = new Vehicle('ABC-123');
});

Given('I have registered this vehicle into my fleet', function (this: FleetWorld) {
  this.myFleet.registerVehicle(this.vehicle);
});

Given('the fleet of another user', function (this: FleetWorld) {
  this.otherFleet = new Fleet('fleet-2');
});

Given('this vehicle has been registered into the other user\'s fleet', function (this: FleetWorld) {
  this.otherFleet.registerVehicle(this.vehicle);
});

When('I register this vehicle into my fleet', function (this: FleetWorld) {
  try {
    this.myFleet.registerVehicle(this.vehicle);
    this.error = null;
  } catch (err) {
    this.error = err as Error;
  }
});

When('I try to register this vehicle into my fleet', function (this: FleetWorld) {
  try {
    this.myFleet.registerVehicle(this.vehicle);
    this.error = null;
  } catch (err) {
    this.error = err as Error;
  }
});

Then('this vehicle should be part of my vehicle fleet', function (this: FleetWorld) {
  assert.strictEqual(this.myFleet.hasVehicle(this.vehicle), true);
});

Then('I should be informed this this vehicle has already been registered into my fleet', function (this: FleetWorld) {
  assert.notStrictEqual(this.error, null);
  assert.strictEqual(this.error!.message, 'This vehicle has already been registered into this fleet');
});

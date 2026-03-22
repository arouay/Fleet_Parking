import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { Vehicle } from '../src/Domain/Entities/Vehicle';
import { CreateFleetCommand } from '../src/App/Commands/CreateFleetCommand';
import { CreateFleetHandler } from '../src/App/Handlers/CreateFleetHandler';
import { RegisterVehicleCommand } from '../src/App/Commands/RegisterVehicleCommand';
import { RegisterVehicleHandler } from '../src/App/Handlers/RegisterVehicleHandler';
import { FleetWorld } from './world';

Given('my fleet', async function (this: FleetWorld) {
  const handler = new CreateFleetHandler(this.repository);
  this.myFleet = await handler.handle(new CreateFleetCommand('user-1'));
});

Given('a vehicle', function (this: FleetWorld) {
  this.vehicle = new Vehicle('ABC-123');
});

Given('I have registered this vehicle into my fleet', async function (this: FleetWorld) {
  const handler = new RegisterVehicleHandler(this.repository);
  await handler.handle(new RegisterVehicleCommand(this.myFleet.id, this.vehicle.plateNumber));
  this.myFleet = await this.repository.getById(this.myFleet.id);
});

Given('the fleet of another user', async function (this: FleetWorld) {
  const handler = new CreateFleetHandler(this.repository);
  this.otherFleet = await handler.handle(new CreateFleetCommand('user-2'));
});

Given('this vehicle has been registered into the other user\'s fleet', async function (this: FleetWorld) {
  const handler = new RegisterVehicleHandler(this.repository);
  await handler.handle(new RegisterVehicleCommand(this.otherFleet.id, this.vehicle.plateNumber));
});

When('I register this vehicle into my fleet', async function (this: FleetWorld) {
  try {
    const handler = new RegisterVehicleHandler(this.repository);
    await handler.handle(new RegisterVehicleCommand(this.myFleet.id, this.vehicle.plateNumber));
    this.myFleet = await this.repository.getById(this.myFleet.id);
    this.error = null;
  } catch (err) {
    this.error = err as Error;
  }
});

When('I try to register this vehicle into my fleet', async function (this: FleetWorld) {
  try {
    const handler = new RegisterVehicleHandler(this.repository);
    await handler.handle(new RegisterVehicleCommand(this.myFleet.id, this.vehicle.plateNumber));
    this.error = null;
  } catch (err) {
    this.error = err as Error;
  }
});

Then('this vehicle should be part of my vehicle fleet', async function (this: FleetWorld) {
  const fleet = await this.repository.getById(this.myFleet.id);
  assert.strictEqual(fleet.hasVehicle(this.vehicle), true);
});

Then('I should be informed this this vehicle has already been registered into my fleet', function (this: FleetWorld) {
  assert.notStrictEqual(this.error, null);
  assert.strictEqual(this.error!.message, 'This vehicle has already been registered into this fleet');
});

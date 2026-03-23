#!/usr/bin/env ts-node

import { program } from 'commander';
import { Pool } from 'pg';
import { PostgresFleetRepository } from './Infra/PostgresFleetRepository';
import { DATABASE_CONFIG } from './Infra/Config/database';
import { CreateFleetHandler } from './App/Handlers/CreateFleetHandler';
import { RegisterVehicleHandler } from './App/Handlers/RegisterVehicleHandler';
import { ParkVehicleHandler } from './App/Handlers/ParkVehicleHandler';
import { CreateFleetCommand } from './App/Commands/CreateFleetCommand';
import { RegisterVehicleCommand } from './App/Commands/RegisterVehicleCommand';
import { ParkVehicleCommand } from './App/Commands/ParkVehicleCommand';

async function createRepository(): Promise<PostgresFleetRepository> {
  const pool = new Pool(DATABASE_CONFIG);

  const repo = new PostgresFleetRepository(pool);
  await repo.init();

  return repo;
}

program
  .name('fleet')
  .version('1.0.0');

program
  .command('create')
  .argument('<userId>', 'User ID')
  .action(async (userId: string) => {
    const repo = await createRepository();
    const handler = new CreateFleetHandler(repo);
    const fleet = await handler.handle(new CreateFleetCommand(userId));
    console.log(fleet.id);
  });

program
  .command('register-vehicle')
  .argument('<fleetId>', 'Fleet ID')
  .argument('<vehiclePlateNumber>', 'Vehicle plate number')
  .action(async (fleetId: string, vehiclePlateNumber: string) => {
    const repo = await createRepository();
    const handler = new RegisterVehicleHandler(repo);
    await handler.handle(new RegisterVehicleCommand(fleetId, vehiclePlateNumber));
  });

program
  .command('localize-vehicle')
  .argument('<fleetId>', 'Fleet ID')
  .argument('<vehiclePlateNumber>', 'Vehicle plate number')
  .argument('<lat>', 'Latitude', parseFloat)
  .argument('<lng>', 'Longitude', parseFloat)
  .argument('[alt]', 'Altitude', parseFloat)
  .action(async (fleetId: string, vehiclePlateNumber: string, lat: number, lng: number, alt?: number) => {
    const repo = await createRepository();
    const handler = new ParkVehicleHandler(repo);
    await handler.handle(new ParkVehicleCommand(fleetId, vehiclePlateNumber, lat, lng, alt));
  });

program.parseAsync(process.argv).catch((err: Error) => {
  console.error(err.message);
  process.exit(1);
});

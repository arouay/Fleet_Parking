#!/usr/bin/env ts-node

import { program } from 'commander';
import { Pool } from 'pg';
import { DATABASE_CONFIG } from './Infra/Config/database';
import { Container } from './Infra/IoC/Container';
import { CreateFleetHandler } from './App/Handlers/CreateFleetHandler';
import { RegisterVehicleHandler } from './App/Handlers/RegisterVehicleHandler';
import { ParkVehicleHandler } from './App/Handlers/ParkVehicleHandler';
import { CreateFleetCommand } from './App/Commands/CreateFleetCommand';
import { RegisterVehicleCommand } from './App/Commands/RegisterVehicleCommand';
import { ParkVehicleCommand } from './App/Commands/ParkVehicleCommand';
import { FleetRepository } from './Domain/Repositories/FleetRepository';
import { DomainError } from './Domain/Exceptions/DomainError';
import { TechnicalError } from './Infra/Exceptions/TechnicalError';

async function bootstrap(): Promise<Container> {
  const pool = new Pool(DATABASE_CONFIG);

  const container = new Container();
  container.register('pool', pool);
  await container.boot();

  const repo = container.get<FleetRepository>('fleetRepository');
  await repo.init();

  return container;
}

program
  .name('fleet')
  .version('1.0.0');

program
  .command('create')
  .argument('<userId>', 'User ID')
  .action(async (userId: string) => {
    const container = await bootstrap();
    const handler = container.get<CreateFleetHandler>('createFleetHandler');
    const fleet = await handler.handle(new CreateFleetCommand(userId));
    console.log(fleet.id);
  });

program
  .command('register-vehicle')
  .argument('<fleetId>', 'Fleet ID')
  .argument('<vehiclePlateNumber>', 'Vehicle plate number')
  .action(async (fleetId: string, vehiclePlateNumber: string) => {
    const container = await bootstrap();
    const handler = container.get<RegisterVehicleHandler>('registerVehicleHandler');
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
    const container = await bootstrap();
    const handler = container.get<ParkVehicleHandler>('parkVehicleHandler');
    await handler.handle(new ParkVehicleCommand(fleetId, vehiclePlateNumber, lat, lng, alt));
  });

program.parseAsync(process.argv).catch((err: Error) => {
  if (err instanceof DomainError) {
    console.error(`Error: ${err.message}`);
  } else if (err instanceof TechnicalError) {
    console.error(`Internal error: ${err.message}`);
  } else {
    console.error('An unexpected error occurred. Please try again.');
  }
  process.exit(1);
});

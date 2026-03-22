import { CreateFleetCommand } from '../Commands/CreateFleetCommand';
import { FleetRepository } from '../../Domain/Repositories/FleetRepository';
import { Fleet } from '../../Domain/Entities/Fleet';

export class CreateFleetHandler {
  constructor(private readonly fleetRepository: FleetRepository) {}

  async handle(command: CreateFleetCommand): Promise<Fleet> {
    return this.fleetRepository.create(command.userId);
  }
}

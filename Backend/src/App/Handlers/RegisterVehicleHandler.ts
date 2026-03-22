import { RegisterVehicleCommand } from '../Commands/RegisterVehicleCommand';
import { FleetRepository } from '../../Domain/Repositories/FleetRepository';
import { Vehicle } from '../../Domain/Entities/Vehicle';

export class RegisterVehicleHandler {
  constructor(private readonly fleetRepository: FleetRepository) {}

  async handle(command: RegisterVehicleCommand): Promise<void> {
    const fleet = await this.fleetRepository.getById(command.fleetId);
    const vehicle = new Vehicle(command.plateNumber);

    fleet.registerVehicle(vehicle);

    await this.fleetRepository.save(fleet);
  }
}

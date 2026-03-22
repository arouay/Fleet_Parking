import { RegisterVehicleCommand } from '../Commands/RegisterVehicleCommand';
import { FleetRepository } from '../../Domain/Repositories/FleetRepository';
import { Vehicle } from '../../Domain/Entities/Vehicle';

export class RegisterVehicleHandler {
  constructor(private readonly fleetRepository: FleetRepository) {}

  handle(command: RegisterVehicleCommand): void {
    const fleet = this.fleetRepository.getById(command.fleetId);
    const vehicle = new Vehicle(command.plateNumber);

    fleet.registerVehicle(vehicle);

    this.fleetRepository.save(fleet);
  }
}

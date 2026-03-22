import { ParkVehicleCommand } from '../Commands/ParkVehicleCommand';
import { FleetRepository } from '../../Domain/Repositories/FleetRepository';
import { Location } from '../../Domain/ValueObjects/Location';

export class ParkVehicleHandler {
  constructor(private readonly fleetRepository: FleetRepository) {}

  async handle(command: ParkVehicleCommand): Promise<void> {
    const fleet = await this.fleetRepository.getById(command.fleetId);
    const vehicle = fleet.getVehicle(command.plateNumber);
    const location = new Location(command.lat, command.lng, command.alt);

    fleet.parkVehicle(vehicle, location);

    await this.fleetRepository.save(fleet);
  }
}

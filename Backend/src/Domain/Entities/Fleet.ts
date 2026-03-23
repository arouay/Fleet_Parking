import { Vehicle } from './Vehicle';
import { Location } from '../ValueObjects/Location';
import { VehicleAlreadyRegisteredError } from '../Exceptions/VehicleAlreadyRegisteredError';
import { VehicleNotFoundError } from '../Exceptions/VehicleNotFoundError';
import { VehicleNotRegisteredError } from '../Exceptions/VehicleNotRegisteredError';

export class Fleet {
  private readonly vehicles: Map<string, Vehicle> = new Map();

  constructor(private readonly _id: string) {}

  get id(): string {
    return this._id;
  }

  registerVehicle(vehicle: Vehicle): void {
    if (this.vehicles.has(vehicle.plateNumber)) {
      throw new VehicleAlreadyRegisteredError();
    }
    this.vehicles.set(vehicle.plateNumber, vehicle);
  }

  hasVehicle(vehicle: Vehicle): boolean {
    return this.vehicles.has(vehicle.plateNumber);
  }

  getRegisteredVehicles(): Vehicle[] {
    return Array.from(this.vehicles.values());
  }

  getVehicle(plateNumber: string): Vehicle {
    const vehicle = this.vehicles.get(plateNumber);
    if (!vehicle) {
      throw new VehicleNotFoundError(plateNumber);
    }
    return vehicle;
  }

  parkVehicle(vehicle: Vehicle, location: Location): void {
    if (!this.hasVehicle(vehicle)) {
      throw new VehicleNotRegisteredError();
    }
    vehicle.park(location);
  }

  getVehicleLocation(vehicle: Vehicle): Location | null {
    const registered = this.vehicles.get(vehicle.plateNumber);
    if (!registered) {
      throw new VehicleNotRegisteredError();
    }
    return registered.location;
  }
}

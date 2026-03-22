import { Vehicle } from './Vehicle';
import { Location } from '../ValueObjects/Location';

export class Fleet {
  private readonly vehicles: Map<string, Vehicle> = new Map();

  constructor(private readonly _id: string) {}

  get id(): string {
    return this._id;
  }

  registerVehicle(vehicle: Vehicle): void {
    if (this.vehicles.has(vehicle.plateNumber)) {
      throw new Error('This vehicle has already been registered into this fleet');
    }
    this.vehicles.set(vehicle.plateNumber, vehicle);
  }

  hasVehicle(vehicle: Vehicle): boolean {
    return this.vehicles.has(vehicle.plateNumber);
  }

  getVehicle(plateNumber: string): Vehicle {
    const vehicle = this.vehicles.get(plateNumber);
    if (!vehicle) {
      throw new Error('Vehicle not found in this fleet');
    }
    return vehicle;
  }

  parkVehicle(vehicle: Vehicle, location: Location): void {
    if (!this.hasVehicle(vehicle)) {
      throw new Error('Vehicle is not registered in this fleet');
    }
    vehicle.park(location);
  }

  getVehicleLocation(vehicle: Vehicle): Location | null {
    if (!this.hasVehicle(vehicle)) {
      throw new Error('Vehicle is not registered in this fleet');
    }
    return vehicle.location;
  }
}

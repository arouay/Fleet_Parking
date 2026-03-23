export class VehicleAlreadyParkedError extends Error {
  constructor() {
    super('Vehicle is already parked at this location');
    this.name = 'VehicleAlreadyParkedError';
  }
}

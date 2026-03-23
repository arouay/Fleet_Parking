export class VehicleNotRegisteredError extends Error {
  constructor() {
    super('Vehicle is not registered in this fleet');
    this.name = 'VehicleNotRegisteredError';
  }
}

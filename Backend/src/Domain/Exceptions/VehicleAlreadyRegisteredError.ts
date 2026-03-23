export class VehicleAlreadyRegisteredError extends Error {
  constructor() {
    super('This vehicle has already been registered into this fleet');
    this.name = 'VehicleAlreadyRegisteredError';
  }
}

export class VehicleNotFoundError extends Error {
  constructor(plateNumber: string) {
    super(`Vehicle not found in this fleet: ${plateNumber}`);
    this.name = 'VehicleNotFoundError';
  }
}

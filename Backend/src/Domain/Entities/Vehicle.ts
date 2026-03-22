import { Location } from '../ValueObjects/Location';

export class Vehicle {
  private _location: Location | null = null;

  constructor(private readonly _plateNumber: string) {
    if (!_plateNumber) {
      throw new Error('Plate number is required');
    }
  }

  get plateNumber(): string {
    return this._plateNumber;
  }

  get location(): Location | null {
    return this._location;
  }

  park(location: Location): void {
    if (this._location && this._location.equals(location)) {
      throw new Error('Vehicle is already parked at this location');
    }
    this._location = location;
  }
}

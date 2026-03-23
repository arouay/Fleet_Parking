export class FleetNotFoundError extends Error {
  constructor(id: string) {
    super(`Fleet not found: ${id}`);
    this.name = 'FleetNotFoundError';
  }
}

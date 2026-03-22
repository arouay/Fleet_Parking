import { Fleet } from '../Domain/Entities/Fleet';
import { FleetRepository } from '../Domain/Repositories/FleetRepository';

export class InMemoryFleetRepository implements FleetRepository {
  private fleets: Map<string, Fleet> = new Map();
  private nextId = 1;

  async save(fleet: Fleet): Promise<void> {
    this.fleets.set(fleet.id, fleet);
  }

  async getById(id: string): Promise<Fleet> {
    const fleet = this.fleets.get(id);
    if (!fleet) {
      throw new Error(`Fleet not found: ${id}`);
    }
    return fleet;
  }

  async create(_userId: string): Promise<Fleet> {
    const id = `fleet-${this.nextId++}`;
    const fleet = new Fleet(id);
    await this.save(fleet);
    return fleet;
  }
}

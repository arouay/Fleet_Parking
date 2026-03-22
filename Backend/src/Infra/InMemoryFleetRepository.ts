import { Fleet } from '../Domain/Entities/Fleet';
import { FleetRepository } from '../Domain/Repositories/FleetRepository';

export class InMemoryFleetRepository implements FleetRepository {
  private fleets: Map<string, Fleet> = new Map();
  private nextId = 1;

  save(fleet: Fleet): void {
    this.fleets.set(fleet.id, fleet);
  }

  getById(id: string): Fleet {
    const fleet = this.fleets.get(id);
    if (!fleet) {
      throw new Error(`Fleet not found: ${id}`);
    }
    return fleet;
  }

  create(_userId: string): Fleet {
    const id = `fleet-${this.nextId++}`;
    const fleet = new Fleet(id);
    this.save(fleet);
    return fleet;
  }
}

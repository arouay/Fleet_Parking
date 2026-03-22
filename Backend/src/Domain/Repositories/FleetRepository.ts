import { Fleet } from '../Entities/Fleet';

export interface FleetRepository {
  save(fleet: Fleet): void;
  getById(id: string): Fleet;
  create(userId: string): Fleet;
}

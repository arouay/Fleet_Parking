import { Fleet } from '../Entities/Fleet';

export interface FleetRepository {
  init(): Promise<void>;
  save(fleet: Fleet): Promise<void>;
  getById(id: string): Promise<Fleet>;
  create(userId: string): Promise<Fleet>;
}

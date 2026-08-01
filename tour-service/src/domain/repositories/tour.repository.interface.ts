import { Tour } from '../models/tour.model';

export interface ITourRepository {
  create(tour: Tour): Promise<Tour>;
  findById(id: string): Promise<Tour | null>;
  findAll(): Promise<Tour[]>;
  update(tour: Tour): Promise<Tour>;
  delete(id: string): Promise<void>;
}

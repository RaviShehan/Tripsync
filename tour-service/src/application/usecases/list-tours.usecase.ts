import { Injectable, Inject } from '@nestjs/common';
import { TourDTO } from '../dtos/tour.dto';
import type { ITourRepository } from '../../domain/repositories/tour.repository.interface';

@Injectable()
export class ListToursUseCase {
  constructor(
    @Inject('ITourRepository')
    private readonly tourRepository: ITourRepository,
  ) {}

  async execute(): Promise<TourDTO[]> {
    const tours = await this.tourRepository.findAll();
    return tours.map((tour) => TourDTO.fromTour(tour));
  }
}

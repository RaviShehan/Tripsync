import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { TourDTO } from '../dtos/tour.dto';
import type { ITourRepository } from '../../domain/repositories/tour.repository.interface';

@Injectable()
export class GetTourByIdUseCase {
  constructor(
    @Inject('ITourRepository')
    private readonly tourRepository: ITourRepository,
  ) {}

  async execute(id: string): Promise<TourDTO> {
    const tour = await this.tourRepository.findById(id);
    if (!tour) {
      throw new NotFoundException(`Tour with id ${id} not found`);
    }
    return TourDTO.fromTour(tour);
  }
}

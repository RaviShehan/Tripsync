import { Injectable, Inject } from '@nestjs/common';
import { TourDTO } from '../dtos/tour.dto';
import { Tour } from '../../domain/models/tour.model';
import type { ITourRepository } from '../../domain/repositories/tour.repository.interface';

export interface CreateTourCommand {
  name: string;
  description: string;
  price: number;
  location?: string;
  durationHours?: number;
  category?: string;
  imageUrl?: string;
}

@Injectable()
export class CreateTourUseCase {
  constructor(
    @Inject('ITourRepository')
    private readonly tourRepository: ITourRepository,
  ) {}

  async execute(command: CreateTourCommand): Promise<TourDTO> {
    const tour = new Tour(
      'temp-id',
      command.name,
      command.description,
      command.price,
      command.location ?? '',
      command.durationHours ?? 3,
      command.category ?? 'ACTIVITY',
      command.imageUrl ?? null,
    );

    const savedTour = await this.tourRepository.create(tour);
    return TourDTO.fromTour(savedTour);
  }
}

import { Module } from '@nestjs/common';
import { TourController } from './presentation/controllers/tour.controller';
import { CreateTourUseCase } from './application/usecases/create-tour.usecase';
import { ListToursUseCase } from './application/usecases/list-tours.usecase';
import { GetTourByIdUseCase } from './application/usecases/get-tour-by-id.usecase';
import { PrismaTourRepository } from './infrastructure/repositories/prisma-tour.repository';
import { ITourRepository } from './domain/repositories/tour.repository.interface';

@Module({
  controllers: [TourController],
  providers: [
    CreateTourUseCase,
    ListToursUseCase,
    GetTourByIdUseCase,
    {
      provide: 'ITourRepository',
      useClass: PrismaTourRepository,
    },
  ],
})
export class TourModule {}

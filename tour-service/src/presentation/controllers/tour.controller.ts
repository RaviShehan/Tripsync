import { Controller, Get, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { CreateTourUseCase } from '../../application/usecases/create-tour.usecase';
import type { CreateTourCommand } from '../../application/usecases/create-tour.usecase';
import { ListToursUseCase } from '../../application/usecases/list-tours.usecase';
import { GetTourByIdUseCase } from '../../application/usecases/get-tour-by-id.usecase';

@Controller('api/v1/tours')
export class TourController {
  constructor(
    private readonly createTourUseCase: CreateTourUseCase,
    private readonly listToursUseCase: ListToursUseCase,
    private readonly getTourByIdUseCase: GetTourByIdUseCase,
  ) {}

  @Get()
  async listTours() {
    return this.listToursUseCase.execute();
  }

  @Get(':id')
  async getTourById(@Param('id', ParseUUIDPipe) id: string) {
    return this.getTourByIdUseCase.execute(id);
  }

  @Post()
  async createTour(@Body() command: CreateTourCommand) {
    return this.createTourUseCase.execute(command);
  }
}

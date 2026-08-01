import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { Tour } from '../../domain/models/tour.model';
import { ITourRepository } from '../../domain/repositories/tour.repository.interface';

@Injectable()
export class PrismaTourRepository implements ITourRepository, OnModuleInit, OnModuleDestroy {
  private prisma: PrismaClient;
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString:
        process.env.DATABASE_URL ||
        'postgresql://postgres:TripsyncR00t!Secret@localhost:5432/tripsync_db?schema=public',
    });
    const adapter = new PrismaPg(this.pool);
    this.prisma = new PrismaClient({ adapter });
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  private toDomain(tour: Record<string, any>): Tour {
    return new Tour(
      tour.id,
      tour.name,
      tour.description,
      Number(tour.price),
      tour.location ?? '',
      tour.durationHours ?? 3,
      tour.category ?? 'ACTIVITY',
      tour.imageUrl ?? null,
      Number(tour.rating ?? 0),
      tour.availableSlots ?? 20,
    );
  }

  async create(tour: Tour): Promise<Tour> {
    const created = await this.prisma.tour.create({
      data: {
        name: tour.name,
        description: tour.description,
        price: tour.price,
        location: tour.location,
        durationHours: tour.durationHours,
        category: tour.category,
        imageUrl: tour.imageUrl,
        rating: tour.rating,
        availableSlots: tour.availableSlots,
      },
    });
    return this.toDomain(created);
  }

  async findById(id: string): Promise<Tour | null> {
    const tour = await this.prisma.tour.findUnique({ where: { id } });
    return tour ? this.toDomain(tour) : null;
  }

  async findAll(): Promise<Tour[]> {
    const tours = await this.prisma.tour.findMany({ orderBy: { createdAt: 'desc' } });
    return tours.map((t) => this.toDomain(t));
  }

  async update(tour: Tour): Promise<Tour> {
    const updated = await this.prisma.tour.update({
      where: { id: tour.id },
      data: {
        name: tour.name,
        description: tour.description,
        price: tour.price,
        location: tour.location,
        durationHours: tour.durationHours,
        category: tour.category,
        imageUrl: tour.imageUrl,
        rating: tour.rating,
        availableSlots: tour.availableSlots,
      },
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tour.delete({ where: { id } });
  }
}

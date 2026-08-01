export class TourDTO {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public price: number,
    public location: string = '',
    public durationHours: number = 3,
    public category: string = 'ACTIVITY',
    public imageUrl: string | null = null,
    public rating: number = 0,
    public availableSlots: number = 20,
  ) {}

  static fromTour(tour: {
    id: string;
    name: string;
    description: string;
    price: number;
    location?: string;
    durationHours?: number;
    category?: string;
    imageUrl?: string | null;
    rating?: number;
    availableSlots?: number;
  }): TourDTO {
    return new TourDTO(
      tour.id,
      tour.name,
      tour.description,
      tour.price,
      tour.location ?? '',
      tour.durationHours ?? 3,
      tour.category ?? 'ACTIVITY',
      tour.imageUrl ?? null,
      tour.rating ?? 0,
      tour.availableSlots ?? 20,
    );
  }
}

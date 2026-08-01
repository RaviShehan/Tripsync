export class Tour {
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
}

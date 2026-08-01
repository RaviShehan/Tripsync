export const API_GATEWAY_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL ?? "http://localhost:4000";

export interface Tour {
  id: string;
  name: string;
  description: string;
  price: number;
  location: string;
  durationHours: number;
  category: string;
  imageUrl: string;
  rating: number;
  availableSlots: number;
}

export interface Property {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  type: string;
  pricePerNight: number;
  maxGuests: number;
  amenities: string[];
  imageUrl: string;
  rating: number;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  city: string;
  pricePerDay: number;
  seats: number;
  transmission: string;
  fuelType: string;
  imageUrl: string;
  available: boolean;
}

export type BookingType = "TOUR" | "PROPERTY" | "CAR";

export interface Booking {
  id: string;
  userId: string;
  bookingType: BookingType;
  referenceId: string;
  startDate: string;
  endDate: string;
  quantity: number;
  totalPrice: number;
  currency: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export interface SearchParams {
  city?: string;
  type?: string;
  guests?: number;
  checkIn?: string;
  checkOut?: string;
  category?: string;
  pickupDate?: string;
  dropoffDate?: string;
}

export interface CreateBookingInput {
  userId: string;
  bookingType: BookingType;
  referenceId: string;
  startDate: string;
  endDate: string;
  quantity: number;
  totalPrice: number;
  currency: string;
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== "",
  );
  if (entries.length === 0) return "";
  return (
    "?" +
    entries
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
      )
      .join("&")
  );
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_GATEWAY_URL}${path}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

async function apiSend<T>(
  path: string,
  method: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${API_GATEWAY_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export function getTours(): Promise<Tour[]> {
  return apiGet<Tour[]>("/api/v1/tours");
}

export function getTour(id: string): Promise<Tour> {
  return apiGet<Tour>(`/api/v1/tours/${encodeURIComponent(id)}`);
}

export function getProperties(params: SearchParams = {}): Promise<Property[]> {
  const query = buildQuery({
    city: params.city,
    type: params.type,
    guests: params.guests,
    checkIn: params.checkIn,
    checkOut: params.checkOut,
  });
  return apiGet<Property[]>(`/api/v1/properties${query}`);
}

export function getProperty(id: string): Promise<Property> {
  return apiGet<Property>(`/api/v1/properties/${encodeURIComponent(id)}`);
}

export function getCars(params: SearchParams = {}): Promise<Car[]> {
  const query = buildQuery({
    city: params.city,
    category: params.category,
    pickupDate: params.pickupDate,
    dropoffDate: params.dropoffDate,
  });
  return apiGet<Car[]>(`/api/v1/cars${query}`);
}

export function getCar(id: string): Promise<Car> {
  return apiGet<Car>(`/api/v1/cars/${encodeURIComponent(id)}`);
}

export function createBooking(input: CreateBookingInput): Promise<Booking> {
  return apiSend<Booking>("/api/v1/bookings", "POST", input);
}

export function getBooking(id: string): Promise<Booking> {
  return apiGet<Booking>(`/api/v1/bookings/${encodeURIComponent(id)}`);
}

export function getUserBookings(userId: string): Promise<Booking[]> {
  return apiGet<Booking[]>(`/api/v1/bookings/user/${encodeURIComponent(userId)}`);
}

export function cancelBooking(id: string): Promise<Booking> {
  return apiSend<Booking>(`/api/v1/bookings/${encodeURIComponent(id)}/cancel`, "POST");
}

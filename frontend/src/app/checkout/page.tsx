import { redirect } from "next/navigation";
import { getCar, getProperty, getTour } from "@/lib/api";
import { diffDays } from "@/lib/utils";
import CheckoutForm from "../components/CheckoutForm";

type CheckoutType = "property" | "tour" | "car";

function asString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const typeParam = asString(params.type) as CheckoutType;
  const id = asString(params.id);

  if ((typeParam !== "property" && typeParam !== "tour" && typeParam !== "car") || !id) {
    redirect("/");
  }

  const checkIn = asString(params.checkIn);
  const checkOut = asString(params.checkOut);
  const date = asString(params.date);
  const pickupDate = asString(params.pickupDate);
  const dropoffDate = asString(params.dropoffDate);
  const guests = asString(params.guests);
  const attendees = asString(params.attendees);

  let quantity = 0;
  let unitPrice = 0;
  let startDate = "";
  let endDate = "";
  let item: { id: string; name: string; location?: string } | null = null;

  if (typeParam === "property") {
    const property = await getProperty(id);
    item = {
      id: property.id,
      name: property.name,
      location: [property.city, property.country].filter(Boolean).join(", "),
    };
    unitPrice = property.pricePerNight;
    startDate = checkIn;
    endDate = checkOut;
    quantity = diffDays(checkIn, checkOut);
    if (quantity <= 0) redirect(`/properties/${id}`);
  } else if (typeParam === "tour") {
    const tour = await getTour(id);
    item = { id: tour.id, name: tour.name, location: tour.location };
    unitPrice = tour.price;
    startDate = date;
    endDate = date;
    quantity = attendees ? Math.max(1, Number(attendees)) : 1;
    if (!date) redirect(`/tours/${id}`);
  } else {
    const car = await getCar(id);
    item = {
      id: car.id,
      name: `${car.brand} ${car.model}`,
      location: car.city,
    };
    unitPrice = car.pricePerDay;
    startDate = pickupDate;
    endDate = dropoffDate;
    quantity = diffDays(pickupDate, dropoffDate);
    if (quantity <= 0) redirect(`/cars/${id}`);
  }

  const currency = "USD";
  const totalPrice = quantity * unitPrice;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Checkout
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Review your trip details and confirm your booking.
        </p>
        <div className="mt-8">
          <CheckoutForm
            type={typeParam}
            item={item}
            startDate={startDate}
            endDate={endDate}
            quantity={quantity}
            totalPrice={totalPrice}
            currency={currency}
            guests={guests}
            attendees={attendees}
          />
        </div>
      </div>
    </main>
  );
}

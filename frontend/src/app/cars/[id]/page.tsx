import { notFound } from "next/navigation";
import { getCar } from "@/lib/api";
import ListingHeader from "../../components/ListingHeader";
import ListingBooking from "../../components/ListingBooking";

export default async function CarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let car;
  try {
    car = await getCar(id);
  } catch {
    notFound();
  }

  const title = `${car.brand} ${car.model}`;
  const meta = (
    <>
      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
        {car.category}
      </span>
      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
        {car.year}
      </span>
      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
        {car.seats} seats
      </span>
      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
        {car.transmission}
      </span>
      {!car.available && (
        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 ring-1 ring-red-200">
          Unavailable
        </span>
      )}
    </>
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ListingHeader
          backHref="/search?tab=cars"
          backLabel="Back to search"
          badge={car.category}
          title={title}
          subtitle={`${car.city} • ${car.fuelType} • ${car.transmission}`}
          description={`Rent this ${car.brand} ${car.model} (${car.year}) in ${car.city}. ${car.seats} seats, ${car.transmission} transmission, running on ${car.fuelType}.`}
          imageUrl={car.imageUrl}
          meta={meta}
        />

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Vehicle overview
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { label: "Brand", value: car.brand },
                { label: "Model", value: car.model },
                { label: "Year", value: String(car.year) },
                { label: "Category", value: car.category },
                { label: "Seats", value: String(car.seats) },
                { label: "Transmission", value: car.transmission },
                { label: "Fuel type", value: car.fuelType },
                { label: "City", value: car.city },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                >
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <aside className="h-fit lg:sticky lg:top-24">
            <ListingBooking
              type="car"
              id={car.id}
              unitPrice={car.pricePerDay}
              currency="USD"
              seatCount={car.seats}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

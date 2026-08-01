import { notFound } from "next/navigation";
import { getProperty } from "@/lib/api";
import ListingHeader from "../../components/ListingHeader";
import ListingBooking from "../../components/ListingBooking";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let property;
  try {
    property = await getProperty(id);
  } catch {
    notFound();
  }

  const location = [property.address, property.city, property.country]
    .filter(Boolean)
    .join(", ");

  const meta = (
    <>
      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
        Sleeps {property.maxGuests}
      </span>
      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
        {property.type}
      </span>
    </>
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ListingHeader
          backHref="/search?tab=properties"
          backLabel="Back to search"
          badge={property.type}
          title={property.name}
          subtitle={location}
          description={property.description}
          imageUrl={property.imageUrl}
          rating={property.rating}
          meta={meta}
        />

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              About this place
            </h2>
            <p className="mt-3 leading-relaxed text-gray-600">
              {property.description}
            </p>

            <h3 className="mt-8 text-base font-semibold text-gray-900">
              What this place offers
            </h3>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {property.amenities.map((amenity) => (
                <li
                  key={amenity}
                  className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  {amenity}
                </li>
              ))}
            </ul>
          </div>

          <aside className="h-fit lg:sticky lg:top-24">
            <ListingBooking
              type="property"
              id={property.id}
              unitPrice={property.pricePerNight}
              currency="USD"
              maxGuests={property.maxGuests}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

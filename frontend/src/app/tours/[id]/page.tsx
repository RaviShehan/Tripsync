import { notFound } from "next/navigation";
import { getTour } from "@/lib/api";
import ListingHeader from "../../components/ListingHeader";
import ListingBooking from "../../components/ListingBooking";

export default async function TourPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let tour;
  try {
    tour = await getTour(id);
  } catch {
    notFound();
  }

  const meta = (
    <>
      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
        {tour.durationHours} hours
      </span>
      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
        {tour.category}
      </span>
      {tour.availableSlots > 0 && (
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
          {tour.availableSlots} spots left
        </span>
      )}
    </>
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ListingHeader
          backHref="/search?tab=tours"
          backLabel="Back to search"
          badge={tour.category}
          title={tour.name}
          subtitle={tour.location}
          description={tour.description}
          imageUrl={tour.imageUrl}
          rating={tour.rating}
          meta={meta}
        />

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              About this tour
            </h2>
            <p className="mt-3 leading-relaxed text-gray-600">
              {tour.description}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Duration
                  </p>
                  <p className="text-sm text-gray-500">
                    {tour.durationHours} hours
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Location
                  </p>
                  <p className="text-sm text-gray-500">{tour.location}</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="h-fit lg:sticky lg:top-24">
            <ListingBooking
              type="tour"
              id={tour.id}
              unitPrice={tour.price}
              currency="USD"
              availableSlots={tour.availableSlots}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

import { getCars, getProperties, getTours } from "@/lib/api";
import SearchTabs from "../components/SearchTabs";

type TabKey = "properties" | "tours" | "cars";

function asString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const city = asString(params.city);
  const guests = asString(params.guests);
  const checkIn = asString(params.checkIn);
  const checkOut = asString(params.checkOut);
  const tabParam = asString(params.tab);
  const initialTab: TabKey =
    tabParam === "tours" || tabParam === "cars" ? tabParam : "properties";

  const [properties, tours, cars] = await Promise.all([
    getProperties({
      city: city || undefined,
      guests: guests ? Number(guests) : undefined,
      checkIn: checkIn || undefined,
      checkOut: checkOut || undefined,
    }),
    getTours(),
    getCars({
      city: city || undefined,
      pickupDate: checkIn || undefined,
      dropoffDate: checkOut || undefined,
    }),
  ]);

  const filteredTours =
    city && city.trim()
      ? tours.filter((tour) =>
          (tour.location ?? "")
            .toLowerCase()
            .includes(city.trim().toLowerCase()),
        )
      : tours;

  const hasFilters = Boolean(city || checkIn || checkOut || guests);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-800">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Search results</h1>
          <p className="mt-2 text-emerald-100">
            {hasFilters ? (
              <>
                {city && (
                  <span className="mr-2 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm font-medium ring-1 ring-white/20">
                    {city}
                  </span>
                )}
                {guests && (
                  <span className="mr-2 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm font-medium ring-1 ring-white/20">
                    {guests} guests
                  </span>
                )}
                {checkIn && (
                  <span className="mr-2 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm font-medium ring-1 ring-white/20">
                    {checkIn} → {checkOut || "open"}
                  </span>
                )}
                {!city && !guests && !checkIn && (
                  <span>Showing all available listings</span>
                )}
              </>
            ) : (
              "Browse everything we have available"
            )}
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <SearchTabs
          initialTab={initialTab}
          city={city}
          guests={guests}
          checkIn={checkIn}
          checkOut={checkOut}
          properties={properties}
          tours={filteredTours}
          cars={cars}
        />
      </div>
    </main>
  );
}

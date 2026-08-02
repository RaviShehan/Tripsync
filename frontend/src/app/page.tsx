import { Suspense } from "react";
import Link from "next/link";
import { getTours } from "@/lib/api";
import SearchBar from "./components/SearchBar";
import TourCard from "./components/TourCard";

const destinationHighlights = [
  { title: "Paris", subtitle: "Art, cafés & Seine evenings", accent: "from-rose-500 to-orange-400" },
  { title: "Tokyo", subtitle: "Neon nights & culinary escapes", accent: "from-sky-500 to-indigo-500" },
  { title: "Bali", subtitle: "Island retreats & wellness stays", accent: "from-emerald-500 to-lime-500" },
];

export default function Home() {
  return (
    <main>
      <Hero />
      <Suspense fallback={<ToursSectionSkeleton />}>
        <FeaturedTours />
      </Suspense>
      <BrowseCategories />
      <DiscoveryRail />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-800">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-teal-300/20 blur-3xl" />
      </div>
      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-emerald-100 ring-1 ring-white/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4 text-emerald-300"
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
              clipRule="evenodd"
            />
          </svg>
          Trusted by 120,000+ travelers
        </span>
        <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Plan smarter trips with AI-powered discovery
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-emerald-100">
          Discover unforgettable experiences, cozy stays, and seamless transport in one polished planner.
        </p>
        <div className="mt-10 w-full flex justify-center">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}

async function FeaturedTours() {
  const tours = await getTours();
  const featured = [...tours]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
            Featured
          </p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Top-rated tours
          </h2>
        </div>
        <Link
          href="/search?tab=tours"
          className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-emerald-600 transition hover:text-emerald-700 sm:inline-flex"
        >
          View all tours
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
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
      {featured.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center text-gray-500">
          No tours available yet. Check back soon!
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      )}
    </section>
  );
}

function BrowseCategories() {
  const categories = [
    {
      title: "Stays",
      description: "Apartments, villas & hotels",
      href: "/search?tab=properties",
      gradient: "from-sky-500 to-indigo-600",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      title: "Tours",
      description: "Guided experiences & day trips",
      href: "/search?tab=tours",
      gradient: "from-emerald-500 to-teal-600",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      ),
    },
    {
      title: "Cars",
      description: "Rentals for every road trip",
      href: "/search?tab=cars",
      gradient: "from-amber-500 to-orange-600",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8"
        >
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <path d="M9 17h6" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
            Explore
          </p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Browse by category
          </h2>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span
                className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${category.gradient} text-white shadow-md`}
              >
                {category.icon}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {category.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{category.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 transition group-hover:gap-2">
                Browse now
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
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function DiscoveryRail() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">Where&apos;s next?</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">Trending destinations</h2>
          </div>
          <Link href="/search?tab=tours" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">Explore all</Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {destinationHighlights.map((destination) => (
            <div key={destination.title} className="overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 shadow-sm">
              <div className={`h-28 bg-gradient-to-br ${destination.accent}`} />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">{destination.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{destination.subtitle}</p>
                <Link href={`/search?city=${encodeURIComponent(destination.title)}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600">
                  Browse ideas
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ToursSectionSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="h-8 w-56 animate-pulse rounded bg-gray-200" />
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200"
          >
            <div className="aspect-[4/3] bg-gray-200" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-200" />
              <div className="h-5 w-1/3 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

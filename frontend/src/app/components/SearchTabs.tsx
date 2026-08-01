"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Car, Property, Tour } from "@/lib/api";
import PropertyCard from "./PropertyCard";
import TourCard from "./TourCard";
import CarCard from "./CarCard";

type TabKey = "properties" | "tours" | "cars";

interface SearchTabsProps {
  initialTab: TabKey;
  city?: string;
  guests?: string;
  checkIn?: string;
  checkOut?: string;
  properties: Property[];
  tours: Tour[];
  cars: Car[];
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "properties", label: "Properties" },
  { key: "tours", label: "Tours" },
  { key: "cars", label: "Cars" },
];

export default function SearchTabs({
  initialTab,
  city,
  guests,
  checkIn,
  checkOut,
  properties,
  tours,
  cars,
}: SearchTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  function switchTab(tab: TabKey) {
    setActiveTab(tab);
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (guests) params.set("guests", guests);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    params.set("tab", tab);
    router.push(`/search?${params.toString()}`, { scroll: false });
  }

  const counts: Record<TabKey, number> = {
    properties: properties.length,
    tours: tours.length,
    cars: cars.length,
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => switchTab(tab.key)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                  : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {counts[tab.key]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {activeTab === "properties" &&
          (properties.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No properties found"
              body="Try a different city or adjust your dates and guest count."
            />
          ))}

        {activeTab === "tours" &&
          (tours.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No tours found"
              body="Try a different destination or broaden your search."
            />
          ))}

        {activeTab === "cars" &&
          (cars.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No cars found"
              body="Try a different city or adjust your rental dates."
            />
          ))}
      </div>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/60 px-6 py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
          <path d="M8 11h6" />
        </svg>
      </span>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{body}</p>
    </div>
  );
}

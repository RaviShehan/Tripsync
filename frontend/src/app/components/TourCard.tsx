import Link from "next/link";
import type { Tour } from "@/lib/api";
import ListingImage from "./ListingImage";
import RatingBadge from "./RatingBadge";
import { formatCurrency } from "@/lib/utils";

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  return (
    <Link
      href={`/tours/${tour.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ListingImage
          src={tour.imageUrl}
          alt={tour.name}
          className="transition duration-300 group-hover:scale-105"
        />
        {tour.category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-800 shadow-sm">
            {tour.category}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-base font-semibold text-gray-900">
            {tour.name}
          </h3>
          <RatingBadge rating={tour.rating} />
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {tour.location || "Various locations"}
          <span className="mx-1 text-gray-300">•</span>
          {tour.durationHours}h
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="text-sm text-gray-500">
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(tour.price)}
            </span>{" "}
            / person
          </p>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 transition group-hover:gap-2">
            View details
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
        </div>
      </div>
    </Link>
  );
}

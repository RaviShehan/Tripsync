import Link from "next/link";
import ListingImage from "./ListingImage";
import RatingBadge from "./RatingBadge";

interface ListingHeaderProps {
  backHref: string;
  backLabel: string;
  badge?: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl?: string | null;
  rating?: number;
  meta?: React.ReactNode;
}

export default function ListingHeader({
  backHref,
  backLabel,
  badge,
  title,
  subtitle,
  description,
  imageUrl,
  rating,
  meta,
}: ListingHeaderProps) {
  return (
    <div>
      <Link
        href={backHref}
        className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
      >
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
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        {backLabel}
      </Link>

      <div className="mt-4 overflow-hidden rounded-3xl">
        <div className="relative aspect-[16/8] w-full">
          <ListingImage src={imageUrl} alt={title} />
          {badge && (
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800 shadow-sm">
              {badge}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
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
              {subtitle}
            </p>
          )}
          {meta && <div className="mt-3 flex flex-wrap gap-2">{meta}</div>}
        </div>
        {typeof rating === "number" && <RatingBadge rating={rating} />}
      </div>

      {description && (
        <p className="mt-5 max-w-3xl leading-relaxed text-gray-600">
          {description}
        </p>
      )}
    </div>
  );
}

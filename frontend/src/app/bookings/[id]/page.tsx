import Link from "next/link";
import { notFound } from "next/navigation";
import { getBooking } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import CancelBookingButton from "../../components/CancelBookingButton";

const TYPE_LABEL: Record<string, string> = {
  TOUR: "Tour",
  PROPERTY: "Property",
  CAR: "Car rental",
};

const REFERENCE_HREF: Record<string, string> = {
  TOUR: "/tours/",
  PROPERTY: "/properties/",
  CAR: "/cars/",
};

export default async function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let booking;
  try {
    booking = await getBooking(id);
  } catch {
    notFound();
  }

  const cancelled = booking.status.toLowerCase().includes("cancelled");

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
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
          Back to home
        </Link>

        <div className="mt-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
                Booking confirmed
              </p>
              <h1 className="mt-1 text-2xl font-bold text-gray-900">
                {TYPE_LABEL[booking.bookingType]} booking
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Booking ID:{" "}
                <span className="font-semibold text-gray-900">{booking.id}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <StatusBadge label={booking.status} tone="neutral" />
              <StatusBadge label={booking.paymentStatus} tone="payment" />
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-gray-100 pt-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Type
              </dt>
              <dd className="mt-1 font-medium text-gray-900">
                {TYPE_LABEL[booking.bookingType] ?? booking.bookingType}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Item
              </dt>
              <dd className="mt-1 font-medium text-gray-900">
                <Link
                  href={`${REFERENCE_HREF[booking.bookingType] ?? "/"}${booking.referenceId}`}
                  className="text-emerald-700 hover:text-emerald-800"
                >
                  {booking.referenceId}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Start date
              </dt>
              <dd className="mt-1 font-medium text-gray-900">
                {formatDateTime(booking.startDate)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                End date
              </dt>
              <dd className="mt-1 font-medium text-gray-900">
                {formatDateTime(booking.endDate)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Quantity
              </dt>
              <dd className="mt-1 font-medium text-gray-900">
                {booking.quantity}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Total
              </dt>
              <dd className="mt-1 text-lg font-bold text-emerald-600">
                {formatCurrency(booking.totalPrice, booking.currency)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Created
              </dt>
              <dd className="mt-1 font-medium text-gray-900">
                {formatDateTime(booking.createdAt)}
              </dd>
            </div>
          </dl>

          {!cancelled && (
            <div className="mt-8 border-t border-gray-100 pt-6">
              <CancelBookingButton bookingId={booking.id} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "neutral" | "payment";
}) {
  const lower = label.toLowerCase();
  let className = "bg-gray-100 text-gray-700 ring-gray-200";
  if (lower.includes("cancel")) {
    className = "bg-red-50 text-red-700 ring-red-200";
  } else if (lower.includes("confirm")) {
    className = "bg-emerald-50 text-emerald-700 ring-emerald-200";
  } else if (tone === "payment" && lower.includes("paid")) {
    className = "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ${className}`}
    >
      {label}
    </span>
  );
}

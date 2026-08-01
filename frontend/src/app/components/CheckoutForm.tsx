"use client";

import { useState } from "react";
import Link from "next/link";
import {
  createBooking,
  type Booking,
  type BookingType,
} from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";

type CheckoutType = "property" | "tour" | "car";

interface CheckoutItem {
  id: string;
  name: string;
  location?: string;
}

interface CheckoutFormProps {
  type: CheckoutType;
  item: CheckoutItem;
  startDate: string;
  endDate: string;
  quantity: number;
  totalPrice: number;
  currency: string;
  guests?: string;
  attendees?: string;
}

const BOOKING_TYPE: Record<CheckoutType, BookingType> = {
  property: "PROPERTY",
  tour: "TOUR",
  car: "CAR",
};

const TYPE_LABEL: Record<CheckoutType, string> = {
  property: "Property",
  tour: "Tour",
  car: "Car rental",
};

type Step = "review" | "payment" | "success";

export default function CheckoutForm({
  type,
  item,
  startDate,
  endDate,
  quantity,
  totalPrice,
  currency,
  guests,
  attendees,
}: CheckoutFormProps) {
  const [step, setStep] = useState<Step>("review");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);

  const paymentValid =
    cardNumber.replace(/\s/g, "").length >= 12 &&
    cardExpiry.trim() !== "" &&
    cardCvc.trim().length >= 3;

  function reviewStepError() {
    if (!name.trim()) return "Please enter the guest's full name.";
    if (!email.trim()) return "Please enter an email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return "Please enter a valid email address.";
    if (!phone.trim()) return "Please enter a phone number.";
    return "";
  }

  function goToPayment() {
    const err = reviewStepError();
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setStep("payment");
  }

  function goToReview() {
    setError("");
    setStep("review");
  }

  async function confirmBooking() {
    if (!paymentValid) {
      setError("Please fill in all card details to continue.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const created = await createBooking({
        userId: "demo-user-1",
        bookingType: BOOKING_TYPE[type],
        referenceId: item.id,
        startDate,
        endDate,
        quantity,
        totalPrice,
        currency,
      });
      setBooking(created);
      setStep("success");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while confirming your booking.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (step === "success" && booking) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          Booking confirmed!
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Your reservation has been confirmed. Your booking ID is{" "}
          <span className="font-semibold text-gray-900">{booking.id}</span>.
        </p>
        <dl className="mt-6 w-full space-y-2 rounded-xl bg-gray-50 p-4 text-left text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">Status</dt>
            <dd className="font-medium text-gray-900">{booking.status}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Payment</dt>
            <dd className="font-medium text-gray-900">
              {booking.paymentStatus}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Total</dt>
            <dd className="font-medium text-emerald-600">
              {formatCurrency(booking.totalPrice, booking.currency)}
            </dd>
          </div>
        </dl>
        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
          <Link
            href={`/bookings/${booking.id}`}
            className="flex-1 rounded-xl bg-emerald-600 px-5 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            View booking details
          </Link>
          <Link
            href="/"
            className="flex-1 rounded-xl border border-gray-200 px-5 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Your details
            </h2>
            <StepBadge current={step} step="review" label="Review" />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Guest name
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Phone
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 000 1234"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
              />
            </label>
          </div>
          {step === "review" && (
            <button
              onClick={goToPayment}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:from-emerald-700 hover:to-teal-700"
            >
              Continue to payment
            </button>
          )}
        </section>

        {step === "payment" && (
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Payment details
              </h2>
              <StepBadge current={step} step="payment" label="Payment" />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              This is a demo checkout — no real charge will be made.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-sm font-medium text-gray-700">
                  Card number
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">
                  Expiry
                </span>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">
                  CVC
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  placeholder="123"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
                />
              </label>
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={goToReview}
                className="rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={confirmBooking}
                disabled={submitting}
                className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Confirming..."
                  : `Confirm booking • ${formatCurrency(totalPrice, currency)}`}
              </button>
            </div>
          </section>
        )}
      </div>

      <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {TYPE_LABEL[type]}
        </h2>
        <p className="mt-1 font-medium text-gray-900">{item.name}</p>
        {item.location && (
          <p className="text-sm text-gray-500">{item.location}</p>
        )}
        <dl className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">Check-in</dt>
            <dd className="font-medium text-gray-900">{formatDate(startDate)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Check-out</dt>
            <dd className="font-medium text-gray-900">{formatDate(endDate)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Guests</dt>
            <dd className="font-medium text-gray-900">{guests ?? attendees ?? quantity}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Quantity</dt>
            <dd className="font-medium text-gray-900">{quantity}</dd>
          </div>
        </dl>
        <div className="mt-4 flex justify-between border-t border-dashed border-gray-200 pt-4">
          <span className="font-semibold text-gray-900">Total</span>
          <span className="text-xl font-bold text-emerald-600">
            {formatCurrency(totalPrice, currency)}
          </span>
        </div>
      </aside>

      {error && (
        <div className="lg:col-span-2">
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}

function StepBadge({
  current,
  step,
  label,
}: {
  current: Step;
  step: Step;
  label: string;
}) {
  const active = current === step;
  const done = current === "payment" && step === "review";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-600 text-white"
          : done
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
            : "bg-gray-100 text-gray-500"
      }`}
    >
      {done ? "✓" : ""}
      {label}
    </span>
  );
}

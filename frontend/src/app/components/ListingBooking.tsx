"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { diffDays, formatCurrency } from "@/lib/utils";

type ListingType = "property" | "tour" | "car";

interface ListingBookingProps {
  type: ListingType;
  id: string;
  unitPrice: number;
  currency: string;
  maxGuests?: number;
  availableSlots?: number;
  seatCount?: number;
}

export default function ListingBooking({
  type,
  id,
  unitPrice,
  currency,
  maxGuests = 8,
  availableSlots = 0,
  seatCount = 4,
}: ListingBookingProps) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [date, setDate] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [attendees, setAttendees] = useState(1);

  const unitLabel =
    type === "property" ? "night" : type === "tour" ? "person" : "day";

  const quantity = useMemo(() => {
    if (type === "property") return diffDays(checkIn, checkOut);
    if (type === "tour") return attendees;
    return diffDays(pickupDate, dropoffDate);
  }, [type, checkIn, checkOut, attendees, pickupDate, dropoffDate]);

  const total = quantity * unitPrice;
  const valid = quantity > 0;

  const href = useMemo(() => {
    const params = new URLSearchParams({ type, id });
    if (type === "property") {
      if (checkIn) params.set("checkIn", checkIn);
      if (checkOut) params.set("checkOut", checkOut);
      params.set("guests", String(guests));
    } else if (type === "tour") {
      if (date) params.set("date", date);
      params.set("attendees", String(attendees));
    } else {
      if (pickupDate) params.set("pickupDate", pickupDate);
      if (dropoffDate) params.set("dropoffDate", dropoffDate);
    }
    return `/checkout?${params.toString()}`;
  }, [type, id, checkIn, checkOut, guests, date, attendees, pickupDate, dropoffDate]);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900">
          {formatCurrency(unitPrice, currency)}
        </span>
        <span className="text-sm text-gray-500">/ {unitLabel}</span>
      </div>

      <div className="mt-5 space-y-4">
        {type === "property" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Check-in
                </span>
                <input
                  type="date"
                  value={checkIn}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Check-out
                </span>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || undefined}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Guests
              </span>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
              >
                {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} guest{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        {type === "tour" && (
          <>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Start date
              </span>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
              />
            </label>
            <label className="block">
              <span className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-500">
                <span>Attendees</span>
                <span className="normal-case text-gray-400">
                  {availableSlots > 0
                    ? `${availableSlots} spots left`
                    : "Unlimited spots"}
                </span>
              </span>
              <select
                value={attendees}
                onChange={(e) => setAttendees(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
              >
                {Array.from(
                  { length: Math.max(1, availableSlots || 20) },
                  (_, i) => i + 1,
                ).map((n) => (
                  <option key={n} value={n}>
                    {n} attendee{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        {type === "car" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Pickup
                </span>
                <input
                  type="date"
                  value={pickupDate}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Drop-off
                </span>
                <input
                  type="date"
                  value={dropoffDate}
                  min={pickupDate || undefined}
                  onChange={(e) => setDropoffDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
                />
              </label>
            </div>
            <p className="flex items-center gap-2 text-sm text-gray-500">
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
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
              {seatCount} seats • flexible pickup &amp; drop-off
            </p>
          </>
        )}
      </div>

      <div className="mt-5 space-y-2 border-t border-gray-100 pt-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>
            {formatCurrency(unitPrice, currency)} x {quantity || 0}{" "}
            {unitLabel}
            {quantity > 1 ? "s" : ""}
          </span>
          <span>{formatCurrency(quantity * unitPrice, currency)}</span>
        </div>
        <div className="flex justify-between border-t border-dashed border-gray-200 pt-2 text-base font-semibold text-gray-900">
          <span>Total</span>
          <span className="text-emerald-600">
            {formatCurrency(total, currency)}
          </span>
        </div>
      </div>

      <Link
        href={valid ? href : "#"}
        aria-disabled={!valid}
        className="mt-5 block w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-center font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:from-emerald-700 hover:to-teal-700 disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50"
      >
        {valid ? "Reserve / Book" : "Select your dates"}
      </Link>
      <p className="mt-3 text-center text-xs text-gray-400">
        You won&apos;t be charged yet
      </p>
    </div>
  );
}

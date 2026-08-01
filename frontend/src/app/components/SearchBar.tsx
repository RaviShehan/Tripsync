"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (destination.trim()) params.set("city", destination.trim());
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests && guests !== "1") params.set("guests", guests);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl rounded-2xl bg-white/95 p-4 shadow-xl shadow-emerald-900/10 ring-1 ring-black/5 backdrop-blur"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-end">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Destination
          </span>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Where to next?"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Check-in
          </span>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Check-out
          </span>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Guests
          </span>
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/30"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n} guest{n > 1 ? "s" : ""}
              </option>
            ))}
            <option value="9">9+ guests</option>
          </select>
        </label>
        <button
          type="submit"
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 lg:mt-0"
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
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          Search
        </button>
      </div>
    </form>
  );
}

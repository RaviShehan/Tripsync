"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelBooking } from "@/lib/api";

interface CancelBookingButtonProps {
  bookingId: string;
  disabled?: boolean;
}

export default function CancelBookingButton({
  bookingId,
  disabled = false,
}: CancelBookingButtonProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleCancel() {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setError("");
    setSubmitting(true);
    try {
      await cancelBooking(bookingId);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to cancel the booking. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleCancel}
        disabled={submitting || disabled}
        className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Cancelling..." : "Cancel booking"}
      </button>
      {error && (
        <p className="mt-2 text-sm font-medium text-red-700">{error}</p>
      )}
    </div>
  );
}

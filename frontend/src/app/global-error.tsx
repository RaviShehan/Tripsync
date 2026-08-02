"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-16 text-center text-white">
          <div className="max-w-lg rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">TripSync</p>
            <h1 className="mt-4 text-3xl font-semibold">Something went wrong</h1>
            <p className="mt-3 text-sm text-slate-300">
              We hit an unexpected runtime issue while loading the app. Please refresh and try again.
            </p>
            <button
              onClick={() => reset()}
              className="mt-6 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-500"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

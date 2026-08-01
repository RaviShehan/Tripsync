import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
        404 error
      </p>
      <h1 className="mt-2 text-4xl font-bold text-gray-900">
        Listing not found
      </h1>
      <p className="mt-3 max-w-md text-gray-500">
        The item you&apos;re looking for doesn&apos;t exist or may have been
        removed.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:from-emerald-700 hover:to-teal-700"
      >
        Back to home
      </Link>
    </main>
  );
}

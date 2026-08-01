import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Trip<span className="text-emerald-600">Sync</span>
          </span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
          >
            Home
          </Link>
          <Link
            href="/search"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
          >
            Search
          </Link>
          <Link
            href="/search?tab=properties"
            className="ml-1 hidden rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 sm:block"
          >
            Book Now
          </Link>
        </div>
      </nav>
    </header>
  );
}

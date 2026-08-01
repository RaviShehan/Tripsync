export default function SearchLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-800">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="h-8 w-48 animate-pulse rounded bg-white/20" />
          <div className="mt-3 h-4 w-72 animate-pulse rounded bg-white/20" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex gap-2">
          {[64, 48, 40].map((w) => (
            <div
              key={w}
              style={{ width: `${w}px` }}
              className="h-10 animate-pulse rounded-xl bg-gray-200"
            />
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200"
            >
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-200" />
                <div className="h-5 w-1/3 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

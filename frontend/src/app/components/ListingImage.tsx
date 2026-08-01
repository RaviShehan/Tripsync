import Image from "next/image";

interface ListingImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

const PLACEHOLDER_GRADIENTS = [
  "from-emerald-500 to-teal-600",
  "from-sky-500 to-indigo-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-600",
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function ListingImage({
  src,
  alt,
  className = "",
}: ListingImageProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        className={`object-cover ${className}`}
      />
    );
  }
  const gradient =
    PLACEHOLDER_GRADIENTS[hashString(alt) % PLACEHOLDER_GRADIENTS.length];
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient} ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-12 w-12 text-white/80"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    </div>
  );
}

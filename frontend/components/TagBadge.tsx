import Link from "next/link";

const TAG_COLORS: Record<string, string> = {
  malware:       "bg-red-50 text-red-700 border-red-200",
  ransomware:    "bg-orange-50 text-orange-700 border-orange-200",
  breach:        "bg-yellow-50 text-yellow-700 border-yellow-200",
  CVE:           "bg-purple-50 text-purple-700 border-purple-200",
  APT:           "bg-pink-50 text-pink-700 border-pink-200",
  policy:        "bg-blue-50 text-blue-700 border-blue-200",
  tool:          "bg-green-50 text-green-700 border-green-200",
  phishing:      "bg-amber-50 text-amber-700 border-amber-200",
  vulnerability: "bg-rose-50 text-rose-700 border-rose-200",
  espionage:     "bg-indigo-50 text-indigo-700 border-indigo-200",
};

const DEFAULT_COLOR = "bg-gray-50 text-gray-600 border-gray-200";

interface TagBadgeProps {
  tag: string;
  linked?: boolean;
}

export default function TagBadge({ tag, linked = true }: TagBadgeProps) {
  const color = TAG_COLORS[tag] ?? DEFAULT_COLOR;
  const cls = `inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${color}`;

  if (linked) {
    return (
      <Link href={`/category/${encodeURIComponent(tag)}`} className={`${cls} hover:shadow-blue-sm transition-shadow`}>
        {tag}
      </Link>
    );
  }
  return <span className={cls}>{tag}</span>;
}

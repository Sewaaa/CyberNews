export type RelevanceLevel = 1 | 2 | 3;

export function getLevel(score: number): RelevanceLevel {
  if (score >= 8) return 3;
  if (score >= 5) return 2;
  return 1;
}

const LEVEL_CONFIG = {
  1: { label: "Bassa",   dotColor: "bg-zinc-500",   textColor: "text-zinc-500"   },
  2: { label: "Media",   dotColor: "bg-yellow-500", textColor: "text-yellow-500" },
  3: { label: "Critica", dotColor: "bg-red-500",    textColor: "text-red-400"    },
} as const;

interface Props {
  score: number;
  showLabel?: boolean;
}

export default function RelevanceDots({ score, showLabel = true }: Props) {
  const level = getLevel(score);
  const { label, dotColor, textColor } = LEVEL_CONFIG[level];

  return (
    <div className="flex items-center gap-1.5" title={`Rilevanza: ${label} (${score}/10)`}>
      <div className="flex gap-0.5">
        {([1, 2, 3] as RelevanceLevel[]).map((i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${i <= level ? dotColor : "bg-zinc-800"}`}
          />
        ))}
      </div>
      {showLabel && (
        <span className={`text-xs font-medium ${textColor}`}>{label}</span>
      )}
    </div>
  );
}

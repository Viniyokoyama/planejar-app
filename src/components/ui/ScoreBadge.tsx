"use client";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "lg";
}

export function ScoreBadge({ score, size = "sm" }: ScoreBadgeProps) {
  const label =
    score >= 8.5 ? "Excelente" :
    score >= 7.0 ? "Bom" :
    score >= 5.0 ? "Atenção" : "Crítico";

  const cls =
    score >= 8.5 ? "bg-green-100 text-green-800 border-green-300" :
    score >= 7.0 ? "bg-blue-100 text-blue-800 border-blue-300" :
    score >= 5.0 ? "bg-amber-100 text-amber-800 border-amber-300" :
    "bg-red-100 text-red-800 border-red-300";

  if (size === "lg") {
    return (
      <div className={`inline-flex flex-col items-center px-6 py-4 rounded-2xl border-2 ${cls}`}>
        <span className="text-4xl font-bold">{score.toFixed(1)}</span>
        <span className="text-sm font-semibold mt-1">{label}</span>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {score.toFixed(1)} · {label}
    </span>
  );
}

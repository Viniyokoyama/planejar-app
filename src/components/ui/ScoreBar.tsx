"use client";

interface ScoreBarProps {
  label: string;
  score: number;
  justificativa?: string;
}

function getScoreStyle(score: number) {
  if (score >= 8.5) return { bar: "bg-green-500", badge: "score-excellent", label: "Excelente" };
  if (score >= 7.0) return { bar: "bg-blue-500", badge: "score-good", label: "Bom" };
  if (score >= 5.0) return { bar: "bg-amber-500", badge: "score-warning", label: "Atenção" };
  return { bar: "bg-red-500", badge: "score-critical", label: "Crítico" };
}

export function ScoreBar({ label, score, justificativa }: ScoreBarProps) {
  const style = getScoreStyle(score);
  const pct = (score / 10) * 100;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${style.badge}`}>
          {score.toFixed(1)}/10 · {style.label}
        </span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div
          className={`${style.bar} h-2.5 rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {justificativa && (
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{justificativa}</p>
      )}
    </div>
  );
}

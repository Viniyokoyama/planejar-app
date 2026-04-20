"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import {
  Loader2, MapPin, Stethoscope, Users, ShieldAlert,
  CheckCircle, AlertTriangle, XCircle, ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip,
} from "recharts";

const SCORE_LABELS: Record<string, string> = {
  fluxo_pessoas: "Fluxo de Pessoas",
  perfil_economico: "Perfil Econômico",
  acessibilidade: "Acessibilidade",
  concorrencia: "Concorrência",
  seguranca: "Segurança",
  potencial_receita: "Potencial de Receita",
  operacoes: "Operações",
  marketing: "Marketing",
  financeiro: "Financeiro",
  digital: "Presença Digital",
  atendimento: "Atendimento",
};

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  geomarketing: { label: "Geomarketing", icon: MapPin, color: "text-blue-700" },
  diagnostico: { label: "Diagnóstico Empresarial", icon: Stethoscope, color: "text-teal-700" },
  concorrencia: { label: "Análise de Concorrência", icon: Users, color: "text-violet-700" },
  riscos: { label: "Gestão de Risco", icon: ShieldAlert, color: "text-amber-700" },
};

function SeverityIcon({ s }: { s: string }) {
  if (s === "alta") return <XCircle size={18} className="text-red-500 shrink-0" />;
  if (s === "media") return <AlertTriangle size={18} className="text-amber-500 shrink-0" />;
  return <CheckCircle size={18} className="text-green-500 shrink-0" />;
}

function PrioridadeIcon({ p }: { p: string }) {
  if (p === "alta") return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">Alta prioridade</span>;
  if (p === "media") return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Média prioridade</span>;
  return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">Baixa prioridade</span>;
}

export default function RelatorioPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const polling = searchParams.get("polling") === "true";
  const [report, setReport] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = useCallback(async () => {
    const res = await fetch(`/api/reports/${id}`);
    if (!res.ok) return;
    const data = await res.json();
    setReport(data.report);
    if (data.report.status === "completed" || data.report.status === "failed") {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReport();
    if (!polling) { setLoading(false); return; }
    const interval = setInterval(async () => {
      const res = await fetch(`/api/reports/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      setReport(data.report);
      if (data.report.status === "completed" || data.report.status === "failed") {
        clearInterval(interval);
        setLoading(false);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [id, polling, fetchReport]);

  const status = (report as Record<string, unknown> | null)?.status as string | undefined;
  const isProcessing = !report || status === "processing";
  const isFailed = status === "failed";
  const type = (report as Record<string, unknown> | null)?.type as string | undefined;
  const typeConf = TYPE_CONFIG[type || ""] || TYPE_CONFIG.geomarketing;
  const Icon = typeConf.icon;

  const parsedData = (() => {
    try { return JSON.parse((report as Record<string, unknown> | null)?.data as string || "{}"); }
    catch { return {}; }
  })();

  const addresses = ((report as Record<string, unknown> | null)?.addresses as Array<Record<string, unknown>>) || [];
  const competitors = ((report as Record<string, unknown> | null)?.competitors as Array<Record<string, unknown>>) || [];
  const riskAlerts = ((report as Record<string, unknown> | null)?.riskAlerts as Array<Record<string, unknown>>) || [];

  if (isProcessing && loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Loader2 className="text-blue-600 animate-spin mb-4" size={48} />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Analisando com IA...</h2>
        <p className="text-slate-500 max-w-md">
          A análise leva entre 30 e 60 segundos. Esta página atualiza automaticamente.
        </p>
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <XCircle className="text-red-400 mb-4" size={48} />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Falha na análise</h2>
        <p className="text-slate-500 mb-6">Verifique sua chave de API no .env.local e tente novamente.</p>
        <Link href="/dashboard" className="text-blue-700 hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Voltar ao Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-4">
          <ArrowLeft size={14} /> Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <Icon className={typeConf.color} size={24} />
          <h1 className="text-2xl font-bold text-slate-800">{typeConf.label}</h1>
        </div>
      </div>

      {/* GEOMARKETING */}
      {type === "geomarketing" && addresses.length > 0 && (
        <div className="space-y-4">
          {addresses.map((addr: Record<string, unknown>, i: number) => {
            const scores = (() => { try { return JSON.parse(addr.scores as string || "{}"); } catch { return {}; } })();
            return (
              <div key={String(addr.id)} className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                      Endereço {i + 1}
                    </p>
                    <p className="font-semibold text-slate-800">{String(addr.rawAddress)}</p>
                  </div>
                  {addr.overallScore !== null && (
                    <ScoreBadge score={Number(addr.overallScore)} size="lg" />
                  )}
                </div>

                {addr.analysis && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-5 text-sm text-blue-800">
                    {String(addr.analysis)}
                  </div>
                )}

                <div>
                  {Object.entries(scores).map(([key, val]) => {
                    const v = val as Record<string, unknown>;
                    return (
                      <ScoreBar
                        key={key}
                        label={SCORE_LABELS[key] || key}
                        score={Number(v.nota || 0)}
                        justificativa={String(v.justificativa || "")}
                      />
                    );
                  })}
                </div>

                {parsedData?.results?.[i] && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {parsedData.results[i].pontos_fortes?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-green-700 uppercase mb-2">Pontos fortes</p>
                        <ul className="space-y-1">
                          {parsedData.results[i].pontos_fortes.map((p: string, j: number) => (
                            <li key={j} className="flex items-start gap-2 text-xs text-slate-600">
                              <CheckCircle size={13} className="text-green-500 mt-0.5 shrink-0" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {parsedData.results[i].pontos_atencao?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-amber-700 uppercase mb-2">Pontos de atenção</p>
                        <ul className="space-y-1">
                          {parsedData.results[i].pontos_atencao.map((p: string, j: number) => (
                            <li key={j} className="flex items-start gap-2 text-xs text-slate-600">
                              <AlertTriangle size={13} className="text-amber-500 mt-0.5 shrink-0" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* DIAGNÓSTICO */}
      {type === "diagnostico" && parsedData.scores && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-slate-400 uppercase mb-1">Nota geral de maturidade</p>
                <p className="text-sm text-slate-500">{parsedData.nivel_maturidade}</p>
              </div>
              {parsedData.nota_geral && <ScoreBadge score={parsedData.nota_geral} size="lg" />}
            </div>

            {/* Radar chart */}
            <div className="h-56 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={Object.entries(parsedData.scores).map(([k, v]) => ({
                  subject: SCORE_LABELS[k] || k,
                  value: Number((v as Record<string, unknown>).nota || 0),
                  fullMark: 10,
                }))}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <Radar name="Seu negócio" dataKey="value" stroke="#1A3C6E" fill="#1A3C6E" fillOpacity={0.3} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {Object.entries(parsedData.scores).map(([key, val]) => {
              const v = val as Record<string, unknown>;
              return (
                <ScoreBar
                  key={key}
                  label={SCORE_LABELS[key] || key}
                  score={Number(v.nota || 0)}
                  justificativa={String(v.descricao || "")}
                />
              );
            })}

            {parsedData.benchmark_setor && (
              <div className="mt-4 bg-teal-50 rounded-lg p-4 text-sm text-teal-800">
                <p className="font-semibold mb-1">Benchmark do setor</p>
                {parsedData.benchmark_setor}
              </div>
            )}
          </div>

          {parsedData.recomendacoes?.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-800 mb-4">Recomendações prioritárias</h2>
              <div className="space-y-3">
                {parsedData.recomendacoes.map((rec: Record<string, unknown>, i: number) => (
                  <div key={i} className="border border-slate-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <PrioridadeIcon p={String(rec.prioridade)} />
                      <span className="text-xs text-slate-500">{String(rec.categoria)}</span>
                    </div>
                    <p className="font-medium text-sm text-slate-800">{String(rec.acao)}</p>
                    <p className="text-xs text-slate-500 mt-1">{String(rec.impacto)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CONCORRÊNCIA */}
      {type === "concorrencia" && (
        <div className="space-y-4">
          {parsedData.resumo && (
            <div className="bg-violet-50 rounded-xl border border-violet-100 p-5 text-sm text-violet-800">
              <p className="font-semibold mb-1">Panorama competitivo</p>
              {parsedData.resumo}
            </div>
          )}
          {competitors.map((c: Record<string, unknown>) => {
            const strengths: string[] = (() => { try { return JSON.parse(String(c.strengths || "[]")); } catch { return []; } })();
            const weaknesses: string[] = (() => { try { return JSON.parse(String(c.weaknesses || "[]")); } catch { return []; } })();
            return (
              <div key={String(c.id)} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-slate-800">{String(c.name)}</p>
                    {c.rating != null && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        ⭐ {Number(c.rating).toFixed(1)} — Sentimento:{" "}
                        <span className="text-green-600">{Number(c.sentimentPos ?? 0)}% positivo</span>
                      </p>
                    )}
                  </div>
                  <span className="text-xs px-2 py-1 bg-violet-50 text-violet-700 rounded-full font-medium">
                    Concorrente direto
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-semibold text-green-700 uppercase mb-1">Pontos fortes</p>
                    <ul className="space-y-1">
                      {strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                          <CheckCircle size={12} className="text-green-500 mt-0.5 shrink-0" />{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-red-700 uppercase mb-1">Pontos fracos</p>
                    <ul className="space-y-1">
                      {weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                          <XCircle size={12} className="text-red-400 mt-0.5 shrink-0" />{w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
          {parsedData.oportunidades?.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-800 mb-3">Oportunidades de mercado</h2>
              <ul className="space-y-2">
                {parsedData.oportunidades.map((o: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />{o}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* RISCOS */}
      {type === "riscos" && (
        <div className="space-y-4">
          {parsedData.resumo && (
            <div className="bg-amber-50 rounded-xl border border-amber-100 p-5 text-sm text-amber-800">
              <p className="font-semibold mb-1">Avaliação geral de risco</p>
              {parsedData.resumo}
            </div>
          )}
          {riskAlerts.map((alert: Record<string, unknown>) => (
            <div key={String(alert.id)} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start gap-3">
                <SeverityIcon s={String(alert.severity)} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm text-slate-800">{String(alert.title)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      alert.severity === "alta" ? "bg-red-100 text-red-700" :
                      alert.severity === "media" ? "bg-amber-100 text-amber-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      Risco {String(alert.severity)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{String(alert.description)}</p>
                  {alert.impactEstimate != null && (
                    <p className="text-xs text-slate-400 mt-2">
                      Impacto estimado no fluxo: <strong>-{Number(alert.impactEstimate)}%</strong>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

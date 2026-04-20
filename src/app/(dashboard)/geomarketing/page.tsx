"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Plus, Trash2, Loader2 } from "lucide-react";

const SEGMENTOS = [
  "Alimentação e Bebidas", "Varejo / Loja", "Saúde e Bem-estar",
  "Serviços", "Educação", "Beleza e Estética", "Tecnologia", "Outro",
];

export default function GeomarketingPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState([""]);
  const [segment, setSegment] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [avgTicket, setAvgTicket] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function addAddress() {
    if (addresses.length < 3) setAddresses([...addresses, ""]);
  }

  function removeAddress(i: number) {
    setAddresses(addresses.filter((_, idx) => idx !== i));
  }

  function updateAddress(i: number, value: string) {
    const updated = [...addresses];
    updated[i] = value;
    setAddresses(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const filled = addresses.filter((a) => a.trim());
    if (!filled.length || !segment) return setError("Preencha o endereço e o segmento.");
    setLoading(true);
    setError("");

    const res = await fetch("/api/geomarketing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        addresses: filled,
        segment,
        targetAudience,
        avgTicket: avgTicket ? parseFloat(avgTicket) : undefined,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || "Erro na análise.");
    router.push(`/relatorio/${data.reportId}?polling=true`);
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MapPin className="text-blue-700" size={22} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Geomarketing Inteligente</h1>
        </div>
        <p className="text-slate-500">
          Insira até 3 endereços e a IA vai avaliar cada um com notas e justificativas técnicas.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Endereços */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Endereços para análise</h2>
          <div className="space-y-3">
            {addresses.map((addr, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <input
                  type="text"
                  value={addr}
                  onChange={(e) => updateAddress(i, e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder={`Ex: Av. Paulista, 1000, São Paulo - SP`}
                />
                {addresses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAddress(i)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {addresses.length < 3 && (
            <button
              type="button"
              onClick={addAddress}
              className="mt-3 flex items-center gap-2 text-sm text-blue-700 hover:underline"
            >
              <Plus size={16} /> Adicionar outro endereço para comparação
            </button>
          )}
        </div>

        {/* Dados do negócio */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">Dados do negócio</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Segmento *</label>
              <select
                required
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">Selecione o segmento</option>
                {SEGMENTOS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Público-alvo
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Ex: Mulheres 25–45 anos, classe B/C, região sul de SP"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Ticket médio estimado (R$)
              </label>
              <input
                type="number"
                value={avgTicket}
                onChange={(e) => setAvgTicket(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Ex: 45"
                min="0"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#1A3C6E] hover:bg-blue-900 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Enviando para análise...
            </>
          ) : (
            "Analisar endereços com IA →"
          )}
        </button>
        <p className="text-center text-xs text-slate-400">
          A IA leva entre 30 e 60 segundos para gerar a análise completa.
        </p>
      </form>
    </div>
  );
}

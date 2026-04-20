"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Stethoscope, Loader2 } from "lucide-react";

const SEGMENTOS = [
  "Alimentação e Bebidas", "Varejo / Loja", "Saúde e Bem-estar",
  "Serviços", "Educação", "Beleza e Estética", "Tecnologia", "Outro",
];

export default function DiagnosticoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    businessName: "",
    segment: "",
    description: "",
    targetAudience: "",
    avgTicket: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.businessName || !form.segment || !form.description)
      return setError("Preencha os campos obrigatórios.");
    setLoading(true);
    setError("");
    const res = await fetch("/api/diagnostico", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, avgTicket: form.avgTicket ? parseFloat(form.avgTicket) : undefined }),
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
          <div className="p-2 bg-teal-100 rounded-lg">
            <Stethoscope className="text-teal-700" size={22} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Diagnóstico Empresarial</h1>
        </div>
        <p className="text-slate-500">
          Descreva seu negócio e a IA vai comparar com referências do setor, entregando um diagnóstico com recomendações práticas.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome do negócio *</label>
            <input
              type="text"
              required
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              placeholder="Ex: Café Bistrô da Vila"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Segmento *</label>
            <select
              required
              value={form.segment}
              onChange={(e) => setForm({ ...form, segment: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            >
              <option value="">Selecione</option>
              {SEGMENTOS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descreva a operação e proposta de valor *
            </label>
            <textarea
              required
              rows={5}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm resize-none"
              placeholder="Descreva o que seu negócio faz, como funciona, o que te diferencia dos concorrentes, seus canais de venda, principais desafios..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Público-alvo</label>
              <input
                type="text"
                value={form.targetAudience}
                onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                placeholder="Ex: Jovens 20-35 anos"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ticket médio (R$)</label>
              <input
                type="number"
                value={form.avgTicket}
                onChange={(e) => setForm({ ...form, avgTicket: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                placeholder="Ex: 80"
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
          className="w-full flex items-center justify-center gap-2 bg-[#00897B] hover:bg-teal-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-60"
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" /> Analisando...</>
          ) : (
            "Gerar diagnóstico com IA →"
          )}
        </button>
      </form>
    </div>
  );
}

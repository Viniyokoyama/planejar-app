"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2 } from "lucide-react";

const SEGMENTOS = [
  "Alimentação e Bebidas", "Varejo / Loja", "Saúde e Bem-estar",
  "Serviços", "Educação", "Beleza e Estética", "Tecnologia", "Outro",
];

export default function RiscosPage() {
  const router = useRouter();
  const [form, setForm] = useState({ address: "", segment: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.address || !form.segment) return setError("Preencha todos os campos.");
    setLoading(true);
    setError("");
    const res = await fetch("/api/riscos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
          <div className="p-2 bg-amber-100 rounded-lg">
            <ShieldAlert className="text-amber-700" size={22} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Gestão de Risco</h1>
        </div>
        <p className="text-slate-500">
          A IA mapeia obras, riscos climáticos, sazonalidade e fatores externos que podem afetar seu negócio.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Endereço do negócio *</label>
            <input
              type="text"
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              placeholder="Ex: Av. Brigadeiro Faria Lima, 3500, São Paulo - SP"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Segmento *</label>
            <select
              required
              value={form.segment}
              onChange={(e) => setForm({ ...form, segment: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            >
              <option value="">Selecione</option>
              {SEGMENTOS.map((s) => <option key={s}>{s}</option>)}
            </select>
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
          className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-60"
        >
          {loading ? (
            <><Loader2 size={18} className="animate-spin" /> Mapeando riscos...</>
          ) : (
            "Analisar riscos com IA →"
          )}
        </button>
      </form>
    </div>
  );
}

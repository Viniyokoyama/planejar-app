"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BarChart3, ArrowLeft, Check } from "lucide-react";

const SEGMENTOS = [
  "Alimentação e Bebidas",
  "Varejo / Loja",
  "Saúde e Bem-estar",
  "Serviços",
  "Educação",
  "Beleza e Estética",
  "Tecnologia",
  "Outro",
];

export default function CadastroPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "", profile: "", segment: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || "Erro ao criar conta.");
    router.push("/dashboard");
  }

  const profiles = [
    { value: "novo", emoji: "🏗️", label: "Abrindo um negócio novo" },
    { value: "existente", emoji: "🏪", label: "Já tenho negócio e quero otimizá-lo" },
    { value: "consultor", emoji: "💼", label: "Sou consultor ou investidor" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="bg-[#F59E0B] rounded-xl p-2">
            <BarChart3 className="text-white" size={20} />
          </div>
          <span className="text-[#1A3C6E] font-bold text-2xl tracking-tight">PLANEJAR</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          {/* Steps */}
          <div className="flex items-center mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  s < step
                    ? "bg-emerald-500 text-white"
                    : s === step
                    ? "bg-[#1A3C6E] text-white ring-4 ring-blue-100"
                    : "bg-slate-100 text-slate-400"
                }`}>
                  {s < step ? <Check size={14} /> : s}
                </div>
                {s < 3 && (
                  <div className={`flex-1 h-0.5 mx-2 transition-all ${s < step ? "bg-emerald-400" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Crie sua conta</h2>
                <p className="text-slate-500 text-sm mt-1">Dados de acesso à plataforma</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome completo</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Senha</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
              <button
                onClick={() => form.name && form.email && form.password && setStep(2)}
                className="btn-primary w-full"
              >
                Continuar
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Qual é sua situação?</h2>
                <p className="text-slate-500 text-sm mt-1">Vamos personalizar sua experiência</p>
              </div>
              <div className="space-y-3">
                {profiles.map(({ value, emoji, label }) => (
                  <button
                    key={value}
                    onClick={() => { setForm({ ...form, profile: value }); setStep(3); }}
                    className={`w-full text-left px-4 py-4 rounded-xl border-2 text-sm font-medium transition-all flex items-center gap-3 ${
                      form.profile === value
                        ? "border-[#1A3C6E] bg-blue-50 text-blue-800"
                        : "border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <span className="text-xl">{emoji}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors">
                <ArrowLeft size={14} /> Voltar
              </button>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Segmento do negócio</h2>
                <p className="text-slate-500 text-sm mt-1">Selecione o que melhor representa você</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SEGMENTOS.map((seg) => (
                  <button
                    key={seg}
                    type="button"
                    onClick={() => setForm({ ...form, segment: seg })}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                      form.segment === seg
                        ? "border-[#1A3C6E] bg-blue-50 text-blue-800"
                        : "border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    {seg}
                  </button>
                ))}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !form.segment}
                className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Criando conta..." : "Criar conta e começar →"}
              </button>

              <button onClick={() => setStep(2)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors">
                <ArrowLeft size={14} /> Voltar
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Já tem conta?{" "}
          <Link href="/login" className="text-[#1A3C6E] font-semibold hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}

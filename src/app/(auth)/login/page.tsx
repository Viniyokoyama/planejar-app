"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BarChart3, TrendingUp, MapPin, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || "Erro ao entrar.");
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1A3C6E] flex-col justify-between p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-400" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#F59E0B] rounded-xl p-2">
              <BarChart3 className="text-white" size={22} />
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">PLANEJAR</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Inteligência de mercado<br />
              <span className="text-[#F59E0B]">para empreendedores</span>
            </h1>
            <p className="text-blue-200 mt-4 text-lg leading-relaxed">
              Análises profissionais de geomarketing, concorrência e risco — em minutos, com IA.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: MapPin, text: "Geomarketing inteligente para o ponto ideal" },
              { icon: TrendingUp, text: "Diagnóstico completo do seu negócio" },
              { icon: ShieldCheck, text: "Alertas preditivos de risco de mercado" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="bg-white/15 rounded-lg p-2">
                  <Icon className="text-[#F59E0B]" size={16} />
                </div>
                <span className="text-blue-100 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-blue-300 text-xs">© 2026 Planejar. Todos os direitos reservados.</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="bg-[#F59E0B] rounded-xl p-2">
              <BarChart3 className="text-white" size={20} />
            </div>
            <span className="text-[#1A3C6E] font-bold text-2xl tracking-tight">PLANEJAR</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Bem-vindo de volta</h2>
            <p className="text-slate-500 mt-1">Entre na sua conta para continuar</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail</label>
                <input
                  type="email"
                  required
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
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-start gap-2">
                  <span className="mt-0.5">⚠</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Entrando...
                  </span>
                ) : "Entrar"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm text-slate-500">
                Não tem conta?{" "}
                <Link href="/cadastro" className="text-[#1A3C6E] font-semibold hover:underline">
                  Criar conta grátis
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Demo: demo@planejar.com.br / senha123
          </p>
        </div>
      </div>
    </div>
  );
}

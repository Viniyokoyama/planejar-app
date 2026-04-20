import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MapPin, Stethoscope, Users, ShieldAlert, Plus, FileText, ArrowRight } from "lucide-react";
import { ScoreBadge } from "@/components/ui/ScoreBadge";

function getFirstName(name: string) {
  return name.split(" ")[0];
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(date)
  );
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [reports, businesses] = await Promise.all([
    prisma.report.findMany({
      where: { userId: user.id, status: "completed" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { business: true },
    }),
    prisma.business.findMany({ where: { userId: user.id }, take: 1 }),
  ]);

  const modules = [
    {
      href: "/geomarketing",
      label: "Geomarketing",
      description: "Analise endereços e encontre o ponto ideal",
      icon: MapPin,
      color: "bg-blue-50 text-blue-700 border-blue-200",
      iconBg: "bg-blue-100",
    },
    {
      href: "/diagnostico",
      label: "Diagnóstico",
      description: "Avalie a maturidade do seu negócio",
      icon: Stethoscope,
      color: "bg-teal-50 text-teal-700 border-teal-200",
      iconBg: "bg-teal-100",
    },
    {
      href: "/concorrencia",
      label: "Concorrência",
      description: "Mapeie pontos fortes e fracos dos rivais",
      icon: Users,
      color: "bg-violet-50 text-violet-700 border-violet-200",
      iconBg: "bg-violet-100",
    },
    {
      href: "/riscos",
      label: "Gestão de Risco",
      description: "Alertas preditivos sobre seu mercado",
      icon: ShieldAlert,
      color: "bg-amber-50 text-amber-700 border-amber-200",
      iconBg: "bg-amber-100",
    },
  ];

  const typeLabel: Record<string, string> = {
    geomarketing: "Geomarketing",
    diagnostico: "Diagnóstico",
    concorrencia: "Concorrência",
    riscos: "Gestão de Risco",
    completo: "Análise Completa",
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Olá, {getFirstName(user.name)}! 👋
        </h1>
        <p className="text-slate-500 mt-1">
          O que vamos analisar hoje?
        </p>
      </div>

      {/* Módulos */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        {modules.map(({ href, label, description, icon: Icon, color, iconBg }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-start gap-4 p-5 rounded-xl border-2 hover:shadow-md transition-all ${color}`}
          >
            <div className={`p-2.5 rounded-lg ${iconBg}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="font-semibold">{label}</p>
              <p className="text-sm opacity-80 mt-0.5">{description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Histórico */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Relatórios recentes</h2>
          {businesses.length === 0 && (
            <Link href="/geomarketing" className="flex items-center gap-1 text-sm text-blue-700 hover:underline">
              <Plus size={14} /> Nova análise
            </Link>
          )}
        </div>

        {reports.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
            <FileText className="mx-auto text-slate-300 mb-3" size={40} />
            <p className="text-slate-600 font-medium">Nenhuma análise ainda</p>
            <p className="text-slate-400 text-sm mt-1 mb-5">
              Comece pelo Geomarketing para avaliar um endereço
            </p>
            <Link
              href="/geomarketing"
              className="inline-flex items-center gap-2 bg-[#1A3C6E] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors"
            >
              Iniciar primeira análise <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <Link
                key={report.id}
                href={`/relatorio/${report.id}`}
                className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-5 py-4 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-4">
                  <FileText className="text-slate-400" size={20} />
                  <div>
                    <p className="font-medium text-slate-800 text-sm">
                      {typeLabel[report.type] || report.type}
                      {report.business && (
                        <span className="text-slate-400 font-normal"> · {report.business.name}</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDate(report.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {report.overallScore !== null && (
                    <ScoreBadge score={report.overallScore} />
                  )}
                  <ArrowRight size={16} className="text-slate-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

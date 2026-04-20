"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Stethoscope,
  Users,
  ShieldAlert,
  LogOut,
  BarChart3,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/geomarketing", label: "Geomarketing", icon: MapPin },
  { href: "/diagnostico", label: "Diagnóstico", icon: Stethoscope },
  { href: "/concorrencia", label: "Concorrência", icon: Users },
  { href: "/riscos", label: "Gestão de Risco", icon: ShieldAlert },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <aside className="w-64 min-h-screen bg-[#0F2547] flex flex-col shadow-2xl">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <div className="bg-[#F59E0B] rounded-xl p-2 flex-shrink-0">
          <BarChart3 className="text-white" size={18} />
        </div>
        <div>
          <span className="text-white font-bold text-lg tracking-tight leading-none block">PLANEJAR</span>
          <span className="text-blue-300 text-[10px] font-medium tracking-widest uppercase leading-none">Inteligência de Mercado</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        <p className="text-[10px] font-semibold text-blue-400/60 uppercase tracking-widest px-3 pb-2">Módulos</p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-[#1A3C6E] text-white shadow-sm"
                  : "text-blue-200/70 hover:bg-white/8 hover:text-white"
              }`}
            >
              <Icon size={17} className={active ? "text-[#F59E0B]" : ""} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-5 border-t border-white/10 space-y-1">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-blue-200/60 hover:bg-white/8 hover:text-white transition-all"
        >
          <LogOut size={17} />
          Sair da conta
        </button>
      </div>
    </aside>
  );
}

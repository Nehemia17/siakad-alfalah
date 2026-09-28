"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Users, GraduationCap, BookOpen, ShieldCheck, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  {
    label: "Data Siswa",
    href: "/dashboard/siswa",
    icon: GraduationCap,
  },
  {
    label: "Data Guru",
    href: "/dashboard/guru",
    icon: Users,
  },
  {
    label: "Mata Pelajaran",
    href: "/dashboard/pelajaran",
    icon: BookOpen,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-[260px] bg-forest-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-forest-700/50 shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white tracking-tight leading-tight">
              SMKS AL FALAH
            </p>
            <p className="text-[11px] text-emerald-300/70 leading-tight">
              Sistem Informasi Akademik
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          <p className="px-3 mb-2 text-[10px] font-semibold text-emerald-400/50 uppercase tracking-widest">
            Menu Utama
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-white/15 text-white shadow-sm shadow-black/10"
                    : "text-emerald-100/60 hover:text-white hover:bg-white/8"
                )}
              >
                <item.icon
                  className={cn(
                    "w-[18px] h-[18px] shrink-0 transition-colors",
                    isActive
                      ? "text-emerald-300"
                      : "text-emerald-300/40 group-hover:text-emerald-300/70"
                  )}
                />
                {item.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout section */}
        <div className="px-3 py-3 border-t border-forest-700/50 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-300/70 hover:text-red-200 hover:bg-red-500/15 transition-all duration-200 group"
          >
            <LogOut className="w-[18px] h-[18px] shrink-0 text-red-400/50 group-hover:text-red-300 transition-colors" />
            Keluar dari Sistem
          </button>
          <p className="text-[10px] text-emerald-400/30 text-center mt-2">
            SIAKAD v1.0.0
          </p>
        </div>
      </aside>
    </>
  );
}

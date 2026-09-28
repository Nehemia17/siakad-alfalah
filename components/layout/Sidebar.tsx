"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, GraduationCap, BookOpen, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

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

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-[260px] bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-forest-700 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-forest-700 tracking-tight leading-tight">
              SMKS AL FALAH
            </p>
            <p className="text-[11px] text-slate-400 leading-tight">
              Sistem Informasi Akademik
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          <p className="px-3 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
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
                    ? "bg-forest-50 text-forest-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <item.icon
                  className={cn(
                    "w-[18px] h-[18px] shrink-0 transition-colors",
                    isActive
                      ? "text-forest-600"
                      : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                {item.label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-forest-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 text-center">
            SIAKAD v1.0.0
          </p>
        </div>
      </aside>
    </>
  );
}

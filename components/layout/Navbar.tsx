"use client";

import { Menu } from "lucide-react";

interface NavbarProps {
  onMenuToggle: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center h-14 px-4 sm:px-6 bg-forest-700 shadow-md">
      <button
        onClick={onMenuToggle}
        className="flex items-center justify-center w-9 h-9 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5" />
      </button>
    </header>
  );
}

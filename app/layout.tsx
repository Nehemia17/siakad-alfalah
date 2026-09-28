import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIAKAD - SMKS Al Falah",
  description:
    "Sistem Informasi Akademik SMKS Al Falah - Platform pengelolaan data siswa, guru, dan mata pelajaran.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}

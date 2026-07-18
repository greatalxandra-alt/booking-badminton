"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // 1. Tambahkan useRouter di sini
import {
  LayoutDashboard,
  CalendarDays,
  Map,
  Settings,
  LogOut,
  Activity,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { adminLogout } from "@/lib/actions/auth";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter(); // 2. Inisialisasi router di sini

  const handleLogout = async () => {
    try {
      // Jalankan fungsi hapus session backend kamu
      await adminLogout();

      // Paksa router Next.js untuk hapus cache data admin yang tersisa
      router.refresh();

      // Pindahkan user secara paksa ke beranda utama / dashboard depan user
      router.push("/");
    } catch (error) {
      console.error("Gagal melakukan navigasi keluar:", error);
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Data Booking", href: "/admin/booking", icon: CalendarDays },
    { name: "Kelola Lapangan", href: "/admin/lapangan", icon: Map },
    { name: "Kelola Galeri", href: "/admin/galeri", icon: ImageIcon },
    { name: "Pengaturan", href: "/admin/pengaturan", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-surface-dark border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="bg-primary text-white p-1.5 rounded-lg">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold font-display text-white">
              AdminPanel
            </span>
          </Link>
          <button
            className="lg:hidden text-text-secondary hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname?.startsWith(`${item.href}/`);
            const isReallyActive =
              item.href === "/admin" ? pathname === "/admin" : isActive;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all font-body text-sm font-bold min-h-[44px] ${
                  isReallyActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-text-secondary hover:bg-surface-darker hover:text-white border border-transparent"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${isReallyActive ? "text-primary" : "text-text-tertiary"}`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer/Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3.5 rounded-xl text-error hover:bg-error/10 transition-all font-body text-sm font-bold min-h-[44px]"
          >
            <LogOut className="h-5 w-5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}

"use client";

import { useState } from "react";
import { checkBookingStatus } from "@/lib/actions/booking";
import { Booking, Lapangan } from "@/types";
import {
  Search,
  Loader2,
  Calendar,
  Clock,
  Activity,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

export default function CekBooking() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<Booking[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(false);

    try {
      const data = await checkBookingStatus(query.trim());
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "lunas":
        return (
          <span className="bg-success/20 text-success px-3 py-1.5 rounded-lg text-xs font-bold font-body border border-success/30 uppercase tracking-wider">
            Lunas
          </span>
        );
      case "menunggu_konfirmasi":
        return (
          <span className="bg-secondary/20 text-secondary px-3 py-1.5 rounded-lg text-xs font-bold font-body border border-secondary/30 uppercase tracking-wider">
            Proses Verifikasi
          </span>
        );
      case "pending":
        return (
          <span className="bg-primary/20 text-primary px-3 py-1.5 rounded-lg text-xs font-bold font-body border border-primary/30 uppercase tracking-wider">
            Menunggu Pembayaran
          </span>
        );
      case "batal":
        return (
          <span className="bg-error/20 text-error px-3 py-1.5 rounded-lg text-xs font-bold font-body border border-error/30 uppercase tracking-wider">
            Dibatalkan
          </span>
        );
      default:
        return (
          <span className="bg-surface-darker text-text-secondary px-3 py-1.5 rounded-lg text-xs font-bold font-body border border-white/10 uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  return (
    <main className="min-h-screen bg-surface-darker flex flex-col">
      {/* Navbar Simple */}
      <nav className="w-full bg-black/95 py-0 px-6 sm:px-8 lg:px-12 sticky top-0 z-50 h-20 flex items-center shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] border-b border-white/10">
        <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary text-white p-1.5 rounded-lg">
              <Activity className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold font-display text-white leading-tight">
                BadmintonSpace
              </span>
            </div>
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto w-full px-4 md:px-6 py-12 lg:py-20 flex-1">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
            Cek Status Booking
          </h1>
          <p className="text-sm font-body text-text-secondary max-w-lg mx-auto">
            Masukkan Nomor WhatsApp atau ID Booking Anda untuk melihat status
            pemesanan, melakukan pembayaran, atau mengunggah bukti transfer.
          </p>
        </div>

        <div className="bg-surface-dark rounded-2xl p-6 md:p-8 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] border border-white/5 mb-10">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Misal: 08123456789 atau ID Booking..."
                className="w-full bg-surface-darker text-white font-body text-base px-4 py-4 rounded-xl border border-white/10 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all placeholder:text-disabled min-h-[56px]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`md:w-auto w-full flex justify-center items-center py-4 px-8 rounded-xl text-base font-bold font-body transition-all min-h-[56px]
                ${
                  loading
                    ? "bg-disabled text-white/50 cursor-not-allowed opacity-50"
                    : "bg-primary text-white hover:bg-primary-hover hover:shadow-[0px_4px_12px_rgba(249,115,22,0.3)] active:bg-primary-active"
                }
              `}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" /> Cari Data
                </>
              )}
            </button>
          </form>
        </div>

        {searched && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold font-display text-white mb-4 border-b border-white/10 pb-4">
              Hasil Pencarian ({results.length})
            </h2>

            {results.length === 0 ? (
              <div className="bg-surface-dark rounded-2xl p-8 text-center border border-white/5">
                <Search className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                <h3 className="text-lg font-bold font-display text-white mb-2">
                  Data tidak ditemukan
                </h3>
                <p className="text-sm font-body text-text-secondary">
                  Pastikan nomor WhatsApp atau ID Booking yang Anda masukkan
                  sudah benar.
                </p>
              </div>
            ) : (
              results.map((booking) => {
                const lapangan = booking.lapangan as unknown as Lapangan;
                const startHour = parseInt(booking.jam_mulai.split(":")[0]);
                const endHour = parseInt(booking.jam_selesai.split(":")[0]);
                const duration = endHour - startHour;
                const totalHarga = duration * (lapangan?.harga_per_jam || 0);
                return (
                  <div
                    key={booking.id}
                    className="bg-surface-dark rounded-2xl overflow-hidden shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] border border-white/5 hover:border-white/20 transition-colors"
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-6 border-b border-white/10 gap-4">
                        <div>
                          <p className="text-xs font-body text-text-secondary mb-1">
                            ID Booking
                          </p>
                          <p className="text-sm font-bold font-body text-white uppercase tracking-wider">
                            {booking.id.split("-")[0]}
                          </p>
                        </div>
                        <div>{getStatusBadge(booking.status)}</div>
                      </div>

                      <div className="flex items-start space-x-4 mb-6">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-darker shrink-0 hidden sm:block">
                          {lapangan?.foto_url ? (
                            <img
                              src={lapangan.foto_url}
                              alt={lapangan?.nama}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-tertiary text-xs font-body">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold font-display text-white mb-3">
                            {lapangan?.nama || "Lapangan tidak diketahui"}
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-start">
                              <Calendar className="w-4 h-4 text-primary mr-2 mt-0.5 shrink-0" />
                              <div>
                                <span className="block text-sm font-bold font-body text-white">
                                  {formatDate(booking.tanggal_main)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Clock className="w-4 h-4 text-primary mr-2 mt-0.5 shrink-0" />
                              <div>
                                <span className="block text-sm font-bold font-body text-white">
                                  {booking.jam_mulai.slice(0, 5)} -{" "}
                                  {booking.jam_selesai.slice(0, 5)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-surface-darker rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/5">
                        <div>
                          <span className="block text-xs font-body text-text-secondary mb-1">
                            Total Biaya
                          </span>
                          <span className="block text-xl font-bold font-display text-primary">
                            {formatRupiah(totalHarga)}
                          </span>
                        </div>
                        <Link
                          href={`/booking/${booking.id}/sukses`}
                          className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-bold font-body text-white bg-surface-dark border border-white/10 hover:border-primary hover:text-primary transition-all min-h-[44px]"
                        >
                          Lihat Detail
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      <footer className="bg-surface-dark border-t border-white/10 py-8 text-center text-text-secondary text-sm font-body mt-auto">
        <p>
          &copy; {new Date().getFullYear()} BadmintonSpace. Dibuat untuk
          kenyamanan bermainmu.
        </p>
      </footer>
    </main>
  );
}

import { getBookingById } from "@/lib/actions/booking";
import { getSemuaPengaturan } from "@/lib/actions/pengaturan";
import { notFound } from "next/navigation";
import UploadBukti from "@/components/UploadBukti";
import CopyIdOverlay from "@/components/CopyIdOverlay";
import PaymentDetails from "@/components/PaymentDetails";
import { Suspense } from "react";
import {
  CheckCircle,
  Clock,
  Calendar,
  Activity,
  ChevronLeft,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { Lapangan } from "@/types";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SuksesBooking(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { id } = params;
  
  const booking = await getBookingById(id);
  const pengaturan = await getSemuaPengaturan();
  
  const isNew = searchParams?.new === "true";

  if (!booking) {
    notFound();
  }

  const lapangan = booking.lapangan as unknown as Lapangan;

  const startHour = parseInt(booking.jam_mulai.split(":")[0]);
  const endHour = parseInt(booking.jam_selesai.split(":")[0]);
  const duration = endHour - startHour;
  const totalHarga = duration * (lapangan?.harga_per_jam || 0);

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

  return (
    <main className="min-h-screen bg-surface-darker flex flex-col">
      <Suspense fallback={null}>
        <CopyIdOverlay bookingId={booking.id} />
      </Suspense>
      
      {/* Navbar Simple */}
      <nav className="w-full bg-black/95 py-0 px-6 sm:px-8 lg:px-12 sticky top-0 z-50 h-20 flex items-center shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]">
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

      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-6 py-8 lg:py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* Left Column: Status & Instruksi */}
          <div className="space-y-8">
            <div className="bg-surface-dark rounded-2xl p-6 md:p-8 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] border border-white/5 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-success/20 text-success rounded-full mb-6">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h1 className="text-3xl font-bold font-display text-white mb-2">
                Booking Berhasil Dibuat!
              </h1>
              <p className="text-text-secondary font-body mb-6">
                ID Booking:{" "}
                <span className="font-bold text-white tracking-wider">
                  {booking.id.split("-")[0].toUpperCase()}
                </span>
              </p>

              <PaymentDetails 
                namaBank={pengaturan['nama_bank'] || 'Bank BCA'}
                noRekening={pengaturan['no_rekening'] || '123 456 7890'}
                atasNama={pengaturan['atas_nama_rekening'] || 'Mumbul Arena'}
                qrisUrl={pengaturan['qris_url'] || null}
              />
            </div>

            {/* Jika status masih pending, tampilkan form upload */}
            {booking.status === "pending" && (
              <UploadBukti bookingId={booking.id} />
            )}

            {booking.status === "pending" && (
              <div className="bg-primary/10 border border-primary/30 rounded-2xl p-6 flex items-start space-x-4">
                <div className="bg-primary/20 p-2 rounded-full mt-1 shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-bold font-display text-white mb-1">
                    Menunggu Verifikasi
                  </h4>
                  <p className="text-sm font-body text-text-secondary">
                    Bukti pembayaran Anda sedang kami proses. Status akan
                    diperbarui dalam waktu maksimal 30 menit.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Ringkasan Booking */}
          <div>
            <div className="bg-surface-dark rounded-2xl p-6 md:p-8 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] border border-white/5 sticky top-28">
              <h3 className="text-xl font-bold font-display text-white mb-6">
                Ringkasan Pemesanan
              </h3>

              <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-white/10">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-darker shrink-0">
                  {lapangan.foto_url ? (
                    <img
                      src={lapangan.foto_url}
                      alt={lapangan.nama}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-tertiary text-xs">
                      No Image
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-bold font-display text-white mb-1">
                    {lapangan.nama}
                  </h4>
                  <div className="flex items-center text-xs font-body text-text-secondary">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-primary" />
                    <span>Indoor Arena</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-primary mr-3 mt-0.5 shrink-0" />
                  <div>
                    <span className="block text-xs font-body text-text-secondary mb-1">
                      Tanggal Main
                    </span>
                    <span className="block text-sm font-bold font-body text-white">
                      {formatDate(booking.tanggal_main)}
                    </span>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-primary mr-3 mt-0.5 shrink-0" />
                  <div>
                    <span className="block text-xs font-body text-text-secondary mb-1">
                      Jam Main
                    </span>
                    <span className="block text-sm font-bold font-body text-white">
                      {booking.jam_mulai.slice(0, 5)} -{" "}
                      {booking.jam_selesai.slice(0, 5)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-darker rounded-xl p-5 mb-6 border border-white/5">
                <h5 className="text-sm font-bold font-body text-white mb-3 border-b border-white/10 pb-2">
                  Detail Anda
                </h5>
                <div className="space-y-2 text-sm font-body">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Nama</span>
                    <span className="text-white font-medium">
                      {booking.nama_pemesan}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">No. WhatsApp</span>
                    <span className="text-white font-medium">
                      {booking.no_hp}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <span className="text-sm font-body text-text-secondary">
                  Total Bayar
                </span>
                <span className="text-2xl font-bold font-display text-primary">
                  {formatRupiah(totalHarga)}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                href={isNew ? "/" : "/cek-booking"}
                className="inline-flex items-center text-sm font-body text-primary hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                {isNew ? "Kembali ke Beranda" : "Kembali ke Cek Status"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

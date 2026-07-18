import { getLapanganById } from '@/lib/actions/lapangan';
import { getSemuaPengaturan } from '@/lib/actions/pengaturan';
import { notFound } from 'next/navigation';
import { Clock, CheckCircle, MapPin, Activity, ChevronLeft } from 'lucide-react';
import BookingWidget from '@/components/BookingWidget';
import WelcomeOverlay from '@/components/WelcomeOverlay';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LapanganDetail(props: Props) {
  const params = await props.params;
  const lapangan = await getLapanganById(params.id);
  const settings = await getSemuaPengaturan();

  if (!lapangan) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-surface-darker flex flex-col">
       <WelcomeOverlay />
       
       {/* Navbar */}
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
        
        <Link href="/" className="inline-flex items-center text-sm font-body text-text-secondary hover:text-white transition-colors mb-6">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Kembali ke Daftar Lapangan
        </Link>

        {/* Detail Lapangan Header */}
        <div className="bg-surface-dark rounded-2xl overflow-hidden shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] border border-white/5">
          <div className="relative h-[250px] md:h-[400px] w-full bg-surface-darker">
            {lapangan.foto_url ? (
              <img src={lapangan.foto_url} alt={lapangan.nama} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-text-tertiary">
                <span className="font-body">No Image Available</span>
              </div>
            )}
            {lapangan.status_aktif && (
              <div className="absolute top-4 left-4 flex items-center space-x-1 rounded-lg bg-success px-3 py-1.5 text-xs font-medium font-body text-white shadow-lg">
                <CheckCircle className="h-4 w-4" />
                <span>Tersedia</span>
              </div>
            )}
          </div>
          
          <div className="p-6 md:p-10 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-6 leading-none">{lapangan.nama}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center space-x-2 text-sm font-medium font-body text-text-secondary bg-surface-darker border border-white/10 px-4 py-2 rounded-xl">
                <Clock className="h-4 w-4 text-primary" />
                <span>{lapangan.jam_buka.slice(0,5)} - {lapangan.jam_tutup.slice(0,5)}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm font-medium font-body text-text-secondary bg-surface-darker border border-white/10 px-4 py-2 rounded-xl">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Fasilitas Indoor</span>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold font-display text-white mb-3">Deskripsi Lapangan</h3>
              <p className="text-text-secondary font-body leading-relaxed max-w-3xl text-base">
                {lapangan.deskripsi || "Lapangan badminton premium dengan fasilitas lengkap. Permukaan lapangan menggunakan material standar yang nyaman dan anti-slip. Tersedia area parkir luas dan fasilitas pendukung lainnya."}
              </p>
            </div>
          </div>
        </div>
        
        {/* Booking Interactive Widget */}
        <BookingWidget 
          lapanganId={lapangan.id} 
          hargaPerJam={lapangan.harga_per_jam} 
          qrisUrl={settings['qris_url']}
        />
        
      </div>

      <footer className="bg-surface-dark border-t border-white/10 py-8 text-center text-text-secondary text-sm font-body mt-auto">
        <p>&copy; {new Date().getFullYear()} BadmintonSpace. Dibuat untuk kenyamanan bermainmu.</p>
      </footer>
    </main>
  );
}

import Link from 'next/link';
import { Lapangan } from '@/types';
import { Clock, CheckCircle } from 'lucide-react';

interface LapanganCardProps {
  lapangan: Lapangan;
}

export default function LapanganCard({ lapangan }: LapanganCardProps) {
  // Format price to Rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
  };

  return (
    <Link href={`/lapangan/${lapangan.id}`} className="group block h-full">
      <div className="relative overflow-hidden rounded-2xl bg-surface-dark border border-white/5 transition-all duration-300 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0px_10px_30px_rgba(249,115,22,0.15)] h-full flex flex-col">
        {/* Image Container */}
        <div className="relative h-56 w-full overflow-hidden bg-surface-darker shrink-0">
          {lapangan.foto_url ? (
            <img 
              src={lapangan.foto_url} 
              alt={lapangan.nama} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-dark text-text-tertiary">
              <span className="text-sm font-medium font-body">No Image</span>
            </div>
          )}
          
          {/* Status Badge */}
          {lapangan.status_aktif && (
            <div className="absolute top-4 left-4 flex items-center space-x-1 rounded-lg bg-success px-3 py-1.5 text-xs font-bold font-body text-white shadow-lg backdrop-blur-sm">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Tersedia</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col grow">
          <h3 className="text-xl font-bold font-display text-white leading-tight mb-2 group-hover:text-primary transition-colors duration-300">{lapangan.nama}</h3>
          
          <p className="text-sm font-body font-normal text-text-secondary mb-6 line-clamp-2 leading-relaxed">
            {lapangan.deskripsi || "Lapangan badminton premium dengan fasilitas lengkap."}
          </p>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold font-body text-text-tertiary uppercase tracking-wider mb-1">Harga per jam</span>
              <span className="text-lg font-bold font-display text-primary leading-none">{formatRupiah(lapangan.harga_per_jam)}</span>
            </div>
            
            <div className="flex items-center space-x-1.5 text-xs font-bold font-body text-text-secondary bg-surface-darker border border-white/5 px-3 py-2 rounded-lg">
              <Clock className="h-4 w-4 text-primary" />
              <span>{lapangan.jam_buka.slice(0,5)} - {lapangan.jam_tutup.slice(0,5)}</span>
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}

'use client'

import { useState } from 'react';
import { Booking, Lapangan } from '@/types';
import { updateBookingStatus } from '@/lib/actions/booking';
import { Search, MoreVertical, CheckCircle, XCircle, ExternalLink, X, MapPin, Calendar, Clock, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface BookingTableProps {
  initialBookings: Booking[];
}

export default function BookingTable({ initialBookings }: BookingTableProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.nama_pemesan.toLowerCase().includes(search.toLowerCase()) || 
                          b.no_hp.includes(search) || 
                          b.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const result = await updateBookingStatus(id, newStatus);
      if (result.success) {
        if (newStatus === 'batal') {
          toast.success("Booking berhasil dibatalkan, lapangan kini tersedia kembali!");
        } else {
          toast.success(`Status berhasil diubah menjadi ${newStatus}`);
        }
        setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus as 'pending' | 'lunas' | 'batal' } : b));
        if (selectedBooking?.id === id) {
          setSelectedBooking({ ...selectedBooking, status: newStatus as 'pending' | 'lunas' | 'batal' });
        }
        router.refresh();
      } else {
        toast.error(result.error || 'Gagal mengubah status');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan jaringan');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'lunas':
        return <span className="bg-success/20 text-success px-2.5 py-1 rounded-md text-xs font-bold font-body border border-success/30 uppercase tracking-wider">Lunas</span>;
      case 'pending':
        return <span className="bg-primary/20 text-primary px-2.5 py-1 rounded-md text-xs font-bold font-body border border-primary/30 uppercase tracking-wider">Pending</span>;
      case 'batal':
        return <span className="bg-error/20 text-error px-2.5 py-1 rounded-md text-xs font-bold font-body border border-error/30 uppercase tracking-wider">Batal</span>;
      default:
        return <span className="bg-surface-darker text-text-secondary px-2.5 py-1 rounded-md text-xs font-bold font-body border border-white/10 uppercase tracking-wider">{status}</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold font-display text-white mb-2">Data Booking</h1>
          <p className="text-sm font-body text-text-secondary">Kelola pemesanan, verifikasi pembayaran, dan ubah status.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface-dark rounded-2xl p-4 md:p-6 border border-white/5 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Cari nama, No HP, atau ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-darker rounded-xl border border-white/10 text-white font-body text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-48 px-4 py-2.5 bg-surface-darker rounded-xl border border-white/10 text-white font-body text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
        >
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="lunas">Lunas</option>
          <option value="batal">Batal</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface-dark rounded-2xl border border-white/5 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-body whitespace-nowrap">
            <thead className="bg-surface-darker text-text-secondary text-xs uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">ID / Tanggal</th>
                <th className="px-6 py-4 font-medium">Pemesan</th>
                <th className="px-6 py-4 font-medium">Lapangan & Jadwal</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-secondary">
                    Tidak ada data booking yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const lapangan = booking.lapangan as unknown as Lapangan;
                  return (
                    <tr key={booking.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedBooking(booking)}>
                      <td className="px-6 py-4">
                        <div className="font-bold uppercase text-xs mb-0.5">{booking.id.split('-')[0]}</div>
                        <div className="text-text-secondary text-xs">{formatDate(booking.created_at)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white mb-0.5">{booking.nama_pemesan}</div>
                        <div className="text-text-secondary text-xs">{booking.no_hp}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white mb-0.5">{lapangan?.nama || 'Unknown'}</div>
                        <div className="text-text-secondary text-xs">{formatDate(booking.tanggal_main)}, {booking.jam_mulai.slice(0,5)} - {booking.jam_selesai.slice(0,5)}</div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedBooking(booking); }}
                          className="p-2 bg-surface-darker rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail Booking */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={() => setSelectedBooking(null)}
          ></div>
          <div className="bg-surface-dark rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="sticky top-0 bg-surface-darker border-b border-white/10 px-6 py-4 flex items-center justify-between z-20">
              <h2 className="text-xl font-bold font-display text-white">Detail Booking</h2>
              <button onClick={() => setSelectedBooking(null)} className="text-text-secondary hover:text-white p-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Info Header */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-body text-text-secondary mb-1">ID Booking</p>
                  <p className="text-lg font-bold font-display text-white uppercase tracking-wider">{selectedBooking.id}</p>
                </div>
                <div>
                  {getStatusBadge(selectedBooking.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Info Pemesan */}
                <div className="bg-surface-darker p-5 rounded-xl border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold font-body text-white border-b border-white/10 pb-2">Data Pemesan</h3>
                  <div>
                    <p className="text-xs font-body text-text-secondary mb-1">Nama</p>
                    <p className="text-sm font-medium font-body text-white">{selectedBooking.nama_pemesan}</p>
                  </div>
                  <div>
                    <p className="text-xs font-body text-text-secondary mb-1">No WhatsApp</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium font-body text-white">{selectedBooking.no_hp}</p>
                      <a href={`https://wa.me/${selectedBooking.no_hp.replace(/^0/, '62')}`} target="_blank" rel="noreferrer" className="text-success hover:text-success/80">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-body text-text-secondary mb-1">Catatan</p>
                    <p className="text-sm font-medium font-body text-white">{selectedBooking.catatan || '-'}</p>
                  </div>
                </div>

                {/* Info Lapangan */}
                <div className="bg-surface-darker p-5 rounded-xl border border-white/5 space-y-4">
                  <h3 className="text-sm font-bold font-body text-white border-b border-white/10 pb-2">Data Lapangan</h3>
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs font-body text-text-secondary mb-1">Lapangan</p>
                      <p className="text-sm font-medium font-body text-white">{(selectedBooking.lapangan as unknown as Lapangan)?.nama}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Calendar className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs font-body text-text-secondary mb-1">Tanggal</p>
                      <p className="text-sm font-medium font-body text-white">{formatDate(selectedBooking.tanggal_main)}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Clock className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs font-body text-text-secondary mb-1">Waktu</p>
                      <p className="text-sm font-medium font-body text-white">{selectedBooking.jam_mulai.slice(0,5)} - {selectedBooking.jam_selesai.slice(0,5)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bukti Bayar */}
              <div className="bg-surface-darker p-5 rounded-xl border border-white/5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h3 className="text-sm font-bold font-body text-white">Bukti Pembayaran</h3>
                  <div className="flex items-center text-primary font-bold">
                    <CreditCard className="w-4 h-4 mr-2" />
                    {formatRupiah(
                      (parseInt(selectedBooking.jam_selesai.split(':')[0]) - parseInt(selectedBooking.jam_mulai.split(':')[0])) 
                      * ((selectedBooking.lapangan as unknown as Lapangan)?.harga_per_jam || 0)
                    )}
                  </div>
                </div>
                
                {selectedBooking.bukti_pembayaran_url ? (
                  <div className="rounded-xl overflow-hidden bg-black/50 border border-white/10 relative group">
                    <img 
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/bukti-bayar/${selectedBooking.bukti_pembayaran_url}`} 
                      alt="Bukti Transfer" 
                      className="w-full h-auto max-h-[300px] object-contain"
                    />
                    <a 
                      href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/bukti-bayar/${selectedBooking.bukti_pembayaran_url}`} 
                      target="_blank"
                      rel="noreferrer"
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold"
                    >
                      Buka Gambar Asli <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                ) : (
                  <div className="text-center p-8 bg-black/30 rounded-xl border border-white/5">
                    <p className="text-text-secondary text-sm font-body">Belum ada bukti pembayaran yang diunggah.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 bg-surface-darker border-t border-white/10 px-6 py-4 flex items-center justify-end space-x-4 z-20">
              <button 
                onClick={() => handleUpdateStatus(selectedBooking.id, 'batal')}
                disabled={selectedBooking.status === 'batal'}
                className="px-4 py-2 bg-error/10 text-error hover:bg-error/20 rounded-lg text-sm font-bold font-body transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <XCircle className="w-4 h-4 mr-2" /> Batalkan & Kosongkan Lapangan
              </button>
              <button 
                onClick={() => handleUpdateStatus(selectedBooking.id, 'lunas')}
                disabled={selectedBooking.status === 'lunas'}
                className="px-4 py-2 bg-success text-white hover:bg-success/90 rounded-lg text-sm font-bold font-body transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Setujui & Lunas
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

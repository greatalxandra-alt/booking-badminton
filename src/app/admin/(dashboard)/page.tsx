import { getDashboardStats, getAdminBookings } from '@/lib/actions/booking';
import { Booking, Lapangan } from '@/types';
import { Calendar, CheckCircle, Clock, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const allBookings = await getAdminBookings();
  
  // Ambil 5 booking terbaru untuk tabel
  const recentBookings = allBookings.slice(0, 5);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'lunas':
        return <span className="bg-success/20 text-success px-2.5 py-1 rounded-md text-[10px] font-bold font-body border border-success/30 uppercase tracking-wider">Lunas</span>;
      case 'pending':
        return <span className="bg-primary/20 text-primary px-2.5 py-1 rounded-md text-[10px] font-bold font-body border border-primary/30 uppercase tracking-wider">Pending</span>;
      case 'batal':
        return <span className="bg-error/20 text-error px-2.5 py-1 rounded-md text-[10px] font-bold font-body border border-error/30 uppercase tracking-wider">Batal</span>;
      default:
        return <span className="bg-surface-darker text-text-secondary px-2.5 py-1 rounded-md text-[10px] font-bold font-body border border-white/10 uppercase tracking-wider">{status}</span>;
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string }) => (
    <div className="bg-surface-dark rounded-2xl p-6 border border-white/5 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] flex items-start justify-between">
      <div>
        <p className="text-sm font-body text-text-secondary mb-1">{title}</p>
        <h3 className="text-3xl font-bold font-display text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold font-display text-white mb-2">Ikhtisar Hari Ini</h1>
        <p className="text-sm font-body text-text-secondary">Pantau aktivitas penyewaan lapangan Anda dengan cepat.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <StatCard 
          title="Total Booking (Hari Ini)" 
          value={stats.today} 
          icon={Calendar}
          color="bg-secondary/20 text-secondary"
        />
        <StatCard 
          title="Menunggu Pembayaran" 
          value={stats.pending} 
          icon={Clock}
          color="bg-primary/20 text-primary"
        />
        <StatCard 
          title="Booking Lunas" 
          value={stats.lunas} 
          icon={CheckCircle}
          color="bg-success/20 text-success"
        />
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-surface-dark rounded-2xl border border-white/5 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold font-display text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            Booking Terbaru
          </h2>
          <Link 
            href="/admin/booking"
            className="text-sm font-body font-bold text-primary hover:text-white transition-colors"
          >
            Lihat Semua &rarr;
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-body whitespace-nowrap">
            <thead className="bg-surface-darker text-text-secondary text-xs uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">ID / Tanggal</th>
                <th className="px-6 py-4 font-medium">Pemesan</th>
                <th className="px-6 py-4 font-medium">Lapangan</th>
                <th className="px-6 py-4 font-medium">Jadwal</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-secondary">
                    Belum ada data booking.
                  </td>
                </tr>
              ) : (
                recentBookings.map((booking) => {
                  const lapangan = booking.lapangan as unknown as Lapangan;
                  return (
                    <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold uppercase text-xs mb-0.5">{booking.id.split('-')[0]}</div>
                        <div className="text-text-secondary text-xs">{formatDate(booking.created_at)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white mb-0.5">{booking.nama_pemesan}</div>
                        <div className="text-text-secondary text-xs">{booking.no_hp}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{lapangan?.nama || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium mb-0.5">{formatDate(booking.tanggal_main)}</div>
                        <div className="text-text-secondary text-xs">{booking.jam_mulai.slice(0,5)} - {booking.jam_selesai.slice(0,5)}</div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(booking.status)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

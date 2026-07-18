'use client'

import { useState } from 'react';
import { Lapangan } from '@/types';
import { toggleStatusLapangan } from '@/lib/actions/lapangan';
import FormLapangan from '@/components/admin/FormLapangan';
import { Plus, Edit2, Power, PowerOff, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface LapanganTableProps {
  initialLapangans: Lapangan[];
}

export default function LapanganTable({ initialLapangans }: LapanganTableProps) {
  const [lapangans, setLapangans] = useState<Lapangan[]>(initialLapangans);
  const [showForm, setShowForm] = useState(false);
  const [editingLapangan, setEditingLapangan] = useState<Lapangan | null>(null);

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const result = await toggleStatusLapangan(id, !currentStatus);
      if (result.success) {
        toast.success(`Lapangan berhasil di${!currentStatus ? 'aktifkan' : 'nonaktifkan'}`);
        setLapangans(lapangans.map(l => l.id === id ? { ...l, status_aktif: !currentStatus } : l));
      } else {
        toast.error(result.error || 'Gagal mengubah status');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan jaringan');
    }
  };

  const handleEdit = (lapangan: Lapangan) => {
    setEditingLapangan(lapangan);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingLapangan(null);
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold font-display text-white mb-2">Kelola Lapangan</h1>
          <p className="text-sm font-body text-text-secondary">Tambah, ubah, atau nonaktifkan lapangan yang tersedia.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-primary text-white hover:bg-primary-hover active:bg-primary-active px-5 py-2.5 rounded-xl font-body font-bold text-sm transition-all flex items-center shadow-[0px_4px_12px_rgba(249,115,22,0.3)]"
        >
          <Plus className="w-5 h-5 mr-2" />
          Tambah Lapangan
        </button>
      </div>

      {/* Table */}
      <div className="bg-surface-dark rounded-2xl border border-white/5 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-body whitespace-nowrap">
            <thead className="bg-surface-darker text-text-secondary text-xs uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium">Info Lapangan</th>
                <th className="px-6 py-4 font-medium">Harga/Jam</th>
                <th className="px-6 py-4 font-medium">Jam Operasional</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {lapangans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-secondary">
                    Belum ada data lapangan. Silakan tambahkan.
                  </td>
                </tr>
              ) : (
                lapangans.map((lapangan) => (
                  <tr key={lapangan.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-surface-darker border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                        {lapangan.foto_url ? (
                          <img src={lapangan.foto_url} alt={lapangan.nama} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-text-tertiary" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white mb-0.5">{lapangan.nama}</div>
                        <div className="text-text-secondary text-xs truncate max-w-[200px]">{lapangan.deskripsi || '-'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-primary">{formatRupiah(lapangan.harga_per_jam)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{lapangan.jam_buka.slice(0,5)} - {lapangan.jam_tutup.slice(0,5)}</div>
                    </td>
                    <td className="px-6 py-4">
                      {lapangan.status_aktif ? (
                        <span className="bg-success/20 text-success px-2.5 py-1 rounded-md text-xs font-bold font-body border border-success/30 uppercase tracking-wider">Aktif</span>
                      ) : (
                        <span className="bg-surface-darker text-text-secondary px-2.5 py-1 rounded-md text-xs font-bold font-body border border-white/10 uppercase tracking-wider">Nonaktif</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleEdit(lapangan)}
                          className="p-2 bg-surface-darker rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-colors tooltip"
                          title="Edit Lapangan"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(lapangan.id, lapangan.status_aktif)}
                          className={`p-2 rounded-lg transition-colors tooltip ${
                            lapangan.status_aktif 
                              ? 'bg-surface-darker text-text-secondary hover:text-error hover:bg-error/10' 
                              : 'bg-surface-darker text-text-secondary hover:text-success hover:bg-success/10'
                          }`}
                          title={lapangan.status_aktif ? "Nonaktifkan" : "Aktifkan"}
                        >
                          {lapangan.status_aktif ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <FormLapangan 
          lapangan={editingLapangan} 
          onClose={handleCloseForm} 
          onSuccess={() => {
            handleCloseForm();
            // Data refresh is handled by router.refresh() in FormLapangan
          }} 
        />
      )}
    </div>
  );
}

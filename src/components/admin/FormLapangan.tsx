'use client'

import { useState } from 'react';
import { Lapangan } from '@/types';
import { createLapangan, updateLapangan } from '@/lib/actions/lapangan';
import { toast } from 'sonner';
import { Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FormLapanganProps {
  lapangan?: Lapangan | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FormLapangan({ lapangan, onClose, onSuccess }: FormLapanganProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const isEdit = !!lapangan;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    // Status aktif dikirim via checkbox, formData only includes it if checked.
    const isStatusAktif = formData.get('status_aktif') === 'on';

    let result;
    if (isEdit) {
      const updateData = {
        nama: formData.get('nama') as string,
        deskripsi: formData.get('deskripsi') as string,
        harga_per_jam: Number(formData.get('harga_per_jam')),
        jam_buka: formData.get('jam_buka') as string,
        jam_tutup: formData.get('jam_tutup') as string,
        foto_url: (formData.get('foto_url') as string) || null,
        status_aktif: isStatusAktif,
      };
      result = await updateLapangan(lapangan.id, updateData);
    } else {
      // Ensure we send a boolean string value 'true' or 'false' untuk createLapangan
      formData.set('status_aktif', isStatusAktif ? 'true' : 'false');
      result = await createLapangan(formData);
    }

    setLoading(false);

    if (result.success) {
      toast.success(`Lapangan berhasil ${isEdit ? 'diperbarui' : 'ditambahkan'}`);
      onSuccess();
      router.refresh();
    } else {
      toast.error(result.error || 'Terjadi kesalahan');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      <div className="bg-surface-dark rounded-2xl border border-white/10 w-full max-w-xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-surface-darker border-b border-white/10 px-6 py-4 flex items-center justify-between z-20">
          <h2 className="text-xl font-bold font-display text-white">{isEdit ? 'Edit Lapangan' : 'Tambah Lapangan'}</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-white p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1.5">
              <label className="text-sm font-bold font-body text-white">Nama Lapangan</label>
              <input 
                type="text" 
                name="nama"
                defaultValue={lapangan?.nama || ''}
                placeholder="Contoh: Lapangan A (Vinyl)"
                className="w-full bg-surface-darker text-white font-body text-sm px-4 py-3 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-disabled"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold font-body text-white">Deskripsi (Opsional)</label>
              <textarea 
                name="deskripsi"
                defaultValue={lapangan?.deskripsi || ''}
                placeholder="Fasilitas lapangan, tipe lantai, dll."
                rows={3}
                className="w-full bg-surface-darker text-white font-body text-sm px-4 py-3 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-disabled resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold font-body text-white">Harga per Jam (Rp)</label>
              <input 
                type="number" 
                name="harga_per_jam"
                defaultValue={lapangan?.harga_per_jam || ''}
                placeholder="50000"
                min="0"
                className="w-full bg-surface-darker text-white font-body text-sm px-4 py-3 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-disabled"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold font-body text-white">Jam Buka</label>
                <input 
                  type="time" 
                  name="jam_buka"
                  defaultValue={lapangan?.jam_buka?.slice(0, 5) || '08:00'}
                  className="w-full bg-surface-darker text-white font-body text-sm px-4 py-3 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold font-body text-white">Jam Tutup</label>
                <input 
                  type="time" 
                  name="jam_tutup"
                  defaultValue={lapangan?.jam_tutup?.slice(0, 5) || '22:00'}
                  className="w-full bg-surface-darker text-white font-body text-sm px-4 py-3 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold font-body text-white">URL Foto (Opsional)</label>
              <input 
                type="url" 
                name="foto_url"
                defaultValue={lapangan?.foto_url || ''}
                placeholder="https://example.com/foto.jpg"
                className="w-full bg-surface-darker text-white font-body text-sm px-4 py-3 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-disabled"
              />
              <p className="text-xs text-text-tertiary font-body mt-1">Gunakan link gambar publik sementara jika belum menggunakan Supabase Storage utuh.</p>
            </div>

            <div className="flex items-center space-x-3 bg-surface-darker p-4 rounded-xl border border-white/5">
              <input 
                type="checkbox" 
                name="status_aktif"
                id="status_aktif"
                defaultChecked={lapangan ? lapangan.status_aktif : true}
                className="w-5 h-5 rounded border-white/10 text-primary focus:ring-primary/20 focus:ring-offset-0 bg-surface-dark"
              />
              <label htmlFor="status_aktif" className="text-sm font-bold font-body text-white cursor-pointer select-none">
                Lapangan Aktif (Bisa disewa)
              </label>
            </div>

            <div className="pt-4 flex justify-end space-x-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-bold font-body text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold font-body transition-all flex items-center
                  ${loading 
                    ? 'bg-disabled text-white/50 cursor-not-allowed opacity-50' 
                    : 'bg-primary text-white hover:bg-primary-hover active:bg-primary-active'
                  }
                `}
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEdit ? 'Simpan Perubahan' : 'Tambah Lapangan'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

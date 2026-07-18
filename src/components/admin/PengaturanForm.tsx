'use client'

import { useState } from 'react';
import { updatePengaturan } from '@/lib/actions/pengaturan';
import { toast } from 'sonner';
import { Loader2, Save, CreditCard, MessageCircle, QrCode, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PengaturanFormProps {
  initialSettings: Record<string, string>;
}

export default function PengaturanForm({ initialSettings }: PengaturanFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const keys = ['nama_bank', 'no_rekening', 'atas_nama_rekening', 'qris_url', 'nomor_wa_admin', 'alamat_lokasi', 'embed_maps_url', 'jam_operasional', 'link_instagram', 'link_tiktok', 'link_facebook'];
    
    const settingsData: Record<string, string> = {};
    for (const key of keys) {
      const value = formData.get(key) as string;
      if (value !== null && value !== undefined) {
        settingsData[key] = value;
      }
    }
    
    const result = await updatePengaturan(settingsData);

    setLoading(false);

    if (result.success) {
      toast.success('Pengaturan berhasil disimpan');
      router.refresh();
    } else {
      toast.error('Gagal menyimpan pengaturan: ' + (result.error || 'Kesalahan sistem'));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-display text-white mb-2">Pengaturan</h1>
        <p className="text-sm font-body text-text-secondary">Konfigurasi rekening bank, QRIS, dan WhatsApp admin.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Rekening Bank Section */}
        <div className="bg-surface-dark rounded-2xl p-6 md:p-8 border border-white/5 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] space-y-6">
          <div className="flex items-center space-x-3 mb-2 border-b border-white/10 pb-4">
            <div className="bg-primary/20 p-2 rounded-lg text-primary">
              <CreditCard className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-display text-white">Rekening Bank</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold font-body text-white">Nama Bank</label>
              <input 
                type="text" 
                name="nama_bank"
                defaultValue={initialSettings['nama_bank'] || ''}
                placeholder="Contoh: BCA"
                className="w-full bg-surface-darker text-white font-body text-sm px-4 py-3 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-disabled"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold font-body text-white">Nomor Rekening</label>
              <input 
                type="text" 
                name="no_rekening"
                defaultValue={initialSettings['no_rekening'] || ''}
                placeholder="Contoh: 1234567890"
                className="w-full bg-surface-darker text-white font-body text-sm px-4 py-3 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-disabled"
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-bold font-body text-white">Atas Nama Rekening</label>
              <input 
                type="text" 
                name="atas_nama_rekening"
                defaultValue={initialSettings['atas_nama_rekening'] || ''}
                placeholder="Contoh: John Doe"
                className="w-full bg-surface-darker text-white font-body text-sm px-4 py-3 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-disabled"
              />
            </div>
          </div>
        </div>

        {/* QRIS Section */}
        <div className="bg-surface-dark rounded-2xl p-6 md:p-8 border border-white/5 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] space-y-6">
          <div className="flex items-center space-x-3 mb-2 border-b border-white/10 pb-4">
            <div className="bg-primary/20 p-2 rounded-lg text-primary">
              <QrCode className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-display text-white">QRIS Pembayaran</h2>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold font-body text-white">URL Gambar QRIS</label>
            <input 
              type="url" 
              name="qris_url"
              defaultValue={initialSettings['qris_url'] || ''}
              placeholder="https://example.com/qris.jpg"
              className="w-full bg-surface-darker text-white font-body text-sm px-4 py-3 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-disabled"
            />
            <p className="text-xs text-text-tertiary font-body mt-1">Masukkan link gambar QRIS publik. Akan ditampilkan di halaman instruksi pembayaran.</p>
          </div>
          
          {initialSettings['qris_url'] && (
            <div className="mt-4 p-4 bg-surface-darker rounded-xl border border-white/5 inline-block">
              <p className="text-xs text-text-secondary font-body mb-2">Pratinjau QRIS:</p>
              <img src={initialSettings['qris_url']} alt="QRIS Preview" className="max-w-[200px] h-auto rounded-lg" />
            </div>
          )}
        </div>

        {/* WhatsApp Admin Section */}
        <div className="bg-surface-dark rounded-2xl p-6 md:p-8 border border-white/5 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] space-y-6">
          <div className="flex items-center space-x-3 mb-2 border-b border-white/10 pb-4">
            <div className="bg-primary/20 p-2 rounded-lg text-primary">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-display text-white">Kontak Admin</h2>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold font-body text-white">Nomor WhatsApp Admin</label>
            <input 
              type="text" 
              name="nomor_wa_admin"
              defaultValue={initialSettings['nomor_wa_admin'] || ''}
              placeholder="Contoh: 6281234567890"
              className="w-full bg-surface-darker text-white font-body text-sm px-4 py-3 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-disabled"
            />
            <p className="text-xs text-text-tertiary font-body mt-1">Gunakan format 62 (contoh: 62812...). Ini digunakan untuk link 'Hubungi Admin'.</p>
          </div>
        </div>

        {/* Informasi Arena & Media Sosial Section */}
        <div className="bg-surface-dark rounded-2xl p-6 md:p-8 border border-white/5 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] space-y-6">
          <div className="flex items-center space-x-3 mb-2 border-b border-white/10 pb-4">
            <div className="bg-primary/20 p-2 rounded-lg text-primary">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-display text-white">Informasi Arena & Media Sosial</h2>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold font-body text-white">Alamat Lengkap Arena</label>
            <textarea 
              name="alamat_lokasi"
              defaultValue={initialSettings['alamat_lokasi'] || ''}
              placeholder="Contoh: Jl. Sudirman No. 123..."
              rows={3}
              className="w-full bg-surface-darker text-white font-body text-sm px-4 py-3 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-disabled resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold font-body text-white">URL Sematan Peta (Google Maps Embed Link)</label>
            <textarea 
              name="embed_maps_url"
              defaultValue={initialSettings['embed_maps_url'] || ''}
              placeholder="Contoh: https://www.google.com/maps/embed?pb=..."
              rows={3}
              className="w-full bg-surface-darker text-white font-body text-sm px-4 py-3 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-disabled resize-none"
            />
            <p className="text-xs text-text-tertiary font-body mt-1">Gunakan link embed src="..." dari Google Maps.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold font-body text-white">Teks Jam Operasional</label>
            <input 
              type="text" 
              name="jam_operasional"
              defaultValue={initialSettings['jam_operasional'] || ''}
              placeholder="Contoh: Senin - Minggu (08:00 - 23:00)"
              className="w-full bg-surface-darker text-white font-body text-sm px-4 py-3 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-disabled"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold font-body text-white">Tautan Instagram</label>
              <input 
                type="url" 
                name="link_instagram"
                defaultValue={initialSettings['link_instagram'] || ''}
                placeholder="https://instagram.com/..."
                className="w-full bg-surface-darker text-white font-body text-sm px-4 py-3 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-disabled"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold font-body text-white">Tautan TikTok</label>
              <input 
                type="url" 
                name="link_tiktok"
                defaultValue={initialSettings['link_tiktok'] || ''}
                placeholder="https://tiktok.com/@..."
                className="w-full bg-surface-darker text-white font-body text-sm px-4 py-3 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-disabled"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold font-body text-white">Tautan Facebook</label>
              <input 
                type="url" 
                name="link_facebook"
                defaultValue={initialSettings['link_facebook'] || ''}
                placeholder="https://facebook.com/..."
                className="w-full bg-surface-darker text-white font-body text-sm px-4 py-3 rounded-xl border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-disabled"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3.5 rounded-xl text-base font-bold font-body transition-all flex items-center
              ${loading 
                ? 'bg-disabled text-white/50 cursor-not-allowed opacity-50' 
                : 'bg-primary text-white hover:bg-primary-hover shadow-[0px_4px_12px_rgba(249,115,22,0.3)] active:bg-primary-active'
              }
            `}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            Simpan Pengaturan
          </button>
        </div>

      </form>
    </div>
  );
}

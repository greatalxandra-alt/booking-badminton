'use client';

import { useState, useEffect } from 'react';
import { Copy, AlertTriangle, Home, Search, CheckCircle2, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

interface CopyIdOverlayProps {
  bookingId: string;
}

export default function CopyIdOverlay({ bookingId }: CopyIdOverlayProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNew = searchParams.get('new') === 'true';
  
  const shortId = bookingId.split('-')[0].toUpperCase();

  useEffect(() => {
    if (!isNew || !isOpen) return;
    // Kunci scroll
    document.body.style.overflow = 'hidden';
    
    // Nonaktifkan tombol Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [isNew, isOpen]);

  if (!isNew || !isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortId);
      setIsCopied(true);
      toast.success('ID Booking berhasil disalin!');
    } catch (err) {
      toast.error('Gagal menyalin ID. Silakan salin manual.');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop (Strict: Tidak ada onClick handler) */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" />
      
      {/* Modal Content */}
      <div className="relative bg-surface-dark border border-white/10 rounded-2xl w-full max-w-lg p-8 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.8)] text-center animate-in zoom-in-95 duration-300">
        
        {!isCopied ? (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-error/20 text-error rounded-full mb-6 animate-pulse">
              <AlertTriangle className="w-10 h-10" />
            </div>
            
            <h2 className="text-2xl font-bold font-display text-white mb-4">PENTING!</h2>
            <p className="text-text-secondary font-body mb-8 leading-relaxed">
              Harap Salin <strong className="text-white">ID Booking</strong> Anda Terlebih Dahulu untuk Melacak Status Pesanan dan Melakukan Konfirmasi Pembayaran.
            </p>

            <div className="bg-surface-darker border border-white/10 p-6 rounded-xl mb-8">
              <span className="block text-xs font-body text-text-tertiary mb-2 uppercase tracking-widest">ID BOOKING ANDA</span>
              <span className="text-4xl font-bold font-display text-primary tracking-widest">{shortId}</span>
            </div>

            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center bg-primary hover:bg-primary-hover active:bg-primary-active text-white font-bold font-body py-4 rounded-xl transition-all shadow-[0px_4px_12px_rgba(249,115,22,0.3)] text-lg group"
            >
              <Copy className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Salin ID Booking
            </button>
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-success/20 text-success rounded-full mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <h2 className="text-2xl font-bold font-display text-white mb-4">ID Berhasil Disalin!</h2>
            <p className="text-text-secondary font-body mb-8">
              Pastikan Anda menyimpan ID <strong className="text-white">{shortId}</strong> ini. Anda bisa menggunakannya kapan saja di halaman Cek Booking.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => {
                  document.body.style.overflow = 'unset';
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center bg-secondary hover:bg-secondary-hover active:bg-secondary-active text-white font-bold font-body py-4 rounded-xl transition-all shadow-[0px_4px_12px_rgba(14,165,233,0.3)]"
              >
                <ChevronRight className="w-5 h-5 mr-2" />
                Lanjut ke Pembayaran & Upload Bukti
              </button>
              
              <button
                onClick={() => {
                  document.body.style.overflow = 'unset';
                  router.push('/');
                }}
                className="w-full flex items-center justify-center bg-surface-darker hover:bg-white/5 border border-white/10 text-white font-bold font-body py-4 rounded-xl transition-all"
              >
                <Home className="w-5 h-5 mr-2" />
                Kembali ke Beranda
              </button>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { CalendarClock, FileEdit, Copy, UploadCloud, Search, CheckCircle, MapPin, X } from 'lucide-react';

export default function WelcomeOverlay() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Cek apakah user sudah pernah melihat overlay ini di browsernya
    const hasSeen = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeen) {
      setIsOpen(true);
      // Mencegah scroll di background saat modal terbuka
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      window.addEventListener('keydown', handleKeyDown, { capture: true });
      return () => {
        window.removeEventListener('keydown', handleKeyDown, { capture: true });
      };
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
    document.body.style.overflow = 'unset';
  };

  if (!isOpen) return null;

  const steps = [
    { icon: CalendarClock, title: "1. Pilih Jadwal", desc: "Pilih Hari & Jam Sewa (bisa pilih banyak jam sekaligus)." },
    { icon: FileEdit, title: "2. Isi Data", desc: "Isi Data Diri Pemesan dengan benar." },
    { icon: Copy, title: "3. Salin ID (Penting!)", desc: "Transfer pembayaran & Salin ID Booking Anda." },
    { icon: UploadCloud, title: "4. Upload Bukti", desc: "Upload Bukti Transfer untuk Verifikasi Admin." },
    { icon: Search, title: "5. Pantau Status", desc: "Cek status booking menggunakan ID Booking." },
    { icon: CheckCircle, title: "6. Lunas", desc: "Status booking dinyatakan Lunas / Berhasil." },
    { icon: MapPin, title: "7. Datang & Main", desc: "Datang ke Lapangan dan selamat bersenang-senang!" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop (klik di luar dimatikan) */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />
      
      {/* Modal Content */}
      <div className="relative bg-surface-dark border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-surface-dark/95 backdrop-blur z-10 border-b border-white/10 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold font-display text-white">Panduan Booking</h2>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <p className="text-text-secondary font-body">
            Selamat datang! Ikuti 7 langkah mudah ini untuk menyewa lapangan di BadmintonSpace:
          </p>

          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex items-start space-x-4 bg-surface-darker p-4 rounded-xl border border-white/5">
                  <div className={`p-2 rounded-lg shrink-0 ${index === 2 ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`font-bold font-display text-lg mb-1 ${index === 2 ? 'text-primary' : 'text-white'}`}>
                      {step.title}
                    </h3>
                    <p className="text-sm font-body text-text-secondary leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-surface-dark/95 backdrop-blur border-t border-white/10 p-6">
          <button
            onClick={handleClose}
            className="w-full bg-primary hover:bg-primary-hover active:bg-primary-active text-white font-bold font-body py-4 rounded-xl transition-all shadow-[0px_4px_12px_rgba(249,115,22,0.3)]"
          >
            Mulai Booking
          </button>
        </div>

      </div>
    </div>
  );
}

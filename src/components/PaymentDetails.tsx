'use client';

import { Copy, Download, QrCode } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentDetailsProps {
  namaBank: string;
  noRekening: string;
  atasNama: string;
  qrisUrl: string | null;
}

export default function PaymentDetails({ namaBank, noRekening, atasNama, qrisUrl }: PaymentDetailsProps) {
  const handleCopyRekening = async () => {
    try {
      await navigator.clipboard.writeText(noRekening);
      toast.success('Nomor Rekening berhasil disalin');
    } catch (e) {
      toast.error('Gagal menyalin nomor rekening');
    }
  };

  return (
    <div className="bg-surface-darker border border-white/10 rounded-xl p-6 text-left">
      <h3 className="text-lg font-bold font-display text-white mb-4">
        Instruksi Pembayaran
      </h3>
      <p className="text-sm font-body text-text-secondary mb-4">
        Silakan lakukan transfer ke rekening berikut:
      </p>
      
      <div className="bg-black/50 rounded-lg p-4 mb-4 border border-white/5 relative">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-body text-text-secondary">Bank</span>
          <span className="font-bold font-display text-white">{namaBank}</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-body text-text-secondary">Nomor Rekening</span>
          <div className="flex items-center space-x-2">
            <span className="font-bold font-display text-white tracking-wider">{noRekening}</span>
            <button 
              onClick={handleCopyRekening}
              className="p-1.5 bg-surface-dark rounded-md text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
              title="Salin Nomor Rekening"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center border-t border-white/5 pt-3">
          <span className="text-sm font-body text-text-secondary">Atas Nama</span>
          <span className="font-bold font-body text-white uppercase">{atasNama}</span>
        </div>
      </div>

      {qrisUrl && (
        <div className="mt-6 border-t border-white/10 pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <QrCode className="w-5 h-5 text-primary" />
            <span className="font-bold font-display text-white">Pembayaran via QRIS</span>
          </div>
          <div className="bg-white p-2 rounded-xl inline-block mb-3 w-full max-w-[250px] mx-auto flex items-center justify-center">
            <img src={qrisUrl} alt="QRIS Code" className="w-full h-auto rounded-lg" />
          </div>
          <a
            href={qrisUrl}
            download="QRIS_Booking.jpg"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center bg-surface-dark border border-white/10 hover:bg-white/5 text-white text-sm font-bold font-body py-2.5 rounded-lg transition-all"
          >
            <Download className="w-4 h-4 mr-2" />
            Simpan QRIS
          </a>
        </div>
      )}

      <p className="text-xs font-body text-text-tertiary mt-6">
        Setelah transfer, harap unggah bukti pembayaran agar booking Anda dapat segera kami verifikasi.
      </p>
    </div>
  );
}

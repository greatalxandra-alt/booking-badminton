'use client'

import { useState } from 'react';
import SlotPicker from './SlotPicker';
import FormBooking from './FormBooking';

interface BookingWidgetProps {
  lapanganId: string;
  hargaPerJam: number;
  qrisUrl?: string;
}

export default function BookingWidget({ lapanganId, hargaPerJam, qrisUrl }: BookingWidgetProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
  };

  const duration = selectedSlots.length >= 2 ? selectedSlots.length - 1 : 0;
  const totalPrice = duration * hargaPerJam;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      {/* Left Column: Slot Picker */}
      <div className="lg:col-span-2">
        <div className="bg-surface-dark rounded-2xl p-6 md:p-8 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] border border-white/5">
          <SlotPicker 
            lapanganId={lapanganId} 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedSlots={selectedSlots}
            setSelectedSlots={setSelectedSlots}
          />
        </div>
      </div>

      {/* Right Column: Form Booking & Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-28 bg-surface-dark rounded-2xl p-6 md:p-8 shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] border border-white/5">
          <h3 className="text-2xl font-bold font-display text-white mb-6">Detail Pemesan</h3>
          
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/10">
            <span className="text-sm font-body text-text-secondary">Harga per jam</span>
            <span className="text-xl font-bold font-display text-primary">{formatRupiah(hargaPerJam)}</span>
          </div>

          {duration > 0 && (
            <div className="mb-6 p-5 rounded-xl bg-surface-darker border border-white/10">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-body text-text-secondary">Durasi Main</span>
                <span className="text-sm font-bold font-body text-white">{duration} Jam</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-white/5">
                <span className="text-sm font-body text-text-secondary">Total Biaya</span>
                <span className="text-2xl font-bold font-display text-success">{formatRupiah(totalPrice)}</span>
              </div>
            </div>
          )}
          
          <FormBooking 
            lapanganId={lapanganId} 
            selectedDate={selectedDate} 
            selectedSlots={selectedSlots} 
            hargaPerJam={hargaPerJam} 
            qrisUrl={qrisUrl}
          />
        </div>
      </div>
    </div>
  );
}

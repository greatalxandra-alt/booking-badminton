import { useEffect, useState } from "react";
import { getSlotKosong } from "@/lib/slot-engine";
import { SlotKosong } from "@/types";
import { Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SlotPickerProps {
  lapanganId: string;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedSlots: string[];
  setSelectedSlots: (slots: string[]) => void;
}

export default function SlotPicker({
  lapanganId,
  selectedDate,
  setSelectedDate,
  selectedSlots,
  setSelectedSlots,
}: SlotPickerProps) {
  const [slots, setSlots] = useState<SlotKosong[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State untuk mode multi-select range
  const [selectingStart, setSelectingStart] = useState<string | null>(null);

  // Get dates for next 14 days
  const getNextDays = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  };

  const dates = getNextDays();

  useEffect(() => {
    if (!selectedDate && dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  }, []);

  useEffect(() => {
    if (!selectedDate) return;

    async function fetchSlots() {
      setLoading(true);
      setError("");
      try {
        const data = await getSlotKosong(lapanganId, selectedDate);
        setSlots(data);
        // Clear selected slots when date changes
        setSelectedSlots([]);
        setSelectingStart(null);
      } catch (err: any) {
        setError("Gagal memuat jadwal. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    }

    fetchSlots();
  }, [selectedDate, lapanganId]);

  const toggleSlot = (jam: string) => {
    const clickedIndex = slots.findIndex((s) => s.jam === jam);
    if (clickedIndex === -1) return;

    // Jika belum ada yang dipilih (atau baru reset)
    if (!selectingStart) {
      // Mulai memilih
      setSelectedSlots([jam]);
      setSelectingStart(jam);
      return;
    }

    // Jika klik slot yang sama dengan slot awal (Batal pilih)
    if (selectingStart === jam) {
      setSelectedSlots([]);
      setSelectingStart(null);
      return;
    }

    // Jika sudah ada start slot, ini adalah klik kedua (end slot)
    const startIndex = slots.findIndex((s) => s.jam === selectingStart);

    const minIdx = Math.min(startIndex, clickedIndex);
    const maxIdx = Math.max(startIndex, clickedIndex);

    // Cek apakah ada slot yang tidak tersedia di dalam range
    const rangeSlots = slots.slice(minIdx, maxIdx + 1);
    const hasUnavailable = rangeSlots.some((s) => !s.tersedia);

    if (hasUnavailable) {
      toast.error(
        "Gagal: Terdapat jadwal yang sudah penuh di antara jam yang Anda pilih.",
      );
      // Reset seleksi karena tidak valid
      setSelectedSlots([]);
      setSelectingStart(null);
      return;
    }

    // Jika valid, pilih semua slot di range tersebut
    setSelectedSlots(rangeSlots.map((s) => s.jam));

    // Reset selectingStart agar klik berikutnya memulai range baru
    setSelectingStart(null);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(d);
  };

  return (
    <div className="space-y-8">
      {/* Date Selector */}
      <div>
        <label className="flex items-center text-sm font-bold font-body text-white mb-4">
          <Calendar className="w-5 h-5 mr-2 text-primary" />
          Pilih Tanggal
        </label>
        <div
          className="flex overflow-x-auto pb-4 gap-3 snap-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {dates.map((date) => (
            <button
              key={date}
              type="button"
              onClick={() => setSelectedDate(date)}
              className={`snap-start shrink-0 flex flex-col items-center justify-center px-5 py-4 rounded-xl min-w-[90px] transition-all border ${
                selectedDate === date
                  ? "bg-primary border-primary text-white shadow-[0px_10px_15px_-3px_rgba(249,115,22,0.3)]"
                  : "bg-surface-darker border-white/10 text-text-secondary hover:border-white/30 hover:text-white hover:bg-surface-darker"
              }`}
            >
              <span className="text-xs font-body font-medium uppercase mb-1">
                {formatDate(date).split(",")[0]}
              </span>
              <span className="text-xl font-bold font-display">
                {formatDate(date).split(",")[1].trim().split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-bold font-body text-white">
            Pilih Jam Mulai & Selesai
          </label>
          {selectingStart && (
            <span className="flex items-center gap-1.5 text-xs font-body text-white bg-primary/20 border border-primary/30 px-2.5 py-1 rounded-md">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
              <span>Pilih jam selesai...</span>
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-error text-sm font-body bg-error/10 rounded-xl border border-error/20">
            {error}
          </div>
        ) : slots.length === 0 ? (
          <div className="text-center py-8 text-text-secondary text-sm font-body bg-surface-darker rounded-xl border border-white/5">
            Tidak ada slot tersedia di tanggal ini.
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {slots.map((slot) => {
              const isSelected = selectedSlots.includes(slot.jam);
              const isSelectingStart = selectingStart === slot.jam;

              // Tentukan gaya tombol berdasarkan kondisinya
              let btnClass = "";
              if (!slot.tersedia) {
                btnClass =
                  "bg-surface-darker text-text-muted border border-white/5 cursor-not-allowed opacity-50";
              } else if (isSelectingStart) {
                btnClass =
                  "bg-primary text-white shadow-[0px_4px_12px_rgba(249,115,22,0.3)] border border-primary ring-2 ring-primary ring-offset-2 ring-offset-surface-dark";
              } else if (isSelected) {
                btnClass =
                  "bg-primary text-white shadow-[0px_4px_12px_rgba(249,115,22,0.3)] border border-primary";
              } else {
                btnClass =
                  "bg-surface-darker text-white border border-white/10 hover:border-primary hover:text-primary hover:bg-primary/5";
              }

              return (
                <button
                  key={slot.jam}
                  type="button"
                  disabled={!slot.tersedia}
                  onClick={() => toggleSlot(slot.jam)}
                  className={`flex items-center justify-center py-3 rounded-xl text-base font-bold font-body transition-all min-h-[48px] ${btnClass}`}
                >
                  {slot.jam}
                </button>
              );
            })}
          </div>
        )}

        {/* Reset Button (muncul kalau sudah ada yg dipilih dan bukan sedang selecting) */}
        {selectedSlots.length > 0 && !selectingStart && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setSelectedSlots([])}
              className="text-xs font-bold font-body text-text-secondary hover:text-white underline transition-colors"
            >
              Reset Pilihan
            </button>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center space-x-6 text-sm font-body text-text-secondary pt-2">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-[4px] bg-surface-darker border border-white/10"></div>
          <span>Tersedia</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-[4px] bg-primary"></div>
          <span className="text-white">Dipilih</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-[4px] bg-surface-darker border border-white/5 opacity-50"></div>
          <span>Penuh</span>
        </div>
      </div>
    </div>
  );
}

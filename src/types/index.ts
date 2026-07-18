export interface Lapangan {
  id: string;
  nama: string;
  deskripsi: string | null;
  harga_per_jam: number;
  jam_buka: string; // 'HH:mm:ss'
  jam_tutup: string; // 'HH:mm:ss'
  foto_url: string | null;
  status_aktif: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  lapangan_id: string;
  tanggal_main: string; // YYYY-MM-DD
  jam_mulai: string;
  jam_selesai: string;
  nama_pemesan: string;
  no_hp: string;
  catatan: string | null;
  bukti_pembayaran_url: string | null;
  status: 'pending' | 'lunas' | 'batal';
  created_at: string;
  lapangan?: Lapangan;
}

export interface Pengaturan {
  key: string;
  value: string;
  updated_at: string;
}

export interface SlotKosong {
  jam: string; // "08:00"
  tersedia: boolean;
}

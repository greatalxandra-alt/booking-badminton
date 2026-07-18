-- TABEL: lapangan
CREATE TABLE public.lapangan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    deskripsi TEXT,
    harga_per_jam INTEGER NOT NULL CHECK (harga_per_jam > 0),
    jam_buka TIME NOT NULL,
    jam_tutup TIME NOT NULL,
    foto_url TEXT,
    status_aktif BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- TABEL: booking
CREATE TABLE public.booking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lapangan_id UUID NOT NULL REFERENCES public.lapangan(id),
    tanggal_main DATE NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    nama_pemesan TEXT NOT NULL,
    no_hp TEXT NOT NULL,
    catatan TEXT,
    bukti_pembayaran_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'lunas', 'batal')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- INDEXES
CREATE INDEX idx_booking_lapangan_tanggal ON public.booking(lapangan_id, tanggal_main);
CREATE INDEX idx_booking_status ON public.booking(status);
CREATE INDEX idx_booking_tanggal ON public.booking(tanggal_main);

-- TABEL: pengaturan
CREATE TABLE public.pengaturan (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS (Row Level Security)
ALTER TABLE public.lapangan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengaturan ENABLE ROW LEVEL SECURITY;

-- Note: Policies need to be configured in Supabase Dashboard or here
-- Example policies:
CREATE POLICY "Lapangan public read" ON public.lapangan FOR SELECT USING (true);
CREATE POLICY "Booking anon insert" ON public.booking FOR INSERT WITH CHECK (true);
CREATE POLICY "Booking select own" ON public.booking FOR SELECT USING (true); -- User can query by ID in application logic
CREATE POLICY "Pengaturan public read" ON public.pengaturan FOR SELECT USING (true);

-- BUCKETS (Need to be created via API or UI)
-- insert into storage.buckets (id, name, public) values ('lapangan', 'lapangan', true);
-- insert into storage.buckets (id, name, public) values ('bukti-bayar', 'bukti-bayar', false);

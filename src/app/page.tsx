import { getLapanganAktif } from "@/lib/actions/lapangan";
import { getSemuaPengaturan } from "@/lib/actions/pengaturan";
import { getSemuaGaleri } from "@/lib/actions/galeri";
import LapanganCard from "@/components/LapanganCard";
import {
  Snowflake,
  Layers,
  ParkingCircle,
  Wifi,
  Utensils,
  ShieldCheck,
  MapPin,
  Clock,
  MessageCircle,
  Activity,
  ArrowRight,
  Link2,
} from "lucide-react"; // KATA INSTAGRAM & FACEBOOK SUDAH BERSIH DARI SINI!

// Komponen SVG lokal sebagai pengganti agar tidak error di Turbopack
const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export const dynamic = "force-dynamic";

export default async function Home() {
  const lapangans = await getLapanganAktif();
  const settings = await getSemuaPengaturan();
  const galeriList = await getSemuaGaleri();

  const alamat = settings["alamat_lokasi"];
  const mapUrl = settings["embed_maps_url"];
  const jamOperasional = settings["jam_operasional"];
  const ig = settings["link_instagram"];
  const tiktok = settings["link_tiktok"];
  const fb = settings["link_facebook"];
  const wa = settings["nomor_wa_admin"];

  return (
    <main className="scroll-smooth min-h-screen bg-surface-darker flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-black/95 py-0 px-6 sm:px-8 lg:px-12 sticky top-0 z-50 h-20 flex items-center shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]">
        <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary text-white p-1.5 rounded-lg">
              <Activity className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold font-display text-white leading-tight">
                BadmintonSpace
              </span>
              <span className="text-xs font-body text-primary leading-none">
                Sports Arena
              </span>
            </div>
          </div>

          {/* Center Navigation (Desktop Only) */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#fasilitas" className="text-sm font-medium font-body text-text-secondary hover:text-white transition-colors duration-200">
              Fasilitas
            </a>
            <a href="#lapangan" className="text-sm font-medium font-body text-text-secondary hover:text-white transition-colors duration-200">
              Lapangan
            </a>
            <a href="#galeri" className="text-sm font-medium font-body text-text-secondary hover:text-white transition-colors duration-200">
              Galeri
            </a>
            <a href="#kontak" className="text-sm font-medium font-body text-text-secondary hover:text-white transition-colors duration-200">
              Lokasi & Kontak
            </a>
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="/cek-booking"
              className="text-sm font-medium font-body text-text-secondary hover:text-white transition-colors"
            >
              Cek Status Booking
            </a>
            <a
              href="/admin/login"
              className="text-sm font-medium font-body text-border-light hover:text-primary transition-colors"
            >
              Admin Login
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-20 overflow-hidden bg-surface-darker">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] h-full">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px] opacity-60"></div>
            <div className="absolute top-32 -left-32 w-72 h-72 bg-secondary/10 rounded-full blur-[100px] opacity-60"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center space-x-2 py-2 px-4 rounded-lg bg-transparent text-primary text-sm font-medium font-body tracking-wide mb-6 border border-white/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span>Platform Booking #1 di Kotamu</span>
          </div>

          <h1 className="text-5xl md:text-[72px] font-normal font-display text-white tracking-normal leading-[1] mb-6">
            Booking Lapangan Badminton <br className="hidden md:block" />
            <span className="text-primary">Mudah, Tanpa Ribet</span>
          </h1>

          <p className="text-sm md:text-base font-body font-normal text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
            Tidak perlu lagi repot antri atau telepon. Cek ketersediaan jadwal
            secara real-time dan pesan lapangan favoritmu dalam hitungan detik.
          </p>

          <div className="flex items-center justify-center">
            <a
              href="#lapangan"
              className="inline-flex items-center justify-center px-7 py-3 text-sm font-bold font-body text-white bg-primary rounded-xl hover:bg-primary-hover hover:shadow-[0px_4px_12px_rgba(249,115,22,0.3)] active:bg-primary-active transition-all h-11 min-w-[44px]"
            >
              Pilih Lapangan
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Building Amenities Section */}
      <section id="fasilitas" className="scroll-mt-24 px-4 md:px-6 py-16 lg:px-12 max-w-[1440px] mx-auto w-full relative z-10 border-t border-white/5 bg-surface-darker">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <div className="inline-flex items-center justify-center py-1.5 px-3 rounded-md bg-primary/10 text-primary text-xs font-bold font-body uppercase tracking-wider mb-4 border border-primary/20">
            Building Amenities
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
            Fasilitas Pendukung
          </h2>
          <p className="text-sm md:text-base font-body text-text-secondary max-w-2xl mx-auto">
            Kenyamanan Anda adalah prioritas kami. Nikmati berbagai fasilitas
            premium yang telah kami siapkan khusus untuk Anda selama berada di
            arena.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Item 1 */}
          <div className="group bg-surface-dark border border-white/5 hover:border-primary/30 rounded-2xl p-6 md:p-8 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-all duration-500 group-hover:scale-150"></div>
            <div className="w-14 h-14 rounded-xl bg-surface-darker flex items-center justify-center mb-5 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300 relative z-10">
              <Snowflake className="w-7 h-7 text-text-tertiary group-hover:text-primary transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-bold font-display text-white mb-2 group-hover:text-primary transition-colors duration-300 relative z-10">
              AC & Sirkulasi Segar
            </h3>
            <p className="text-sm font-body text-text-secondary relative z-10">
              Sirkulasi udara optimal yang menjaga arena tetap sejuk dan tidak
              pengap saat bermain.
            </p>
          </div>

          {/* Item 2 */}
          <div className="group bg-surface-dark border border-white/5 hover:border-primary/30 rounded-2xl p-6 md:p-8 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-all duration-500 group-hover:scale-150"></div>
            <div className="w-14 h-14 rounded-xl bg-surface-darker flex items-center justify-center mb-5 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300 relative z-10">
              <Layers className="w-7 h-7 text-text-tertiary group-hover:text-primary transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-bold font-display text-white mb-2 group-hover:text-primary transition-colors duration-300 relative z-10">
              Kualitas Lapangan Premium
            </h3>
            <p className="text-sm font-body text-text-secondary relative z-10">
              Lantai karpet standar BWF yang nyaman, anti slip, dan
              meminimalisir risiko cedera.
            </p>
          </div>

          {/* Item 3 */}
          <div className="group bg-surface-dark border border-white/5 hover:border-primary/30 rounded-2xl p-6 md:p-8 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-all duration-500 group-hover:scale-150"></div>
            <div className="w-14 h-14 rounded-xl bg-surface-darker flex items-center justify-center mb-5 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300 relative z-10">
              <ParkingCircle className="w-7 h-7 text-text-tertiary group-hover:text-primary transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-bold font-display text-white mb-2 group-hover:text-primary transition-colors duration-300 relative z-10">
              Parkir Luas & Aman
            </h3>
            <p className="text-sm font-body text-text-secondary relative z-10">
              Area parkir yang memadai untuk motor maupun mobil, dilengkapi
              pengawasan keamanan.
            </p>
          </div>

          {/* Item 4 */}
          <div className="group bg-surface-dark border border-white/5 hover:border-primary/30 rounded-2xl p-6 md:p-8 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-all duration-500 group-hover:scale-150"></div>
            <div className="w-14 h-14 rounded-xl bg-surface-darker flex items-center justify-center mb-5 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300 relative z-10">
              <Wifi className="w-7 h-7 text-text-tertiary group-hover:text-primary transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-bold font-display text-white mb-2 group-hover:text-primary transition-colors duration-300 relative z-10">
              Free Wi-Fi
            </h3>
            <p className="text-sm font-body text-text-secondary relative z-10">
              Akses internet berkecepatan tinggi secara gratis untuk tetap
              terhubung selama di area.
            </p>
          </div>

          {/* Item 5 */}
          <div className="group bg-surface-dark border border-white/5 hover:border-primary/30 rounded-2xl p-6 md:p-8 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-all duration-500 group-hover:scale-150"></div>
            <div className="w-14 h-14 rounded-xl bg-surface-darker flex items-center justify-center mb-5 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300 relative z-10">
              <Utensils className="w-7 h-7 text-text-tertiary group-hover:text-primary transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-bold font-display text-white mb-2 group-hover:text-primary transition-colors duration-300 relative z-10">
              Kantin & Rest Area
            </h3>
            <p className="text-sm font-body text-text-secondary relative z-10">
              Tersedia tempat makan dan bersantai yang menyajikan berbagai
              makanan dan minuman.
            </p>
          </div>

          {/* Item 6 */}
          <div className="group bg-surface-dark border border-white/5 hover:border-primary/30 rounded-2xl p-6 md:p-8 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-16 -mt-16 transition-all duration-500 group-hover:scale-150"></div>
            <div className="w-14 h-14 rounded-xl bg-surface-darker flex items-center justify-center mb-5 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300 relative z-10">
              <ShieldCheck className="w-7 h-7 text-text-tertiary group-hover:text-primary transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-bold font-display text-white mb-2 group-hover:text-primary transition-colors duration-300 relative z-10">
              Fasilitas Bersih
            </h3>
            <p className="text-sm font-body text-text-secondary relative z-10">
              Kamar ganti dan toilet pria/wanita yang selalu dijaga
              kebersihannya dengan maksimal.
            </p>
          </div>
        </div>
      </section>

      {/* Grid Lapangan Section */}
      <section
        id="lapangan"
        className="scroll-mt-24 flex-1 py-16 lg:py-24 max-w-[1200px] mx-auto w-full px-4 md:px-6"
      >
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <div className="inline-block px-3 py-1.5 text-xs font-bold tracking-wider text-primary bg-primary/10 rounded-md uppercase font-body border border-primary/20 mb-4">
            OUR VENUES
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
            Daftar Lapangan
          </h2>
          <p className="text-sm md:text-base font-body text-text-secondary max-w-2xl mx-auto">
            Pilih lapangan yang tersedia sesuai dengan jadwalmu. Nikmati
            pengalaman bermain yang tak terlupakan di arena terbaik.
          </p>
        </div>

        {lapangans.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lapangans.map((lapangan) => (
              <LapanganCard key={lapangan.id} lapangan={lapangan} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-24 bg-surface-dark rounded-2xl border border-white/10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-darker text-text-tertiary mb-4 border border-white/10">
              <Activity className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white mb-2">
              Belum ada lapangan
            </h3>
            <p className="text-sm font-body text-text-secondary max-w-md">
              Saat ini belum ada data lapangan yang tersedia untuk disewa.
              Silakan cek kembali nanti atau hubungi admin.
            </p>
          </div>
        )}
      </section>

      {/* Gallery Section */}
      {galeriList && galeriList.length > 0 && (
        <section id="galeri" className="scroll-mt-24 py-16 lg:py-24 max-w-[1200px] mx-auto w-full px-4 md:px-6 relative z-10 border-t border-white/5">
          <div className="flex flex-col items-center justify-center text-center mb-12">
            <div className="inline-block px-3 py-1.5 text-xs font-bold tracking-wider text-primary bg-primary/10 rounded-md uppercase font-body border border-primary/20 mb-4">
              OUR GALLERY
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
              Galeri Kami
            </h2>
            <p className="text-sm md:text-base font-body text-text-secondary max-w-2xl mx-auto">
              Lihat berbagai momen dan fasilitas terbaik yang ada di arena kami.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galeriList.map((foto) => (
              <div
                key={foto.id}
                className="group relative bg-surface-darker border border-white/10 rounded-xl overflow-hidden aspect-square"
              >
                <img
                  src={foto.foto_url}
                  alt={foto.caption || "Galeri Arena"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                />
                
                {foto.caption && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <p className="text-white text-sm font-body font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {foto.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact & Location Section */}
      <section id="kontak" className="scroll-mt-24 px-4 md:px-6 py-16 lg:px-12 max-w-[1200px] mx-auto w-full relative z-10 border-t border-white/5">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <div className="inline-block px-3 py-1.5 text-xs font-bold tracking-wider text-primary bg-primary/10 rounded-md uppercase font-body border border-primary/20 mb-4">
            CONTACT & LOCATION
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
            Kunjungi Arena Kami
          </h2>
          <p className="text-sm md:text-base font-body text-text-secondary max-w-2xl mx-auto">
            Temukan lokasi kami dengan mudah atau hubungi kami untuk informasi
            lebih lanjut mengenai penyewaan dan kerja sama.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Informasi & Sosmed */}
          <div className="space-y-6">
            {/* Alamat & Jam */}
            <div className="group bg-surface-dark border border-white/5 hover:border-primary/30 rounded-2xl p-6 md:p-8 transition-all duration-300">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-surface-darker flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                  <MapPin className="w-6 h-6 text-text-tertiary group-hover:text-primary transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-white mb-2 group-hover:text-primary transition-colors duration-300">
                    Lokasi Arena
                  </h3>
                  <p className="text-sm font-body text-text-secondary leading-relaxed">
                    {alamat || "Alamat belum diatur"}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 pt-6 border-t border-white/5">
                <div className="w-12 h-12 rounded-xl bg-surface-darker flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                  <Clock className="w-6 h-6 text-text-tertiary group-hover:text-primary transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-white mb-2 group-hover:text-primary transition-colors duration-300">
                    Jam Operasional
                  </h3>
                  <p className="text-sm font-body text-text-secondary leading-relaxed">
                    {jamOperasional || "Jam operasional belum diatur"}
                  </p>
                </div>
              </div>
            </div>

            {/* Hubungi Kami / Sosmed */}
            <div className="group bg-surface-dark border border-white/5 hover:border-primary/30 rounded-2xl p-6 md:p-8 transition-all duration-300">
              <h3 className="text-lg font-bold font-display text-white mb-6 group-hover:text-primary transition-colors duration-300">
                Terhubung Dengan Kami
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {wa && (
                  <a
                    href={`https://wa.me/${wa}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-3 p-4 rounded-xl bg-surface-darker border border-white/5 hover:border-success/30 hover:bg-success/10 transition-all duration-300 col-span-2"
                  >
                    <MessageCircle className="w-6 h-6 text-success" />
                    <div>
                      <p className="text-sm font-bold font-body text-white">
                        WhatsApp Admin
                      </p>
                      <p className="text-xs font-body text-text-secondary">
                        +{wa}
                      </p>
                    </div>
                  </a>
                )}

                {ig && (
                  <a
                    href={ig}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-3 p-4 rounded-xl bg-surface-darker border border-white/5 hover:border-pink-500/30 hover:bg-pink-500/10 transition-all duration-300"
                  >
                    <Instagram className="w-5 h-5 text-pink-500" />
                    <span className="text-sm font-bold font-body text-white">
                      Instagram
                    </span>
                  </a>
                )}

                {tiktok && (
                  <a
                    href={tiktok}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-3 p-4 rounded-xl bg-surface-darker border border-white/5 hover:border-white/30 hover:bg-white/10 transition-all duration-300"
                  >
                    <Link2 className="w-5 h-5 text-white" />
                    <span className="text-sm font-bold font-body text-white">
                      TikTok
                    </span>
                  </a>
                )}

                {fb && (
                  <a
                    href={fb}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-3 p-4 rounded-xl bg-surface-darker border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/10 transition-all duration-300"
                  >
                    <Facebook className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-bold font-body text-white">
                      Facebook
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Maps Iframe */}
          <div className="bg-surface-dark border border-white/5 hover:border-primary/30 rounded-2xl p-2 transition-all duration-300 h-[400px] lg:h-auto min-h-[400px]">
            {mapUrl ? (
              <iframe
                src={mapUrl}
                className="w-full h-full rounded-xl"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-surface-darker rounded-xl border border-white/5 text-text-tertiary">
                <MapPin className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-sm font-body">Peta belum dikonfigurasi</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-dark border-t border-white/10 py-8 text-center text-text-secondary text-sm font-body mt-auto">
        <p>
          &copy; {new Date().getFullYear()} BadmintonSpace. Dibuat untuk
          kenyamanan bermainmu.
        </p>
      </footer>
    </main>
  );
}

import { getSemuaGaleri } from "@/lib/actions/galeri";
import GaleriClient from "@/components/admin/GaleriClient";

export const dynamic = "force-dynamic";

export default async function GaleriPage() {
  // Ambil data langsung secara aman di server
  const dataGaleri = await getSemuaGaleri();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Manajemen Galeri</h1>
      {/* Kirim data galeri sebagai props ke Client Component */}
      <GaleriClient initialData={dataGaleri} />
    </div>
  );
}

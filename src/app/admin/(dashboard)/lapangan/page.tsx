import { getAllLapangan } from '@/lib/actions/lapangan';
import LapanganTable from '@/components/admin/LapanganTable';

export const dynamic = 'force-dynamic';

export default async function AdminLapanganPage() {
  const lapangans = await getAllLapangan();

  return (
    <LapanganTable initialLapangans={lapangans} />
  );
}

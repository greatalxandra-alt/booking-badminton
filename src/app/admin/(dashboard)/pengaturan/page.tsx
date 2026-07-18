import { getSemuaPengaturan } from '@/lib/actions/pengaturan';
import PengaturanForm from '@/components/admin/PengaturanForm';

export const dynamic = 'force-dynamic';

export default async function AdminPengaturanPage() {
  const settings = await getSemuaPengaturan();

  return (
    <PengaturanForm initialSettings={settings} />
  );
}

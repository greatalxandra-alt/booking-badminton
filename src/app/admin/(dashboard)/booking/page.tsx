import { getAdminBookings } from '@/lib/actions/booking';
import BookingTable from '@/components/admin/BookingTable';

export const dynamic = 'force-dynamic';

export default async function AdminBookingPage() {
  const bookings = await getAdminBookings();

  return (
    <BookingTable initialBookings={bookings} />
  );
}

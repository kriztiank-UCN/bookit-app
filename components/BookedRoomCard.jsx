import Link from "next/link";
import CancelBookingButton from "./CancelBookingButton";

const BookedRoomCard = ({ booking }) => {
  const { room_id: room } = booking;

  // Simple date formatting function for server-side rendering
  const formatDate = (dateString, timezone = "UTC") => {
    const date = new Date(dateString);

    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24-hour format
      timeZone: timezone,
      timeZoneName: "short",
    };

    return date.toLocaleString("en-US", options);
  };

  // Use the booking's stored timezone or fall back to UTC for server-side
  const userTimezone = booking.user_timezone || "UTC";

  return (
    <div className='bg-white shadow rounded-lg p-4 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center'>
      <div>
        <h4 className='text-lg font-semibold'>{room.name}</h4>
        <p className='text-sm text-gray-600'>
          <strong>Check In:</strong> {formatDate(booking.check_in, userTimezone)}
        </p>
        <p className='text-sm text-gray-600'>
          <strong>Check Out:</strong> {formatDate(booking.check_out, userTimezone)}
        </p>
      </div>
      <div className='flex flex-col sm:flex-row w-full sm:w-auto sm:space-x-2 mt-2 sm:mt-0'>
        <Link
          href={`/rooms/${room.$id}`}
          className='bg-blue-500 text-white px-4 py-2 rounded mb-2 sm:mb-0 w-full sm:w-auto text-center hover:bg-blue-700'
        >
          View Room
        </Link>
        <Link
          href={`/bookings/edit/${booking.$id}`}
          className='bg-yellow-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center hover:bg-yellow-700'
        >
          Edit Booking
        </Link>
        <CancelBookingButton bookingId={booking.$id} />
      </div>
    </div>
  );
};

export default BookedRoomCard;

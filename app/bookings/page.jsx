import Heading from "@/components/Heading";
import getMyBookings from "../actions/getMyBookings";

const BookingsPage = async () => {
  const bookings = await getMyBookings();

  return (
    <>
      <Heading title='My Bookings' />
      {bookings.length === 0 ? (
        <p className='text-gray-600 mt-4'>You have no bookings</p>
      ) : (
        bookings.map(booking => <h3 key={booking.$id}>{booking.room_id.name} </h3>)
      )}
    </>
  );
};

export default BookingsPage;

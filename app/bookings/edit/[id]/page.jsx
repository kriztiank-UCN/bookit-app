"use client";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Heading from "@/components/Heading";
import editBooking from "@/app/actions/editBooking";
import getBookingById from "@/app/actions/getBookingById";

export default function EditBookingPage({ params }) {
  const [state, formAction] = useFormState(editBooking, {});
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const bookingRes = await getBookingById(params.id);
      setBooking(bookingRes);
      setLoading(false);
    }
    fetchData();
  }, [params.id]);

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) {
      toast.success("Booking updated successfully!");
      router.push("/bookings");
    }
  }, [state, router]);

  if (loading) return <p>Loading...</p>;
  if (!booking) return <p>Booking not found or unauthorized</p>;

  return (
    <>
      <Heading title='Edit Booking' />
      <div className='bg-white shadow-lg rounded-lg p-6 w-full'>
        <form action={formAction}>
          <input type='hidden' name='bookingId' value={booking.$id} />
          <div className='mb-4'>
            <label htmlFor='check_in' className='block text-gray-700 font-bold mb-2'>
              Check In
            </label>
            <input
              type='datetime-local'
              id='check_in'
              name='check_in'
              defaultValue={booking.check_in.slice(0, 16)}
              className='border rounded w-full py-2 px-3'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='check_out' className='block text-gray-700 font-bold mb-2'>
              Check Out
            </label>
            <input
              type='datetime-local'
              id='check_out'
              name='check_out'
              defaultValue={booking.check_out.slice(0, 16)}
              className='border rounded w-full py-2 px-3'
              required
            />
          </div>
          <div className='flex flex-col gap-5'>
            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

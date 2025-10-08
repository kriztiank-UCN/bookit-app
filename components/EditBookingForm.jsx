"use client";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import editBooking from "@/app/actions/editBooking";

const EditBookingForm = ({ booking }) => {
  const [state, formAction] = useFormState(editBooking, {});
  const router = useRouter();

  if (!booking) return null;

  return (
    <form
      action={formData => {
        formAction(formData);
        if (state.error) toast.error(state.error);
        if (state.success) {
          toast.success("Booking updated!");
          router.refresh();
        }
      }}
      className='space-y-4'
    >
      <input type='hidden' name='bookingId' value={booking.$id} />
      <div>
        <label className='block font-medium'>Check In</label>
        <input
          type='datetime-local'
          name='check_in'
          defaultValue={booking.check_in.slice(0, 16)}
          className='border rounded px-2 py-1 w-full'
          required
        />
      </div>
      <div>
        <label className='block font-medium'>Check Out</label>
        <input
          type='datetime-local'
          name='check_out'
          defaultValue={booking.check_out.slice(0, 16)}
          className='border rounded px-2 py-1 w-full'
          required
        />
      </div>
      <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'>
        Save Changes
      </button>
    </form>
  );
};

export default EditBookingForm;

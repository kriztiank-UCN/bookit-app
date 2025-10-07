"use client";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Heading from "@/components/Heading";
import editRoom from "@/app/actions/editRoom";
import checkAdmin from "@/app/actions/checkAdmin";
import getRoomById from "@/app/actions/getRoomById";

export default function EditRoomPage({ params }) {
  const [state, formAction] = useFormState(editRoom, {});
  const router = useRouter();
  const [room, setRoom] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const adminRes = await checkAdmin();
      setIsAdmin(adminRes.isAdmin);

      if (adminRes.isAdmin) {
        const roomRes = await getRoomById(params.id);
        setRoom(roomRes);
      }
      setLoading(false);
    }
    fetchData();
  }, [params.id]);

  useEffect(() => {
    if (state.error) toast.error(state.error);
    if (state.success) {
      toast.success("Room updated successfully!");
      router.push("/rooms/my");
    }
  }, [state, router]);

  if (loading) return <p>Loading...</p>;
  if (!isAdmin) return <p>Unauthorized</p>;
  if (!room) return <p>Room not found</p>;

  return (
    <>
      <Heading title='Edit Room' />
      <div className='bg-white shadow-lg rounded-lg p-6 w-full'>
        <form action={formAction}>
          <input type='hidden' name='roomId' value={room.$id} />
          {/* fallback to the existing image */}
          <input type='hidden' name='existingImage' value={room.image || ""} />
          {/* fields prefilled with room data */}
          <div className='mb-4'>
            <label htmlFor='name' className='block text-gray-700 font-bold mb-2'>
              Room Name
            </label>
            <input
              type='text'
              id='name'
              name='name'
              defaultValue={room.name}
              className='border rounded w-full py-2 px-3'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='description' className='block text-gray-700 font-bold mb-2'>
              Description
            </label>
            <textarea
              id='description'
              name='description'
              defaultValue={room.description}
              className='border rounded w-full h-24 py-2 px-3'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='sqft' className='block text-gray-700 font-bold mb-2'>
              Square Feet
            </label>
            <input
              type='number'
              id='sqft'
              name='sqft'
              defaultValue={room.sqft}
              className='border rounded w-full py-2 px-3'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='capacity' className='block text-gray-700 font-bold mb-2'>
              Capacity
            </label>
            <input
              type='number'
              id='capacity'
              name='capacity'
              defaultValue={room.capacity}
              className='border rounded w-full py-2 px-3'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='price_per_hour' className='block text-gray-700 font-bold mb-2'>
              Price Per Hour
            </label>
            <input
              type='number'
              id='price_per_hour'
              name='price_per_hour'
              defaultValue={room.price_per_hour}
              className='border rounded w-full py-2 px-3'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='address' className='block text-gray-700 font-bold mb-2'>
              Address
            </label>
            <input
              type='text'
              id='address'
              name='address'
              defaultValue={room.address}
              className='border rounded w-full py-2 px-3'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='location' className='block text-gray-700 font-bold mb-2'>
              Location
            </label>
            <input
              type='text'
              id='location'
              name='location'
              defaultValue={room.location}
              className='border rounded w-full py-2 px-3'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='availability' className='block text-gray-700 font-bold mb-2'>
              Availability
            </label>
            <input
              type='text'
              id='availability'
              name='availability'
              defaultValue={room.availability}
              className='border rounded w-full py-2 px-3'
              required
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='amenities' className='block text-gray-700 font-bold mb-2'>
              Amenities
            </label>
            <input
              type='text'
              id='amenities'
              name='amenities'
              defaultValue={room.amenities}
              className='border rounded w-full py-2 px-3'
              required
            />
          </div>
          {/* Image upload logic can be added here */}
          {/* Image Upload */}
          <div className='mb-8'>
            <label htmlFor='image' className='block text-gray-700 font-bold mb-2'>
              Image
            </label>

            <input
              type='file'
              id='image'
              name='image'
              className='border rounded w-full py-2 px-3'
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

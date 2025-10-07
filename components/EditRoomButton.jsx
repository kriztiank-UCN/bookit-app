"use client";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";

export default function EditRoomButton({ roomId }) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/rooms/edit/${roomId}`);
  };

  return (
    <button
      onClick={handleEdit}
      className='bg-yellow-500 text-white text-sm px-4 py-2 rounded mb-2 sm:mb-0 w-full sm:w-auto text-center hover:bg-yellow-600'
      aria-label='Edit Room'
    >
      <FaEdit className='inline mr-1 text-base align-middle' /> Edit
    </button>
  );
}

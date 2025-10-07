"use server";
import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import checkAuth from "./checkAuth";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS;

export default async function getBookingById(bookingId) {
  const auth = await checkAuth();
  if (!auth.isAuthenticated) return null;

  const sessionCookie = cookies().get("appwrite-session");
  const { databases } = await createSessionClient(sessionCookie.value);

  const booking = await databases.getDocument(DATABASE_ID, COLLECTION_ID, bookingId);
  if (booking.user_id !== auth.user.id) return null;

  return booking;
}

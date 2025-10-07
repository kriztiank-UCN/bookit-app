"use server";
import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import checkAuth from "./checkAuth";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS;

export default async function editBooking(_prevState, formData) {
  try {
    // Check authentication
    const auth = await checkAuth();
    if (!auth.isAuthenticated) {
      return { error: "Not authenticated" };
    }

    const sessionCookie = cookies().get("appwrite-session");
    const { databases } = await createSessionClient(sessionCookie.value);

    const bookingId = formData.get("bookingId");
    const check_in = formData.get("check_in");
    const check_out = formData.get("check_out");

    // Fetch booking to check ownership
    const booking = await databases.getDocument(DATABASE_ID, COLLECTION_ID, bookingId);
    if (booking.user_id !== auth.user.id) {
      return { error: "Unauthorized" };
    }

    await databases.updateDocument(DATABASE_ID, COLLECTION_ID, bookingId, {
      check_in,
      check_out,
    });

    revalidatePath("/bookings", "layout");

    return { success: true };
  } catch (error) {
    return { error: error.message || "Failed to edit booking" };
  }
}

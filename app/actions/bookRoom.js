"use server";

import { createSessionClient } from "@/config/appwrite";
import { createAdminClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { ID } from "node-appwrite";
import { redirect } from "next/navigation";
import checkAuth from "./checkAuth";
import { revalidatePath } from "next/cache";
import checkRoomAvailability from "./checkRoomAvailability";

export const bookRoom = async (_, formData) => {
  const sessionCookie = cookies().get("appwrite-session");
  if (!sessionCookie) {
    redirect("/login");
  }

  try {
    const { databases } = await createSessionClient(sessionCookie.value);

    // Get user's ID
    const { user } = await checkAuth();

    if (!user) {
      return {
        error: "You must be logged in to book a room",
      };
    }

    // Extract date and time from the formData
    const checkInDate = formData.get("check_in_date");
    const checkInTime = formData.get("check_in_time");
    const checkOutDate = formData.get("check_out_date");
    const checkOutTime = formData.get("check_out_time");
    const roomId = formData.get("room_id");

    // Combine date and time to ISO 8601 format
    const checkInDateTime = `${checkInDate}T${checkInTime}`;
    const checkOutDateTime = `${checkOutDate}T${checkOutTime}`;

    // Check if room is available
    const isAvailable = await checkRoomAvailability(roomId, checkInDateTime, checkOutDateTime);

    if (!isAvailable) {
      return {
        error: "This room is already booked for the selected time",
      };
    }

    const bookingData = {
      check_in: checkInDateTime,
      check_out: checkOutDateTime,
      user_id: user.id,
      room_id: roomId,
    };

    // Create booking
    await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
      ID.unique(),
      bookingData
    );

    // USE SEND EMAIL NOTIFICATION
    const emailMessage = `Greetings from Bookit. Your booking has been confirmed. Check-in: ${checkInDateTime}, Check-out: ${checkOutDateTime}`;

    await sendEmailNotification(user.id, emailMessage);

    // Revalidate cache
    revalidatePath("/bookings", "layout");

    return {
      success: true,
    };
  } catch (error) {
    console.log("Failed to book room", error);
    return {
      error: "Something went wrong booking the room",
    };
  }
};

// SEND EMAIL NOTIFICATION
export const sendEmailNotification = async (userId, content) => {
  // Get messaging instance
  const { messaging } = await createAdminClient();
  try {
    // https://appwrite.io/docs/references/1.5.x/server-nodejs/messaging#createEmail
    const message = await messaging.createEmail(
      ID.unique(), // messageId
      "Notification", // subject
      content, // content
      [], // topics (optional)
      [userId] // Recipients
    );
    return message;
  } catch (error) {
    console.error("An error occurred while sending email:", error);
  }
};

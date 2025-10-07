"use server";
import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS;

export default async function getRoomById(roomId) {
  try {
    const sessionCookie = cookies().get("appwrite-session");
    if (!sessionCookie) {
      console.log("No session cookie found");
      return null;
    }
    const { databases } = await createSessionClient(sessionCookie.value);
    const room = await databases.getDocument(DATABASE_ID, COLLECTION_ID, roomId);
    if (!room) {
      console.log("Room not found for ID:", roomId);
    }
    return room;
  } catch (error) {
    console.log("Error fetching room:", error);
    return null;
  }
}

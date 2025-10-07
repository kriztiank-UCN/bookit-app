"use server";
import { createSessionClient, createAdminClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ID } from "node-appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS;
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS;

async function editRoom(_prevState, formData) {
  try {
    const sessionCookie = cookies().get("appwrite-session");
    if (!sessionCookie) {
      return { error: "Not authenticated" };
    }
    const { account, databases } = await createSessionClient(sessionCookie.value);
    const { storage } = await createAdminClient();
    const user = await account.get();

    // Only allow admin
    if (user?.prefs?.role !== "admin") {
      return { error: "Unauthorized" };
    }

    const roomId = formData.get("roomId");

    // Handle image upload with fallback to existing image
    let imageID = formData.get("existingImage");

    const image = formData.get("image");

    if (image && image.size > 0 && image.name !== "undefined") {
      try {
        const response = await storage.createFile(BUCKET_ID, ID.unique(), image);
        imageID = response.$id;
      } catch (error) {
        console.log("Error uploading image", error);
        return { error: "Error uploading image" };
      }
    }

    const updatedRoom = {
      name: formData.get("name"),
      description: formData.get("description"),
      sqft: formData.get("sqft"),
      capacity: formData.get("capacity"),
      price_per_hour: formData.get("price_per_hour"),
      address: formData.get("address"),
      location: formData.get("location"),
      availability: formData.get("availability"),
      amenities: formData.get("amenities"),
      image: imageID,
    };

    await databases.updateDocument(DATABASE_ID, COLLECTION_ID, roomId, updatedRoom);

    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    return { error: error.message || "Failed to edit room" };
  }
}

export default editRoom;

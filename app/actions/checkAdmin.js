"use server";
import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";

export default async function checkAdmin() {
  try {
    const sessionCookie = cookies().get("appwrite-session");
    if (!sessionCookie) {
      return { isAdmin: false };
    }
    const { account } = await createSessionClient(sessionCookie.value);
    const user = await account.get();
    // role is stored in user.prefs.role in Appwrite console
    console.log("User role:", user?.prefs?.role);
    const isAdmin = user?.prefs?.role === "admin";
    return { isAdmin };
  } catch (error) {
    return { isAdmin: false };
  }
}

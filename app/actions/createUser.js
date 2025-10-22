"use server";
import { createAdminClient } from "@/config/appwrite";
import { ID } from "node-appwrite";

async function createUser(_previousState, formData) {
  const name = formData.get("name")?.trim();
  const email = formData.get("email")?.trim().toLowerCase();
  const password = formData.get("password");
  const confirmPassword = formData.get("confirm-password");

  // Basic field presence check
  if (!name || !email || !password || !confirmPassword) {
    return { error: "All fields are required." };
  }

  // Basic format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  // ✅ Validate password strength
  // At least 8 characters, one uppercase, one lowercase, one number, one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    return {
      error:
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
    };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    // Get account instance
    const { account } = await createAdminClient();
    // Create user
    await account.create(ID.unique(), email, password, name);

    return { success: true };
  } catch (err) {
    console.error("Registration error:", err);
    if (err.code === 409) return { error: "Email already registered." };
    return { error: "Something went wrong. Please try again." };
  }
}

export default createUser;

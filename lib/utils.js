import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value) => JSON.parse(JSON.stringify(value));

export function encryptKey(passkey) {
  return btoa(passkey);
}

export function decryptKey(passkey) {
  return atob(passkey);
}
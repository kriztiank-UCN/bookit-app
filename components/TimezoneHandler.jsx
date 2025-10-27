"use client";
import { useEffect, useState } from "react";

export const useUserTimezone = () => {
  const [timezone, setTimezone] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Get user's timezone
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimezone(userTimezone);
    } catch (error) {
      console.error("Error detecting timezone:", error);
      // Fallback to UTC
      setTimezone("UTC");
    } finally {
      setLoading(false);
    }
  }, []);

  return { timezone, loading };
};

export const formatDateWithTimezone = (dateString, userTimezone = null) => {
  const timezone = userTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const date = new Date(dateString);

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: timezone,
    timeZoneName: "short",
  };

  return date.toLocaleString("en-US", options);
};

export const convertLocalToUTC = (localDatetime, timezone) => {
  // Create date object assuming it's in the specified timezone
  const date = new Date(localDatetime);

  // Get timezone offset for the specified timezone
  const tempDate = new Date();
  const utcTime = tempDate.getTime() + tempDate.getTimezoneOffset() * 60000;
  const targetTime = new Date(utcTime + getTimezoneOffset(timezone) * 60000);

  return date.toISOString();
};

// Helper function to get timezone offset
const getTimezoneOffset = timezone => {
  const date = new Date();
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const targetDate = new Date(utc + 0 * 3600000); // UTC

  // This is a simplified approach - in production, use a proper timezone library
  return 0; // Placeholder - use Luxon or date-fns-tz for accurate calculations
};

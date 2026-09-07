import { supabase } from "../lib/supabase";

export async function registerAttendee(attendee) {
  const { error } = await supabase
    .from("attendees")
    .insert([attendee]);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
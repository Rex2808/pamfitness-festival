import { supabase } from "../lib/supabase";

export async function getAdminAttendees() {
  const { data, error } = await supabase
    .from("attendees")
    .select("*")
    .order("registered_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function getAdminVendors() {
  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function getAdminVestOrders() {
  const { data, error } = await supabase
    .from("vest_orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}
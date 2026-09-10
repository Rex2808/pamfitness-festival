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

export async function checkInAttendee(attendeeId) {
  const { data, error } = await supabase
    .from("attendees")
    .update({
      attended: true,
      attended_at: new Date().toISOString(),
    })
    .eq("id", attendeeId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function checkOutAttendee(attendeeId) {
  const { data, error } = await supabase
    .from("attendees")
    .update({
      attended: false,
      attended_at: null,
    })
    .eq("id", attendeeId)
    .select()
    .single();

  if (error) throw error;
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

export async function updateVendorStatus(vendorId, status) {
  const { data, error } = await supabase
    .from("vendors")
    .update({ status })
    .eq("id", vendorId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateVestOrderStatus(orderId, status) {
  const { data, error } = await supabase
    .from("vest_orders")
    .update({ status })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
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

export async function updateFestivalSettings(festivalId, updates) {
  const { data, error } = await supabase
    .from("festivals")
    .update(updates)
    .eq("id", festivalId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAdminActivities() {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createActivity(activity) {
  const { data, error } = await supabase
    .from("activities")
    .insert(activity)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateActivity(activityId, updates) {
  const { data, error } = await supabase
    .from("activities")
    .update(updates)
    .eq("id", activityId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
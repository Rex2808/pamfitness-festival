import { supabase } from "../lib/supabase";

export async function getActiveFestival() {
  const { data, error } = await supabase
    .from("festivals")
    .select("*")
    .eq("is_active", true)
    .eq("is_current", true)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function getFestivalActivities(festivalId) {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("festival_id", festivalId)
    .eq("is_visible", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getFestivalGallery(festivalId) {
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("festival_id", festivalId)
    .eq("is_visible", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getFestivalFaqs(festivalId) {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("festival_id", festivalId)
    .eq("is_visible", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
import { supabase } from "../lib/supabase";

export async function createVendorApplication(application) {
  const { error } = await supabase
    .from("vendors")
    .insert([application]);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
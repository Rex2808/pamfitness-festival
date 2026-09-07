import { supabase } from "../lib/supabase";

export async function createVestOrder(order) {
  const { error } = await supabase
    .from("vest_orders")
    .insert([order]);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
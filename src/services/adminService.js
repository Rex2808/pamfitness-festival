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

export async function getAdminGallery() {
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;

  return data;
}

export async function createGalleryItem(item) {
  const { data, error } = await supabase
    .from("gallery")
    .insert(item)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateGalleryItem(galleryId, updates) {
  const { data, error } = await supabase
    .from("gallery")
    .update(updates)
    .eq("id", galleryId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getAdminFaqs() {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;

  return data;
}

export async function createFaq(faq) {
  const { data, error } = await supabase
    .from("faqs")
    .insert(faq)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateFaq(faqId, updates) {
  const { data, error } = await supabase
    .from("faqs")
    .update(updates)
    .eq("id", faqId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getAdminReportSummary() {
  const [
    attendeesResult,
    vendorsResult,
    vestOrdersResult,
  ] = await Promise.all([
    supabase
      .from("attendees")
      .select("attended"),

    supabase
      .from("vendors")
      .select("status, total_amount"),

    supabase
      .from("vest_orders")
      .select("status, total_amount"),
  ]);

  if (attendeesResult.error) {
    throw attendeesResult.error;
  }

  if (vendorsResult.error) {
    throw vendorsResult.error;
  }

  if (vestOrdersResult.error) {
    throw vestOrdersResult.error;
  }

  const attendees = attendeesResult.data || [];
  const vendors = vendorsResult.data || [];
  const vestOrders = vestOrdersResult.data || [];

  const checkedInAttendees = attendees.filter(
    (attendee) => attendee.attended
  ).length;

  const approvedVendors = vendors.filter(
    (vendor) => vendor.status === "APPROVED"
  );

  const approvedVestOrders = vestOrders.filter(
    (order) => order.status === "APPROVED"
  );

  const vendorRevenue = approvedVendors.reduce(
    (total, vendor) =>
      total + Number(vendor.total_amount || 0),
    0
  );

  const vestRevenue = approvedVestOrders.reduce(
    (total, order) =>
      total + Number(order.total_amount || 0),
    0
  );

  return {
    attendees: {
      total: attendees.length,
      checkedIn: checkedInAttendees,
      notCheckedIn:
        attendees.length - checkedInAttendees,
      attendanceRate: attendees.length
        ? (checkedInAttendees / attendees.length) * 100
        : 0,
    },

    vendors: {
      total: vendors.length,
      pending: vendors.filter(
        (vendor) => vendor.status === "PENDING"
      ).length,
      approved: approvedVendors.length,
      rejected: vendors.filter(
        (vendor) => vendor.status === "REJECTED"
      ).length,
      revenue: vendorRevenue,
    },

    vestOrders: {
      total: vestOrders.length,
      pending: vestOrders.filter(
        (order) => order.status === "PENDING"
      ).length,
      approved: approvedVestOrders.length,
      rejected: vestOrders.filter(
        (order) => order.status === "REJECTED"
      ).length,
      revenue: vestRevenue,
    },

    totalConfirmedRevenue:
      vendorRevenue + vestRevenue,
  };
}

export async function inviteAdmin({
  email,
  role,
  festival_id,
}) {
  const { data, error } =
    await supabase.functions.invoke(
      "invite-admin",
      {
        body: {
          email,
          role,
          festival_id,
        },
      }
    );

  if (error) {
    throw error;
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data;
}
export async function getAdminFestivals() {
  const { data, error } = await supabase
    .from("festivals")
    .select("id, name, year, is_active")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}
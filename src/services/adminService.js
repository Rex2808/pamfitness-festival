
import { supabase } from "../lib/supabase";

// ============================================
// ATTENDEES
// ============================================

export async function getAdminAttendees(festivalId) {
  if (!festivalId) {
    throw new Error("Festival ID is required.");
  }

  const { data, error } = await supabase
    .from("attendees")
    .select("*")
    .eq("festival_id", festivalId)
    .order("registered_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function checkInAttendee(attendeeId, festivalId) {
  if (!festivalId) {
    throw new Error("Festival ID is required.");
  }

  const { data, error } = await supabase
    .from("attendees")
    .update({
      attended: true,
      attended_at: new Date().toISOString(),
    })
    .eq("id", attendeeId)
    .eq("festival_id", festivalId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function checkOutAttendee(attendeeId, festivalId) {
  if (!festivalId) {
    throw new Error("Festival ID is required.");
  }

  const { data, error } = await supabase
    .from("attendees")
    .update({
      attended: false,
      attended_at: null,
    })
    .eq("id", attendeeId)
    .eq("festival_id", festivalId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// VENDORS
// ============================================

export async function getAdminVendors(festivalId) {
  if (!festivalId) {
    throw new Error("Festival ID is required.");
  }

  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("festival_id", festivalId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateVendorStatus(
  vendorId,
  festivalId,
  status
) {
  if (!festivalId) {
    throw new Error("Festival ID is required.");
  }

  const allowedStatuses = [
    "PENDING",
    "APPROVED",
    "REJECTED",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid vendor status.");
  }

  const { data, error } = await supabase
    .from("vendors")
    .update({ status })
    .eq("id", vendorId)
    .eq("festival_id", festivalId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// VEST ORDERS
// ============================================

export async function getAdminVestOrders(festivalId) {
  if (!festivalId) {
    throw new Error("Festival ID is required.");
  }

  const { data, error } = await supabase
    .from("vest_orders")
    .select("*")
    .eq("festival_id", festivalId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateVestOrderStatus(
  orderId,
  festivalId,
  status
) {
  if (!festivalId) {
    throw new Error("Festival ID is required.");
  }

  const allowedStatuses = [
    "PENDING",
    "APPROVED",
    "REJECTED",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid vest order status.");
  }

  const { data, error } = await supabase
    .from("vest_orders")
    .update({ status })
    .eq("id", orderId)
    .eq("festival_id", festivalId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// FESTIVAL SETTINGS
// ============================================

const ALLOWED_FESTIVAL_SETTINGS = [
  "name",
  "year",
  "theme",
  "event_date",
  "start_time",
  "venue",
  "address",
  "city",
  "entry_type",
  "vendor_price",
  "vest_price",
  "whatsapp",
  "facebook_url",
  "instagram_url",
  "tiktok_url",
];

export async function updateFestivalSettings(
  festivalId,
  updates
) {
  if (!festivalId) {
    throw new Error("Festival ID is required.");
  }

  if (
    !updates ||
    typeof updates !== "object" ||
    Array.isArray(updates)
  ) {
    throw new Error("Invalid festival settings.");
  }

  const updateKeys = Object.keys(updates);

  if (updateKeys.length === 0) {
    throw new Error("No festival settings provided.");
  }

  const invalidFields = updateKeys.filter(
    (key) => !ALLOWED_FESTIVAL_SETTINGS.includes(key)
  );

  if (invalidFields.length > 0) {
    throw new Error(
      `These festival fields cannot be updated directly: ${invalidFields.join(", ")}`
    );
  }

  const { data, error } = await supabase
    .from("festivals")
    .update(updates)
    .eq("id", festivalId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// ACTIVITIES
// ============================================

export async function getAdminActivities(festivalId) {
  if (!festivalId) {
    throw new Error("Festival ID is required.");
  }

  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("festival_id", festivalId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createActivity(activity) {
  if (!activity.festival_id) {
    throw new Error("Festival ID is required.");
  }

  const { data, error } = await supabase
    .from("activities")
    .insert(activity)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateActivity(
  activityId,
  festivalId,
  updates
) {
  if (!festivalId) {
    throw new Error("Festival ID is required.");
  }

  const { data, error } = await supabase
    .from("activities")
    .update(updates)
    .eq("id", activityId)
    .eq("festival_id", festivalId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// GALLERY
// ============================================

export async function getAdminGallery(festivalId) {
  if (!festivalId) {
    throw new Error("Festival ID is required.");
  }

  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("festival_id", festivalId)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createGalleryItem(item) {
  if (!item.festival_id) {
    throw new Error("Festival ID is required.");
  }

  const { data, error } = await supabase
    .from("gallery")
    .insert(item)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGalleryItem(
  galleryId,
  festivalId,
  updates
) {
  if (!festivalId) {
    throw new Error("Festival ID is required.");
  }

  const { data, error } = await supabase
    .from("gallery")
    .update(updates)
    .eq("id", galleryId)
    .eq("festival_id", festivalId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// FAQs
// ============================================

export async function getAdminFaqs(festivalId) {
  if (!festivalId) {
    throw new Error("Festival ID is required.");
  }

  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("festival_id", festivalId)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function createFaq(faq) {
  if (!faq.festival_id) {
    throw new Error("Festival ID is required.");
  }

  const { data, error } = await supabase
    .from("faqs")
    .insert(faq)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateFaq(
  faqId,
  festivalId,
  updates
) {
  if (!festivalId) {
    throw new Error("Festival ID is required.");
  }

  const { data, error } = await supabase
    .from("faqs")
    .update(updates)
    .eq("id", faqId)
    .eq("festival_id", festivalId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================
// REPORTS
// ============================================

export async function getAdminReportSummary(festivalId) {
  if (!festivalId) {
    throw new Error(
      "A festival must be selected to generate reports."
    );
  }

  const [
    attendeesResult,
    vendorsResult,
    vestOrdersResult,
  ] = await Promise.all([
    supabase
      .from("attendees")
      .select("attended")
      .eq("festival_id", festivalId),

    supabase
      .from("vendors")
      .select("status, total_amount")
      .eq("festival_id", festivalId),

    supabase
      .from("vest_orders")
      .select("status, total_amount")
      .eq("festival_id", festivalId),
  ]);

  if (attendeesResult.error) throw attendeesResult.error;
  if (vendorsResult.error) throw vendorsResult.error;
  if (vestOrdersResult.error) throw vestOrdersResult.error;

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
      notCheckedIn: attendees.length - checkedInAttendees,
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

    totalConfirmedRevenue: vendorRevenue + vestRevenue,
  };
}

// ============================================
// ADMIN INVITATIONS
// ============================================

export async function inviteAdmin({
  email,
  role,
  festival_id,
}) {
  const { data, error } = await supabase.functions.invoke(
    "invite-admin",
    {
      body: {
        email,
        role,
        festival_id,
      },
    }
  );

  if (error) throw error;

  if (data?.error) {
    throw new Error(data.error);
  }

  return data;
}

// ============================================
// FESTIVAL MANAGEMENT
// ============================================

export async function getAdminFestivals() {
  const { data, error } = await supabase
    .from("festivals")
    .select(`
      id,
      name,
      year,
      event_date,
      city,
      venue,
      is_active,
      is_current,
      status,
      created_at
    `)
    .order("year", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createFestival(festival) {
  if (!festival || typeof festival !== "object") {
    throw new Error("Festival details are required.");
  }

  const { data, error } = await supabase.rpc(
    "create_festival",
    {
      p_name: festival.name,
      p_year: festival.year,
      p_event_date: festival.event_date ?? null,
      p_theme: festival.theme ?? null,
      p_start_time: festival.start_time ?? null,
      p_venue: festival.venue ?? null,
      p_address: festival.address ?? null,
      p_city: festival.city ?? null,
      p_entry_type: festival.entry_type ?? null,
      p_vendor_price: festival.vendor_price ?? 0,
      p_vest_price: festival.vest_price ?? 0,
      p_whatsapp: festival.whatsapp ?? null,
    }
  );

  if (error) throw error;
  return data;
}

export async function setCurrentFestival(festivalId) {
  if (!festivalId) {
    throw new Error("Festival ID is required.");
  }

  const { data, error } = await supabase.rpc(
    "set_current_festival",
    {
      target_festival_id: festivalId,
    }
  );

  if (error) throw error;
  return data;
}

export async function updateFestivalStatus(
  festivalId,
  status
) {
  if (!festivalId) {
    throw new Error("Festival ID is required.");
  }

  const allowedStatuses = [
    "DRAFT",
    "OPEN",
    "CLOSED",
    "ARCHIVED",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid festival status.");
  }

  const { data, error } = await supabase.rpc(
    "update_festival_status",
    {
      p_festival_id: festivalId,
      p_status: status,
    }
  );

  if (error) throw error;
  return data;
}

// ============================================
// CURRENT ADMIN PROFILE
// ============================================

export async function getCurrentAdminProfile() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("admin_users")
    .select("id, role, festival_id")
    .eq("user_id", user.id)
    .single();

  if (error) throw error;
  return data;
}

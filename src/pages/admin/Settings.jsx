import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { updateFestivalSettings } from "../../services/adminService";

function Settings() {
  const [festival, setFestival] = useState(null);

  const [form, setForm] = useState({
    name: "",
    year: "",
    theme: "",
    event_date: "",
    start_time: "",
    venue: "",
    address: "",
    city: "",
    entry_type: "",
    vendor_price: "",
    vest_price: "",
    whatsapp: "",
    facebook_url: "",
    instagram_url: "",
    tiktok_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadFestival() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          throw new Error("You are not authenticated.");
        }

        const { data: adminUser, error: adminError } =
          await supabase
            .from("admin_users")
            .select("role, festival_id")
            .eq("user_id", user.id)
            .single();

        if (adminError) {
          throw adminError;
        }

        let query = supabase
          .from("festivals")
          .select("*");

        if (
          adminUser.role !== "PLATFORM_ADMIN" &&
          adminUser.festival_id
        ) {
          query = query.eq("id", adminUser.festival_id);
        }

        const { data, error: festivalError } = await query
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (festivalError) {
          throw festivalError;
        }

        setFestival(data);

        setForm({
          name: data.name || "",
          year: data.year || "",
          theme: data.theme || "",
          event_date: data.event_date || "",
          start_time: data.start_time
            ? data.start_time.slice(0, 5)
            : "",
          venue: data.venue || "",
          address: data.address || "",
          city: data.city || "",
          entry_type: data.entry_type || "",
          vendor_price: data.vendor_price || "",
          vest_price: data.vest_price || "",
          whatsapp: data.whatsapp || "",
          facebook_url: data.facebook_url || "",
          instagram_url: data.instagram_url || "",
          tiktok_url: data.tiktok_url || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadFestival();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updatedFestival = await updateFestivalSettings(
        festival.id,
        {
          name: form.name.trim(),
          year: Number(form.year),
          theme: form.theme.trim(),
          event_date: form.event_date,
          start_time: form.start_time,
          venue: form.venue.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          entry_type: form.entry_type.trim(),
          vendor_price: Number(form.vendor_price),
          vest_price: Number(form.vest_price),
          whatsapp: form.whatsapp.trim(),
          facebook_url: form.facebook_url.trim(),
          instagram_url: form.instagram_url.trim(),
          tiktok_url: form.tiktok_url.trim(),
        }
      );

      setFestival(updatedFestival);

      setForm({
        name: updatedFestival.name || "",
        year: updatedFestival.year || "",
        theme: updatedFestival.theme || "",
        event_date: updatedFestival.event_date || "",
        start_time: updatedFestival.start_time
          ? updatedFestival.start_time.slice(0, 5)
          : "",
        venue: updatedFestival.venue || "",
        address: updatedFestival.address || "",
        city: updatedFestival.city || "",
        entry_type: updatedFestival.entry_type || "",
        vendor_price:
          updatedFestival.vendor_price || "",
        vest_price:
          updatedFestival.vest_price || "",
        whatsapp: updatedFestival.whatsapp || "",
        facebook_url:
          updatedFestival.facebook_url || "",
        instagram_url:
          updatedFestival.instagram_url || "",
        tiktok_url:
          updatedFestival.tiktok_url || "",
      });

      setSuccess("Festival settings saved successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Loading festival settings...</p>;
  }

  if (error && !festival) {
    return (
      <div className="admin-message">
        Failed to load settings: {error}
      </div>
    );
  }

  if (!festival) {
    return (
      <div className="admin-message">
        No festival settings found.
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <span className="admin-topbar-label">
            FESTIVAL CONFIGURATION
          </span>

          <h1>Festival Settings</h1>

          <p>
            Manage the information displayed across the
            festival website.
          </p>
        </div>
      </div>

      {error && (
        <div className="admin-settings-message">
          Failed to save settings: {error}
        </div>
      )}

      {success && (
        <div className="admin-settings-message">
          {success}
        </div>
      )}

      <form
        className="admin-settings-form"
        onSubmit={handleSubmit}
      >
        <section className="admin-settings-section">
          <h2>Basic Festival Information</h2>

          <div className="admin-settings-grid">
            <div className="admin-settings-field full-width">
              <label htmlFor="name">
                Festival Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-settings-field">
              <label htmlFor="year">Year</label>

              <input
                id="year"
                name="year"
                type="number"
                value={form.year}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-settings-field">
              <label htmlFor="theme">Theme</label>

              <input
                id="theme"
                name="theme"
                type="text"
                value={form.theme}
                onChange={handleChange}
              />
            </div>

            <div className="admin-settings-field">
              <label htmlFor="event_date">
                Event Date
              </label>

              <input
                id="event_date"
                name="event_date"
                type="date"
                value={form.event_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-settings-field">
              <label htmlFor="start_time">
                Start Time
              </label>

              <input
                id="start_time"
                name="start_time"
                type="time"
                value={form.start_time}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-settings-field">
              <label htmlFor="venue">Venue</label>

              <input
                id="venue"
                name="venue"
                type="text"
                value={form.venue}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-settings-field">
              <label htmlFor="address">
                Address
              </label>

              <input
                id="address"
                name="address"
                type="text"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-settings-field">
              <label htmlFor="city">City</label>

              <input
                id="city"
                name="city"
                type="text"
                value={form.city}
                onChange={handleChange}
              />
            </div>

            <div className="admin-settings-field">
              <label htmlFor="entry_type">
                Entry Type
              </label>

              <input
                id="entry_type"
                name="entry_type"
                type="text"
                value={form.entry_type}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        <section className="admin-settings-section">
          <h2>Pricing & Contact</h2>

          <div className="admin-settings-grid">
            <div className="admin-settings-field">
              <label htmlFor="vendor_price">
                Vendor Price
              </label>

              <input
                id="vendor_price"
                name="vendor_price"
                type="number"
                min="0"
                value={form.vendor_price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-settings-field">
              <label htmlFor="vest_price">
                Vest Price
              </label>

              <input
                id="vest_price"
                name="vest_price"
                type="number"
                min="0"
                value={form.vest_price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-settings-field full-width">
              <label htmlFor="whatsapp">
                WhatsApp Number
              </label>

              <input
                id="whatsapp"
                name="whatsapp"
                type="text"
                value={form.whatsapp}
                onChange={handleChange}
                required
              />

              <p className="admin-settings-hint">
                Use the international WhatsApp number
                without the + sign.
              </p>
            </div>

            <div className="admin-settings-field">
              <label htmlFor="facebook_url">
                Facebook URL
              </label>

              <input
                id="facebook_url"
                name="facebook_url"
                type="url"
                value={form.facebook_url}
                onChange={handleChange}
              />
            </div>

            <div className="admin-settings-field">
              <label htmlFor="instagram_url">
                Instagram URL
              </label>

              <input
                id="instagram_url"
                name="instagram_url"
                type="url"
                value={form.instagram_url}
                onChange={handleChange}
              />
            </div>

            <div className="admin-settings-field">
              <label htmlFor="tiktok_url">
                TikTok URL
              </label>

              <input
                id="tiktok_url"
                name="tiktok_url"
                type="url"
                value={form.tiktok_url}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        <div className="admin-settings-actions">
          <button
            type="submit"
            className="admin-settings-save"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;
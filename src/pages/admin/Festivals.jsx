
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Plus,
  RefreshCw,
  Star,
  Archive,
  Eye,
} from "lucide-react";

import {
  getAdminFestivals,
  createFestival,
  setCurrentFestival,
  updateFestivalStatus,
} from "../../services/adminService";

function Festivals() {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    year: "",
    event_date: "",
    theme: "",
    start_time: "",
    venue: "",
    address: "",
    city: "",
    entry_type: "",
    vendor_price: "0",
    vest_price: "0",
    whatsapp: "",
  });

  async function loadFestivals() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminFestivals();
      setFestivals(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFestivals();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleCreateFestival(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await createFestival({
        name: form.name.trim(),
        year: Number(form.year),
        event_date: form.event_date || null,
        theme: form.theme.trim() || null,
        start_time: form.start_time || null,
        venue: form.venue.trim() || null,
        address: form.address.trim() || null,
        city: form.city.trim() || null,
        entry_type: form.entry_type.trim() || null,
        vendor_price: Number(form.vendor_price),
        vest_price: Number(form.vest_price),
        whatsapp: form.whatsapp.trim() || null,
      });

      setForm({
        name: "",
        year: "",
        event_date: "",
        theme: "",
        start_time: "",
        venue: "",
        address: "",
        city: "",
        entry_type: "",
        vendor_price: "0",
        vest_price: "0",
        whatsapp: "",
      });

      setShowForm(false);
      setSuccess(
        "Festival edition created successfully as a draft."
      );

      await loadFestivals();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSetCurrent(festival) {
    if (
      festival.status === "DRAFT" ||
      !festival.is_active
    ) {
      setError(
        "Only published festival editions can become the current festival."
      );
      return;
    }

    const confirmed = window.confirm(
      `Make ${festival.name} the current homepage festival?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await setCurrentFestival(festival.id);

      setSuccess(
        `${festival.name} is now the current festival.`
      );

      await loadFestivals();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleStatusChange(festival, status) {
    if (
      status === "DRAFT" &&
      festival.is_current
    ) {
      setError(
        "You cannot convert the current festival into a draft. Switch to another festival first."
      );
      return;
    }

    const confirmed = window.confirm(
      `Change ${festival.name} status to ${status}?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await updateFestivalStatus(festival.id, status);

      setSuccess(
        `${festival.name} status updated to ${status}.`
      );

      await loadFestivals();
    } catch (err) {
      setError(err.message);
    }
  }

  const currentFestival = festivals.find(
    (festival) => festival.is_current
  );

  const archivedCount = festivals.filter(
    (festival) => festival.status === "ARCHIVED"
  ).length;

  const activeCount = festivals.filter(
    (festival) => festival.is_active
  ).length;

  if (loading && festivals.length === 0) {
    return <p>Loading festival editions...</p>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <span className="admin-topbar-label">
            PLATFORM ADMINISTRATION
          </span>

          <h1>Festival Management</h1>

          <p>
            Create, organize and manage different festival editions.
          </p>
        </div>

        <button
          type="button"
          className="admin-settings-save"
          onClick={() => {
            setShowForm((value) => !value);
            setError("");
            setSuccess("");
          }}
        >
          <Plus size={17} />
          {showForm ? "Close Form" : "Create Festival"}
        </button>
      </div>

      {error && (
        <div className="admin-message">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-message">
          {success}
        </div>
      )}

      <div className="admin-settings-grid">
        <div className="admin-settings-section">
          <CalendarDays size={22} />
          <p>Total Editions</p>
          <h2>{festivals.length}</h2>
        </div>

        <div className="admin-settings-section">
          <Star size={22} />
          <p>Current Edition</p>
          <h2>{currentFestival?.year || "None"}</h2>
        </div>

        <div className="admin-settings-section">
          <Archive size={22} />
          <p>Archived Editions</p>
          <h2>{archivedCount}</h2>
        </div>

        <div className="admin-settings-section">
          <Eye size={22} />
          <p>Visible Editions</p>
          <h2>{activeCount}</h2>
        </div>
      </div>

      {showForm && (
        <form
          className="admin-settings-form"
          onSubmit={handleCreateFestival}
        >
          <section className="admin-settings-section">
            <h2>Create Festival Edition</h2>

            <div className="admin-settings-grid">
              <div className="admin-settings-field full-width">
                <label htmlFor="festival-name">
                  Festival Name
                </label>

                <input
                  id="festival-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="PAMFITNESS FESTIVAL 2027"
                />
              </div>

              <div className="admin-settings-field">
                <label htmlFor="festival-year">
                  Year
                </label>

                <input
                  id="festival-year"
                  name="year"
                  type="number"
                  min="2026"
                  value={form.year}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-settings-field">
                <label htmlFor="festival-date">
                  Event Date (Optional)
                </label>

                <input
                  id="festival-date"
                  name="event_date"
                  type="date"
                  value={form.event_date}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-settings-field">
                <label htmlFor="festival-theme">
                  Theme
                </label>

                <input
                  id="festival-theme"
                  name="theme"
                  value={form.theme}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-settings-field">
                <label htmlFor="festival-time">
                  Start Time
                </label>

                <input
                  id="festival-time"
                  name="start_time"
                  type="time"
                  value={form.start_time}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-settings-field">
                <label htmlFor="festival-venue">
                  Venue
                </label>

                <input
                  id="festival-venue"
                  name="venue"
                  value={form.venue}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-settings-field">
                <label htmlFor="festival-address">
                  Address
                </label>

                <input
                  id="festival-address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-settings-field">
                <label htmlFor="festival-city">
                  City
                </label>

                <input
                  id="festival-city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-settings-field">
                <label htmlFor="festival-entry">
                  Entry Type
                </label>

                <input
                  id="festival-entry"
                  name="entry_type"
                  value={form.entry_type}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-settings-field">
                <label htmlFor="festival-vendor-price">
                  Vendor Price
                </label>

                <input
                  id="festival-vendor-price"
                  name="vendor_price"
                  type="number"
                  min="0"
                  value={form.vendor_price}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-settings-field">
                <label htmlFor="festival-vest-price">
                  Vest Price
                </label>

                <input
                  id="festival-vest-price"
                  name="vest_price"
                  type="number"
                  min="0"
                  value={form.vest_price}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-settings-field full-width">
                <label htmlFor="festival-whatsapp">
                  WhatsApp Number
                </label>

                <input
                  id="festival-whatsapp"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                />
              </div>
            </div>

            <p className="admin-settings-hint">
              New editions are created as DRAFT, hidden from the
              public website, and cannot receive registrations,
              vendor applications, or vest orders. You can publish
              an edition when its details are ready. Creating a
              draft will not replace the current homepage festival.
            </p>

            <div className="admin-settings-actions">
              <button
                type="submit"
                className="admin-settings-save"
                disabled={saving}
              >
                {saving ? "Creating..." : "Create Draft"}
              </button>
            </div>
          </section>
        </form>
      )}

      <section className="admin-settings-section">
        <div className="admin-page-header">
          <h2>Festival Editions</h2>

          <button
            type="button"
            onClick={loadFestivals}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {festivals.length === 0 ? (
          <p>No festival editions found.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Festival</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th>Visibility</th>
                  <th>Homepage</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {festivals.map((festival) => (
                  <tr key={festival.id}>
                    <td>{festival.name}</td>

                    <td>{festival.year}</td>

                    <td>{festival.status}</td>

                    <td>
                      {festival.is_active ? "Visible" : "Hidden"}
                    </td>

                    <td>
                      {festival.is_current ? "Current" : "—"}
                    </td>

                    <td>
                      <div className="admin-festival-actions">
                        {!festival.is_current &&
                          festival.is_active &&
                          festival.status !== "DRAFT" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleSetCurrent(festival)
                              }
                            >
                              Make Current
                            </button>
                          )}

                        <select
                          aria-label={`Change status for ${festival.name}`}
                          value={festival.status}
                          onChange={(event) =>
                            handleStatusChange(
                              festival,
                              event.target.value
                            )
                          }
                        >
                          <option value="DRAFT">Draft</option>
                          <option value="OPEN">Open</option>
                          <option value="CLOSED">Closed</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Festivals;

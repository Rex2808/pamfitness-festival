import { useEffect, useState } from "react";
import {
  getAdminFestivals,
  inviteAdmin,
} from "../../services/adminService";

function Admins() {
  const [festivals, setFestivals] = useState([]);
  const [loadingFestivals, setLoadingFestivals] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    role: "FESTIVAL_ADMIN",
    festival_id: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFestivals() {
      try {
        const data = await getAdminFestivals();

        setFestivals(data);

        if (data.length > 0) {
          setFormData((previous) => ({
            ...previous,
            festival_id: data[0].id,
          }));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingFestivals(false);
      }
    }

    loadFestivals();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const result = await inviteAdmin(formData);

      setMessage(
        result.message ||
          "Invitation sent successfully."
      );

      setFormData((previous) => ({
        ...previous,
        email: "",
      }));
    } catch (err) {
      setError(
        err.message ||
          "Unable to send invitation."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">
            ACCESS MANAGEMENT
          </p>

          <h1>Admins & Staff</h1>

          <p>
            Invite festival administrators and staff
            members to manage assigned festivals.
          </p>
        </div>
      </div>

      <div className="admin-settings-form">
        <section className="admin-settings-section">
          <h2>Invite Team Member</h2>

          <form
            onSubmit={handleSubmit}
            className="admin-settings-grid"
          >
            <div className="admin-settings-field">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="client@example.com"
                required
              />
            </div>

            <div className="admin-settings-field">
              <label htmlFor="role">
                Role
              </label>

              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="FESTIVAL_ADMIN">
                  Festival Admin
                </option>

                <option value="STAFF">
                  Staff
                </option>
              </select>
            </div>

            <div className="admin-settings-field full-width">
              <label htmlFor="festival_id">
                Festival
              </label>

              {loadingFestivals ? (
                <p className="admin-settings-hint">
                  Loading festivals...
                </p>
              ) : (
                <select
                  id="festival_id"
                  name="festival_id"
                  value={formData.festival_id}
                  onChange={handleChange}
                  required
                >
                  {festivals.map((festival) => (
                    <option
                      key={festival.id}
                      value={festival.id}
                    >
                      {festival.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="admin-settings-actions full-width">
              <button
                type="submit"
                className="admin-settings-save"
                disabled={
                  submitting ||
                  loadingFestivals ||
                  !formData.festival_id
                }
              >
                {submitting
                  ? "Sending Invitation..."
                  : "Send Invitation"}
              </button>
            </div>
          </form>
        </section>

        {message && (
          <div className="admin-settings-message">
            {message}
          </div>
        )}

        {error && (
          <div className="admin-settings-message">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admins;
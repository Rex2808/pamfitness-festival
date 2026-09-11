import { useEffect, useState } from "react";
import {
  getAdminActivities,
  createActivity,
  updateActivity,
} from "../../services/adminService";
import { supabase } from "../../lib/supabase";

function Activities() {
  const [activities, setActivities] = useState([]);
  const [festivalId, setFestivalId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    is_visible: true,
  });

  useEffect(() => {
    async function loadData() {
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

        let currentFestivalId = adminUser.festival_id;

        if (
          adminUser.role === "PLATFORM_ADMIN" ||
          !currentFestivalId
        ) {
          const { data: festival, error: festivalError } =
            await supabase
              .from("festivals")
              .select("id")
              .eq("is_active", true)
              .order("created_at", {
                ascending: false,
              })
              .limit(1)
              .single();

          if (festivalError) {
            throw festivalError;
          }

          currentFestivalId = festival.id;
        }

        setFestivalId(currentFestivalId);

        const data = await getAdminActivities();
        setActivities(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function openAddForm() {
    setEditingActivity(null);

    setForm({
      name: "",
      description: "",
      is_visible: true,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function openEditForm(activity) {
    setEditingActivity(activity);

    setForm({
      name: activity.name || "",
      description: activity.description || "",
      is_visible: activity.is_visible ?? true,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingActivity(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!festivalId) {
        throw new Error(
          "No festival is available for this activity."
        );
      }

      const name = form.name.trim();
      const description = form.description.trim();

      if (!name) {
        throw new Error("Activity name is required.");
      }

      if (editingActivity) {
        const updatedActivity = await updateActivity(
          editingActivity.id,
          {
            name,
            description,
            is_visible: form.is_visible,
          }
        );

        setActivities((currentActivities) =>
          currentActivities.map((activity) =>
            activity.id === updatedActivity.id
              ? updatedActivity
              : activity
          )
        );

        setSuccess("Activity updated successfully.");
      } else {
        const activity = await createActivity({
          festival_id: festivalId,
          name,
          description,
          is_visible: form.is_visible,
        });

        setActivities((currentActivities) => [
          ...currentActivities,
          activity,
        ]);

        setSuccess("Activity created successfully.");
      }

      setForm({
        name: "",
        description: "",
        is_visible: true,
      });

      setEditingActivity(null);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleVisibility(activity) {
    try {
      setError("");
      setSuccess("");

      const updatedActivity = await updateActivity(
        activity.id,
        {
          is_visible: !activity.is_visible,
        }
      );

      setActivities((currentActivities) =>
        currentActivities.map((currentActivity) =>
          currentActivity.id === updatedActivity.id
            ? updatedActivity
            : currentActivity
        )
      );

      setSuccess(
        updatedActivity.is_visible
          ? "Activity is now visible on the public website."
          : "Activity has been hidden from the public website."
      );
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return <p>Loading activities...</p>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <span className="admin-topbar-label">
            FESTIVAL CONTENT
          </span>

          <h1>Activities</h1>

          <p>
            Manage the activities displayed on the
            festival website.
          </p>
        </div>

        <div className="admin-page-actions">
          <button
            type="button"
            className="admin-primary-button"
            onClick={openAddForm}
          >
            + Add Activity
          </button>
        </div>
      </div>

      {success && (
        <div className="admin-message">
          {success}
        </div>
      )}

      {error && (
        <div className="admin-message">
          Failed to process activity: {error}
        </div>
      )}

      {showForm && (
        <form
          className="admin-form"
          onSubmit={handleSubmit}
        >
          <h2>
            {editingActivity
              ? "Edit Activity"
              : "Add Activity"}
          </h2>

          <div className="admin-form-grid">
            <div className="admin-form-field">
              <label htmlFor="name">
                Activity Name
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

            <div className="admin-form-field">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <label className="admin-checkbox-field">
              <input
                type="checkbox"
                name="is_visible"
                checked={form.is_visible}
                onChange={handleChange}
              />

              Visible on public website
            </label>

            <div className="admin-form-actions">
              <button
                type="submit"
                className="admin-primary-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingActivity
                    ? "Update Activity"
                    : "Save Activity"}
              </button>

              <button
                type="button"
                className="admin-secondary-button"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="admin-activity-list">
        {activities.length === 0 ? (
          <div className="admin-message">
            No activities found.
          </div>
        ) : (
          activities.map((activity) => (
            <div
              className="admin-activity-card"
              key={activity.id}
            >
              <div className="admin-activity-card-header">
                <div>
                  <h2>{activity.name}</h2>

                  <p>
                    {activity.description || "—"}
                  </p>
                </div>

                <span className="admin-activity-status">
                  {activity.is_visible
                    ? "Visible"
                    : "Hidden"}
                </span>
              </div>

              <div className="admin-activity-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={() =>
                    openEditForm(activity)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={() =>
                    handleToggleVisibility(activity)
                  }
                >
                  {activity.is_visible
                    ? "Hide"
                    : "Show"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Activities;
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
      <h1>Activities</h1>

      <p>
        Manage the activities displayed on the
        festival website.
      </p>

      <div>
        <p>
          Total activities: {activities.length}
        </p>

        <button
          type="button"
          onClick={openAddForm}
        >
          Add Activity
        </button>
      </div>

      {success && <p>{success}</p>}

      {error && (
        <p>
          Failed to process activity: {error}
        </p>
      )}

      {showForm && (
        <form onSubmit={handleSubmit}>
          <section>
            <h2>
              {editingActivity
                ? "Edit Activity"
                : "Add Activity"}
            </h2>

            <div>
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

            <div>
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

            <div>
              <label>
                <input
                  type="checkbox"
                  name="is_visible"
                  checked={form.is_visible}
                  onChange={handleChange}
                />

                Visible on public website
              </label>
            </div>

            <div>
              <button
                type="submit"
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
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </section>
        </form>
      )}

      <div>
        {activities.map((activity) => (
          <div key={activity.id}>
            <h2>{activity.name}</h2>

            <p>
              {activity.description || "—"}
            </p>

            <p>
              Status:{" "}
              {activity.is_visible
                ? "Visible"
                : "Hidden"}
            </p>

            <div>
              <button
                type="button"
                onClick={() =>
                  openEditForm(activity)
                }
              >
                Edit
              </button>

              <button
                type="button"
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
        ))}
      </div>
    </div>
  );
}

export default Activities;
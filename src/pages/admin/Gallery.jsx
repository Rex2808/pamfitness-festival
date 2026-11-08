
import { useEffect, useState } from "react";

import {
  createGalleryItem,
  getAdminGallery,
  updateGalleryItem,
} from "../../services/adminService";

import { supabase } from "../../lib/supabase";

function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [festivalId, setFestivalId] = useState(null);
  const [festivalStatus, setFestivalStatus] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    image_url: "",
    caption: "",
    display_order: 1,
  });

  const [editingId, setEditingId] = useState(null);

  const canManageGallery =
    Boolean(festivalId) &&
    !["DRAFT", "ARCHIVED"].includes(festivalStatus);

  useEffect(() => {
    loadGallery();
  }, []);

  async function loadGallery() {
    try {
      setLoading(true);
      setError("");

      // Get authenticated user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        throw new Error("You are not authenticated.");
      }

      // Get administrator profile
      const { data: adminUser, error: adminError } =
        await supabase
          .from("admin_users")
          .select("role, festival_id")
          .eq("user_id", user.id)
          .single();

      if (adminError) throw adminError;

      // Resolve the festival for this administrator
      let festivalQuery = supabase
        .from("festivals")
        .select("id, name, status");

      if (adminUser.role === "PLATFORM_ADMIN") {
        festivalQuery = festivalQuery
          .eq("is_current", true)
          .eq("is_active", true);
      } else if (adminUser.festival_id) {
        festivalQuery = festivalQuery.eq(
          "id",
          adminUser.festival_id
        );
      } else {
        throw new Error(
          "Your administrator account has no assigned festival."
        );
      }

      const {
        data: festival,
        error: festivalError,
      } = await festivalQuery.single();

      if (festivalError) throw festivalError;

      if (!festival) {
        throw new Error("No festival was found.");
      }

      setFestivalId(festival.id);
      setFestivalStatus(festival.status);

      // Fetch only gallery images belonging to this festival
      const data = await getAdminGallery(festival.id);

      setGallery(data || []);

      setForm({
        image_url: "",
        caption: "",
        display_order: (data?.length || 0) + 1,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function resetForm() {
    setEditingId(null);

    setForm({
      image_url: "",
      caption: "",
      display_order: gallery.length + 1,
    });

    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!festivalId) {
        throw new Error("No festival is selected.");
      }

      if (!canManageGallery) {
        throw new Error(
          "This festival cannot be edited because it is a draft or archived."
        );
      }

      const imageUrl = form.image_url.trim();

      if (!imageUrl) {
        throw new Error("Image URL is required.");
      }

      const displayOrder = Number(form.display_order);

      if (
        !Number.isInteger(displayOrder) ||
        displayOrder < 1
      ) {
        throw new Error(
          "Display order must be a positive whole number."
        );
      }

      const imageData = {
        image_url: imageUrl,
        caption: form.caption.trim(),
        display_order: displayOrder,
      };

      if (editingId) {
        const updatedItem = await updateGalleryItem(
          editingId,
          festivalId,
          imageData
        );

        setGallery((currentGallery) =>
          currentGallery
            .map((item) =>
              item.id === updatedItem.id
                ? updatedItem
                : item
            )
            .sort(
              (a, b) =>
                a.display_order - b.display_order
            )
        );

        setSuccess("Gallery image updated successfully.");
      } else {
        const newItem = await createGalleryItem({
          festival_id: festivalId,
          ...imageData,
          is_visible: true,
        });

        setGallery((currentGallery) =>
          [...currentGallery, newItem].sort(
            (a, b) =>
              a.display_order - b.display_order
          )
        );

        setSuccess("Gallery image added successfully.");
      }

      setEditingId(null);

      setForm({
        image_url: "",
        caption: "",
        display_order: gallery.length + (editingId ? 0 : 2),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleVisibility(item) {
    if (saving) return;

    try {
      setError("");
      setSuccess("");

      if (!festivalId) {
        throw new Error("No festival is selected.");
      }

      if (!canManageGallery) {
        throw new Error(
          "This festival cannot be edited because it is a draft or archived."
        );
      }

      setSaving(true);

      const updatedItem = await updateGalleryItem(
        item.id,
        festivalId,
        {
          is_visible: !item.is_visible,
        }
      );

      setGallery((currentGallery) =>
        currentGallery.map((galleryItem) =>
          galleryItem.id === updatedItem.id
            ? updatedItem
            : galleryItem
        )
      );

      setSuccess(
        updatedItem.is_visible
          ? "Image is now visible on the public website."
          : "Image has been hidden from the public website."
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(item) {
    if (!canManageGallery || saving) return;

    setEditingId(item.id);

    setForm({
      image_url: item.image_url || "",
      caption: item.caption || "",
      display_order: item.display_order || 1,
    });

    setError("");
    setSuccess("");
  }

  if (loading) {
    return <p>Loading gallery...</p>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <span className="admin-topbar-label">
            FESTIVAL CONTENT
          </span>

          <h1>Gallery</h1>

          <p>
            Manage images for the selected festival edition.
          </p>

          {festivalStatus && (
            <p>
              Festival status:{" "}
              <strong>{festivalStatus}</strong>
            </p>
          )}
        </div>
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

      {!canManageGallery && (
        <div className="admin-message">
          This festival is{" "}
          {festivalStatus?.toLowerCase() || "unavailable"}.
          Gallery images are available for viewing, but editing
          is disabled.
        </div>
      )}

      <form
        className="admin-form"
        onSubmit={handleSubmit}
      >
        <h2>
          {editingId
            ? "Edit Gallery Image"
            : "Add Gallery Image"}
        </h2>

        <fieldset
          disabled={!canManageGallery || saving}
          style={{
            border: "none",
            padding: 0,
            margin: 0,
          }}
        >
          <div className="admin-form-grid">
            <div className="admin-form-field full-width">
              <label htmlFor="image_url">
                Image URL
              </label>

              <input
                id="image_url"
                name="image_url"
                type="url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="https://..."
                required
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="caption">
                Caption
              </label>

              <input
                id="caption"
                name="caption"
                type="text"
                value={form.caption}
                onChange={handleChange}
                placeholder="Image description"
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="display_order">
                Display Order
              </label>

              <input
                id="display_order"
                name="display_order"
                type="number"
                min="1"
                step="1"
                value={form.display_order}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="admin-form-actions">
            <button
              type="submit"
              className="admin-primary-button"
              disabled={saving || !canManageGallery}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Save Changes"
                  : "Add Image"}
            </button>

            {editingId && (
              <button
                type="button"
                className="admin-secondary-button"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </fieldset>
      </form>

      <div className="admin-gallery-list">
        {gallery.length === 0 ? (
          <div className="admin-message">
            No gallery images found for this festival.
          </div>
        ) : (
          gallery.map((item) => (
            <article
              className="admin-gallery-card"
              key={item.id}
            >
              <img
                className="admin-gallery-image"
                src={item.image_url}
                alt={
                  item.caption ||
                  "Festival gallery image"
                }
              />

              <div className="admin-gallery-card-body">
                <div className="admin-gallery-card-header">
                  <div>
                    <h2>
                      {item.caption || "Untitled Image"}
                    </h2>

                    <p className="admin-gallery-card-meta">
                      Display Order: {item.display_order}
                    </p>
                  </div>

                  <span className="admin-gallery-status">
                    {item.is_visible ? "VISIBLE" : "HIDDEN"}
                  </span>
                </div>

                <div className="admin-gallery-card-actions">
                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={() => handleEdit(item)}
                    disabled={!canManageGallery || saving}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={() =>
                      handleToggleVisibility(item)
                    }
                    disabled={!canManageGallery || saving}
                  >
                    {item.is_visible
                      ? "Hide Image"
                      : "Show Image"}
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default Gallery;

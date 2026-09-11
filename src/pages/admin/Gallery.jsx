import { useEffect, useState } from "react";
import {
  createGalleryItem,
  getAdminGallery,
  updateGalleryItem,
} from "../../services/adminService";

function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    image_url: "",
    caption: "",
    display_order: 1,
  });

  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadGallery();
  }, []);

  async function loadGallery() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminGallery();

      setGallery(data);
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

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

     if (editingId) {
  const updatedItem = await updateGalleryItem(
    editingId,
    {
      image_url: form.image_url.trim(),
      caption: form.caption.trim(),
      display_order: Number(form.display_order),
    }
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

  setEditingId(null);

  setForm({
    image_url: "",
    caption: "",
    display_order: gallery.length + 1,
  });
} else {
  const newItem = await createGalleryItem({
    festival_id: gallery[0]?.festival_id,
    image_url: form.image_url.trim(),
    caption: form.caption.trim(),
    display_order: Number(form.display_order),
    is_visible: true,
  });

  setGallery((currentGallery) =>
    [...currentGallery, newItem].sort(
      (a, b) =>
        a.display_order - b.display_order
    )
  );

  setForm({
    image_url: "",
    caption: "",
    display_order: gallery.length + 2,
  });
}
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleVisibility(item) {
    try {
      setError("");

      const updatedItem = await updateGalleryItem(item.id, {
        is_visible: !item.is_visible,
      });

      setGallery((currentGallery) =>
        currentGallery.map((galleryItem) =>
          galleryItem.id === updatedItem.id
            ? updatedItem
            : galleryItem
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(item) {
  setEditingId(item.id);

  setForm({
    image_url: item.image_url,
    caption: item.caption || "",
    display_order: item.display_order || 1,
  });
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
            Manage the images displayed in the festival
            gallery.
          </p>
        </div>
      </div>

      {error && (
        <div className="admin-message">
          {error}
        </div>
      )}

      <form
        className="admin-form"
        onSubmit={handleSubmit}
      >
       <h2>
  {editingId ? "Edit Gallery Image" : "Add Gallery Image"}
</h2>

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
            disabled={saving}
          >
           {saving
  ? "Saving..."
  : editingId
    ? "Save Changes"
    : "Add Image"}
          </button>
        </div>
      </form>

    <div className="admin-gallery-list">
  {gallery.map((item) => (
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
              {item.caption ||
                "Untitled Image"}
            </h2>

            <p className="admin-gallery-card-meta">
              Display Order:{" "}
              {item.display_order}
            </p>
          </div>

          <span className="admin-gallery-status">
            {item.is_visible
              ? "VISIBLE"
              : "HIDDEN"}
          </span>
        </div>

        <div className="admin-gallery-card-actions">
          <button
            type="button"
            className="admin-secondary-button"
            onClick={() =>
              handleEdit(item)
            }
          >
            Edit
          </button>

          <button
            type="button"
            className="admin-secondary-button"
            onClick={() =>
              handleToggleVisibility(item)
            }
          >
            {item.is_visible
              ? "Hide Image"
              : "Show Image"}
          </button>
        </div>
      </div>
    </article>
  ))}
</div>
    </div>
  );
}

export default Gallery;
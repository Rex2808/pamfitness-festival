
import { useEffect, useState } from "react";

import {
  createFaq,
  getAdminFaqs,
  updateFaq,
} from "../../services/adminService";

import { supabase } from "../../lib/supabase";

function Faqs() {
  const [faqs, setFaqs] = useState([]);
  const [festivalId, setFestivalId] = useState(null);
  const [festivalStatus, setFestivalStatus] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    question: "",
    answer: "",
    display_order: 1,
  });

  const [editingId, setEditingId] = useState(null);

  const canManageFaqs =
    Boolean(festivalId) &&
    !["DRAFT", "ARCHIVED"].includes(festivalStatus);

  useEffect(() => {
    loadFaqs();
  }, []);

  async function loadFaqs() {
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

      // Fetch FAQs belonging only to this festival
      const data = await getAdminFaqs(festival.id);

      setFaqs(data || []);

      setForm({
        question: "",
        answer: "",
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
      question: "",
      answer: "",
      display_order: faqs.length + 1,
    });
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

      if (!canManageFaqs) {
        throw new Error(
          "This festival cannot be edited because it is a draft or archived."
        );
      }

      const question = form.question.trim();
      const answer = form.answer.trim();
      const displayOrder = Number(form.display_order);

      if (!question || !answer) {
        throw new Error(
          "Both question and answer are required."
        );
      }

      if (
        !Number.isInteger(displayOrder) ||
        displayOrder < 1
      ) {
        throw new Error(
          "Display order must be a positive whole number."
        );
      }

      const faqData = {
        question,
        answer,
        display_order: displayOrder,
      };

      if (editingId) {
        const updatedFaq = await updateFaq(
          editingId,
          festivalId,
          faqData
        );

        setFaqs((currentFaqs) =>
          currentFaqs
            .map((faq) =>
              faq.id === updatedFaq.id
                ? updatedFaq
                : faq
            )
            .sort(
              (a, b) =>
                a.display_order - b.display_order
            )
        );

        setSuccess("FAQ updated successfully.");
      } else {
        const newFaq = await createFaq({
          festival_id: festivalId,
          ...faqData,
          is_visible: true,
        });

        setFaqs((currentFaqs) =>
          [...currentFaqs, newFaq].sort(
            (a, b) =>
              a.display_order - b.display_order
          )
        );

        setSuccess("FAQ added successfully.");
      }

      setEditingId(null);

      setForm({
        question: "",
        answer: "",
        display_order: faqs.length + (editingId ? 0 : 2),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(faq) {
    if (!canManageFaqs || saving) return;

    setEditingId(faq.id);

    setForm({
      question: faq.question || "",
      answer: faq.answer || "",
      display_order: faq.display_order || 1,
    });

    setError("");
    setSuccess("");
  }

  async function handleToggleVisibility(faq) {
    if (saving) return;

    try {
      setError("");
      setSuccess("");

      if (!festivalId) {
        throw new Error("No festival is selected.");
      }

      if (!canManageFaqs) {
        throw new Error(
          "This festival cannot be edited because it is a draft or archived."
        );
      }

      setSaving(true);

      const updatedFaq = await updateFaq(
        faq.id,
        festivalId,
        {
          is_visible: !faq.is_visible,
        }
      );

      setFaqs((currentFaqs) =>
        currentFaqs.map((currentFaq) =>
          currentFaq.id === updatedFaq.id
            ? updatedFaq
            : currentFaq
        )
      );

      setSuccess(
        updatedFaq.is_visible
          ? "FAQ is now visible on the public website."
          : "FAQ has been hidden from the public website."
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    resetForm();
    setError("");
  }

  if (loading) {
    return <p>Loading FAQs...</p>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <span className="admin-topbar-label">
            FESTIVAL CONTENT
          </span>

          <h1>FAQs</h1>

          <p>
            Manage frequently asked questions for the
            selected festival edition.
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

      {!canManageFaqs && (
        <div className="admin-message">
          This festival is{" "}
          {festivalStatus?.toLowerCase() || "unavailable"}.
          FAQs are available for viewing, but editing is disabled.
        </div>
      )}

      <form
        className="admin-form"
        onSubmit={handleSubmit}
      >
        <h2>
          {editingId ? "Edit FAQ" : "Add FAQ"}
        </h2>

        <fieldset
          disabled={!canManageFaqs || saving}
          style={{
            border: "none",
            padding: 0,
            margin: 0,
          }}
        >
          <div className="admin-form-grid">
            <div className="admin-form-field full-width">
              <label htmlFor="question">
                Question
              </label>

              <input
                id="question"
                name="question"
                type="text"
                value={form.question}
                onChange={handleChange}
                placeholder="Enter the frequently asked question"
                required
              />
            </div>

            <div className="admin-form-field full-width">
              <label htmlFor="answer">
                Answer
              </label>

              <textarea
                id="answer"
                name="answer"
                value={form.answer}
                onChange={handleChange}
                placeholder="Enter the answer"
                rows="5"
                required
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
              disabled={saving || !canManageFaqs}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Save Changes"
                  : "Add FAQ"}
            </button>

            {editingId && (
              <button
                type="button"
                className="admin-secondary-button"
                onClick={handleCancelEdit}
                disabled={saving}
              >
                Cancel
              </button>
            )}
          </div>
        </fieldset>
      </form>

      <div className="admin-faq-list">
        {faqs.length === 0 ? (
          <div className="admin-message">
            No FAQs found for this festival.
          </div>
        ) : (
          faqs.map((faq) => (
            <article
              className="admin-faq-card"
              key={faq.id}
            >
              <div className="admin-faq-card-header">
                <div>
                  <h2>{faq.question}</h2>

                  <p className="admin-faq-meta">
                    Display Order: {faq.display_order}
                  </p>
                </div>

                <span className="admin-faq-status">
                  {faq.is_visible ? "VISIBLE" : "HIDDEN"}
                </span>
              </div>

              <p className="admin-faq-answer">
                {faq.answer}
              </p>

              <div className="admin-faq-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={() => handleEdit(faq)}
                  disabled={!canManageFaqs || saving}
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={() => handleToggleVisibility(faq)}
                  disabled={!canManageFaqs || saving}
                >
                  {faq.is_visible
                    ? "Hide FAQ"
                    : "Show FAQ"}
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default Faqs;

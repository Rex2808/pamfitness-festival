import { useEffect, useState } from "react";
import {
  createFaq,
  getAdminFaqs,
  updateFaq,
} from "../../services/adminService";

function Faqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    question: "",
    answer: "",
    display_order: 1,
  });

  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadFaqs();
  }, []);

  async function loadFaqs() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminFaqs();

      setFaqs(data);
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
        const updatedFaq = await updateFaq(
          editingId,
          {
            question: form.question.trim(),
            answer: form.answer.trim(),
            display_order: Number(
              form.display_order
            ),
          }
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
                a.display_order -
                b.display_order
            )
        );

        setEditingId(null);
      } else {
        const newFaq = await createFaq({
          festival_id: faqs[0]?.festival_id,
          question: form.question.trim(),
          answer: form.answer.trim(),
          display_order: Number(
            form.display_order
          ),
          is_visible: true,
        });

        setFaqs((currentFaqs) =>
          [...currentFaqs, newFaq].sort(
            (a, b) =>
              a.display_order -
              b.display_order
          )
        );
      }

      setForm({
        question: "",
        answer: "",
        display_order: faqs.length + 1,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(faq) {
    setEditingId(faq.id);

    setForm({
      question: faq.question || "",
      answer: faq.answer || "",
      display_order: faq.display_order || 1,
    });
  }

  async function handleToggleVisibility(faq) {
    try {
      setError("");

      const updatedFaq = await updateFaq(
        faq.id,
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
    } catch (err) {
      setError(err.message);
    }
  }

  function handleCancelEdit() {
    setEditingId(null);

    setForm({
      question: "",
      answer: "",
      display_order: faqs.length + 1,
    });
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
            Manage the frequently asked questions
            displayed on the festival website.
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
          {editingId
            ? "Edit FAQ"
            : "Add FAQ"}
        </h2>

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
      </form>

     <div className="admin-faq-list">
  {faqs.map((faq) => (
    <article
      className="admin-faq-card"
      key={faq.id}
    >
      <div className="admin-faq-card-header">
        <div>
          <h2>{faq.question}</h2>

          <p className="admin-faq-meta">
            Display Order:{" "}
            {faq.display_order}
          </p>
        </div>

        <span className="admin-faq-status">
          {faq.is_visible
            ? "VISIBLE"
            : "HIDDEN"}
        </span>
      </div>

      <p className="admin-faq-answer">
        {faq.answer}
      </p>

      <div className="admin-faq-actions">
        <button
          type="button"
          className="admin-secondary-button"
          onClick={() =>
            handleEdit(faq)
          }
        >
          Edit
        </button>

        <button
          type="button"
          className="admin-secondary-button"
          onClick={() =>
            handleToggleVisibility(faq)
          }
        >
          {faq.is_visible
            ? "Hide FAQ"
            : "Show FAQ"}
        </button>
      </div>
    </article>
  ))}
</div>
    </div>
  );
}

export default Faqs;
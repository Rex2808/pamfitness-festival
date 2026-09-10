import { useEffect, useState } from "react";
import { createVestOrder } from "../services/vestService";

function VestSection({ festival }) {
  const whatsappNumber = festival.whatsapp;

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    quantity: 1,
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [timeLeft, setTimeLeft] = useState(
    24 * 60 * 60
  );

  const vestPrice = Number(festival.vest_price);

  const totalAmount =
    Number(formData.quantity) * vestPrice;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((previousTime) =>
        previousTime <= 1
          ? 24 * 60 * 60
          : previousTime - 1
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

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
    setError("");
    setSuccess(false);

    try {
      await createVestOrder({
        festival_id: festival.id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        quantity: Number(formData.quantity),
        unit_price: vestPrice,
        total_amount: totalAmount,
        status: "PENDING",
      });

      const message = [
        `Hello PAMFITNESS Festival team.`,
        ``,
        `I would like to order PAMFITNESS Festival vest(s).`,
        ``,
        `Name: ${formData.first_name} ${formData.last_name}`,
        `Phone: ${formData.phone}`,
        `Quantity: ${formData.quantity}`,
        `Price per vest: ₦${vestPrice.toLocaleString()}`,
        `Total: ₦${totalAmount.toLocaleString()}`,
        ``,
        `Please send me the payment and collection details.`,
      ].join("\n");

      const whatsappUrl =
        `https://wa.me/${whatsappNumber}?text=` +
        encodeURIComponent(message);

      setSuccess(true);

      window.open(whatsappUrl, "_blank");

      setFormData({
        first_name: "",
        last_name: "",
        phone: "",
        quantity: 1,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="vest-section" id="vest">
      <div className="section-container">
        <div className="vest-content">
          <div className="vest-visual">
            <img
              src="/images/pamfitness-vests-3d.png"
              alt="PAMFITNESS Festival official vest designs"
            />
          </div>

          <div className="vest-copy">
            <p className="section-eyebrow">
              OFFICIAL FESTIVAL VEST
            </p>

            <div className="vest-promo">
              <strong>🔥 LIMITED-TIME OFFER</strong>

              <div className="vest-promo-timer-label">
                PROMO ENDS IN
              </div>

              <div className="vest-promo-timer">
                <span>
                  {String(hours).padStart(2, "0")}
                </span>
                <b>:</b>
                <span>
                  {String(minutes).padStart(2, "0")}
                </span>
                <b>:</b>
                <span>
                  {String(seconds).padStart(2, "0")}
                </span>
              </div>

              <small>
                HURRY — SECURE YOUR OFFICIAL FESTIVAL
                VEST AT THE PROMOTIONAL PRICE.
              </small>
            </div>

            <h2>
              WEAR THE
              <span> EXPERIENCE.</span>
            </h2>

            <p>
              Get your official {festival.name} vest
              and be part of the movement.
            </p>

            <div className="vest-price">
              <span>
                ₦{vestPrice.toLocaleString()}
              </span>

              <del>₦12,000</del>

              <small>PER VEST</small>
            </div>

            <p className="vest-savings">
              SAVE ₦2,000
            </p>

            <p className="vest-note">
              Payment and collection details will be handled
              through WhatsApp.
            </p>
          </div>

          <form
            className="vest-form"
            onSubmit={handleSubmit}
          >
            <div className="form-field">
              <label htmlFor="vest-first-name">
                First Name *
              </label>

              <input
                id="vest-first-name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                required
                placeholder="Your first name"
              />
            </div>

            <div className="form-field">
              <label htmlFor="vest-last-name">
                Last Name *
              </label>

              <input
                id="vest-last-name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                required
                placeholder="Your last name"
              />
            </div>

            <div className="form-field">
              <label htmlFor="vest-phone">
                Phone Number *
              </label>

              <input
                id="vest-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="08123456789"
              />
            </div>

            <div className="form-field">
              <label htmlFor="vest-quantity">
                Quantity
              </label>

              <input
                id="vest-quantity"
                name="quantity"
                type="number"
                min="1"
                max="20"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="vest-total">
              <span>TOTAL</span>

              <strong>
                ₦{totalAmount.toLocaleString()}
              </strong>
            </div>

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            {success && (
              <div className="vest-success">
                Order recorded. WhatsApp has been opened
                with your order details.
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary vest-submit"
              disabled={submitting}
            >
              {submitting
                ? "PROCESSING..."
                : "ORDER VEST VIA WHATSAPP"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default VestSection;
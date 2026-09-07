import { useState } from "react";
import { createVendorApplication } from "../services/vendorService";




function VendorSection({ festival }) {

const whatsappNumber = festival.whatsapp;
const vendorPrice = Number(festival.vendor_price);


  const [formData, setFormData] = useState({
    business_name: "",
    contact_name: "",
    phone: "",
    email: "",
    category: "",
    description: "",
    website_or_social: "",
    number_of_stands: 1,
  });

    
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const totalAmount =
    Number(formData.number_of_stands) * vendorPrice;

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
      await createVendorApplication({
        festival_id: festival.id,
        business_name: formData.business_name,
        contact_name: formData.contact_name,
        phone: formData.phone,
        email: formData.email || null,
        category: formData.category || null,
        description: formData.description || null,
        website_or_social: formData.website_or_social || null,
        number_of_stands: Number(formData.number_of_stands),
        unit_price: vendorPrice,
        total_amount: totalAmount,
        status: "PENDING",
      });

      const message = [
        `Hello PAMFITNESS Festival team.`,
        ``,
        `I would like to apply for a vendor stand at ${festival.name}.`,
        ``,
        `Business: ${formData.business_name}`,
        `Contact Person: ${formData.contact_name}`,
        `Phone: ${formData.phone}`,
        `Email: ${formData.email || "Not provided"}`,
        `Category: ${formData.category || "Not specified"}`,
        `Number of Stands: ${formData.number_of_stands}`,
        `Price per Stand: ₦${vendorPrice.toLocaleString()}`,
        `Total: ₦${totalAmount.toLocaleString()}`,
        ``,
        `Description: ${formData.description || "Not provided"}`,
        `Website/Social: ${formData.website_or_social || "Not provided"}`,
        ``,
        `Please send me the payment and vendor confirmation details.`,
      ].join("\n");

      const whatsappUrl =
       `https://wa.me/${whatsappNumber}?text=` +
        encodeURIComponent(message);

      setSuccess(true);

      window.open(whatsappUrl, "_blank");

      setFormData({
        business_name: "",
        contact_name: "",
        phone: "",
        email: "",
        category: "",
        description: "",
        website_or_social: "",
        number_of_stands: 1,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="vendor-section" id="vendors">
      <div className="section-container">
        <div className="vendor-content">
          <div className="vendor-copy">
            <p className="section-eyebrow">
              BECOME A VENDOR
            </p>

            <h2>
              BRING YOUR
              <span> BRAND.</span>
            </h2>

            <p>
              Put your business in front of the PAMFITNESS
              Festival community and connect with people
              passionate about fitness, wellness and healthy
              living.
            </p>

            <div className="vendor-price">
              <span>₦{vendorPrice.toLocaleString()}</span>
              <small>PER STAND</small>
            </div>

            <p className="vendor-note">
              Submit your application and we'll continue the
              confirmation and payment process through WhatsApp.
            </p>
          </div>

          <form
            className="vendor-form"
            onSubmit={handleSubmit}
          >
            <div className="form-field">
              <label htmlFor="business-name">
                Business Name *
              </label>

              <input
                id="business-name"
                name="business_name"
                type="text"
                value={formData.business_name}
                onChange={handleChange}
                required
                placeholder="Your business name"
              />
            </div>

            <div className="form-field">
              <label htmlFor="contact-name">
                Contact Person *
              </label>

              <input
                id="contact-name"
                name="contact_name"
                type="text"
                value={formData.contact_name}
                onChange={handleChange}
                required
                placeholder="Full name"
              />
            </div>

            <div className="vendor-form-grid">
              <div className="form-field">
                <label htmlFor="vendor-phone">
                  Phone *
                </label>

                <input
                  id="vendor-phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="08123456789"
                />
              </div>

              <div className="form-field">
                <label htmlFor="vendor-email">
                  Email
                </label>

                <input
                  id="vendor-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="business@example.com"
                />
              </div>
            </div>

            <div className="vendor-form-grid">
              <div className="form-field">
                <label htmlFor="vendor-category">
                  Vendor Category
                </label>

                <select
                  id="vendor-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">
                    Select category
                  </option>
                  <option value="Fitness">
                    Fitness
                  </option>
                  <option value="Health & Wellness">
                    Health & Wellness
                  </option>
                  <option value="Nutrition">
                    Nutrition
                  </option>
                  <option value="Fashion">
                    Fashion
                  </option>
                  <option value="Beauty">
                    Beauty
                  </option>
                  <option value="Food & Beverage">
                    Food & Beverage
                  </option>
                  <option value="Lifestyle">
                    Lifestyle
                  </option>
                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="number-of-stands">
                  Number of Stands
                </label>

                <input
                  id="number-of-stands"
                  name="number_of_stands"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.number_of_stands}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="vendor-description">
                What does your business offer?
              </label>

              <textarea
                id="vendor-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Tell us briefly about your products or services..."
              />
            </div>

            <div className="form-field">
              <label htmlFor="website-social">
                Website / Social Media
              </label>

              <input
                id="website-social"
                name="website_or_social"
                type="text"
                value={formData.website_or_social}
                onChange={handleChange}
                placeholder="@yourbusiness or website"
              />
            </div>

            <div className="vendor-total">
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
              <div className="vendor-success">
                Application recorded. WhatsApp has been opened
                with your vendor details.
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary vendor-submit"
              disabled={submitting}
            >
              {submitting
                ? "PROCESSING..."
                : "APPLY VIA WHATSAPP"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default VendorSection;
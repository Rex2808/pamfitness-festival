import { useEffect, useState } from "react";
import { registerAttendee } from "../services/attendeeService";

function RegistrationSection({ festival }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    age_range: "",
    gender: "",
    interests: [],
    source: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  if (success) {
    document
      .getElementById("register")
      ?.scrollIntoView({ behavior: "smooth" });
  }
}, [success]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleInterestChange(event) {
    const { value, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      interests: checked
        ? [...previous.interests, value]
        : previous.interests.filter((interest) => interest !== value),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      await registerAttendee({
        festival_id: festival.id,
        ...formData,
      });

      setSuccess(true);

      setFormData({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        age_range: "",
        gender: "",
        interests: [],
        source: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <section className="registration-section" id="register">
        <div className="section-container">
          <div className="registration-success">
            <p className="section-eyebrow">REGISTRATION COMPLETE</p>

            <h2>
              YOU'RE
              <span> IN.</span>
            </h2>

            <p>
              Your registration for {festival.name} has been received.
            </p>

            <p>
              Entry to the festival is FREE. Keep an eye on your
              phone and email for festival updates.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setSuccess(false)}
            >
              REGISTER ANOTHER PERSON
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="registration-section" id="register">
      <div className="section-container">
        <div className="registration-header">
          <p className="section-eyebrow">COMPULSORY REGISTRATION</p>

          <h2>
            JOIN THE
            <span> EXPERIENCE.</span>
          </h2>

          <p>
           Entry is completely FREE, but registration is compulsory.
           Register to receive festival updates and stay connected
           with the PAMFITNESS community.
          </p>
        </div>

        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="first_name">
                First Name *
              </label>

              <input
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                required
                placeholder="Your first name"
              />
            </div>

            <div className="form-field">
              <label htmlFor="last_name">
                Last Name *
              </label>

              <input
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                required
                placeholder="Your last name"
              />
            </div>

            <div className="form-field">
              <label htmlFor="phone">
                Phone Number *
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="08123456789"
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>

            <div className="form-field">
              <label htmlFor="age_range">
                Age Range
              </label>

              <select
                id="age_range"
                name="age_range"
                value={formData.age_range}
                onChange={handleChange}
              >
                <option value="">Select age range</option>
                <option value="Under 18">Under 18</option>
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45-54">45-54</option>
                <option value="55+">55+</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="gender">
                Gender
              </label>

              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <fieldset className="form-fieldset">
            <legend>What are you interested in?</legend>

            <div className="interest-grid">
              {[
                "Fitness",
                "Wellness",
                "Nutrition",
                "Marathon",
                "Yoga",
                "Networking",
                "Games",
              ].map((interest) => (
                <label
                  className="interest-option"
                  key={interest}
                >
                  <input
                    type="checkbox"
                    value={interest}
                    checked={formData.interests.includes(interest)}
                    onChange={handleInterestChange}
                  />

                  <span>{interest}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="form-field">
            <label htmlFor="source">
              How did you hear about the festival?
            </label>

            <select
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
            >
              <option value="">Select one</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="TikTok">TikTok</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="YouTube">YouTube</option>
              <option value="Google">Google</option>
              <option value="Friend">Friend / Family</option>
              <option value="Gym">PAMFITNESS Gym</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <p className="registration-consent">
            By registering, you agree that PAMFITNESS may use your
            contact details to send you festival-related updates
            and information.
          </p>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary registration-submit"
            disabled={submitting}
          >
            {submitting
              ? "SUBMITTING..."
              : "REGISTER FOR FREE"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default RegistrationSection;
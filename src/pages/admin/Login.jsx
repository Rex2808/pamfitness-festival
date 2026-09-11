import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setError(error.message);
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    navigate("/admin");
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <div className="admin-login-mark">
            TL
          </div>

          <div>
            <p className="admin-login-brand-name">
              TrakLabs
            </p>

            <p className="admin-login-brand-subtitle">
              FESTIVAL MANAGEMENT
            </p>
          </div>
        </div>

        <div className="admin-login-header">
          <p className="admin-login-eyebrow">
            PAMFITNESS FESTIVAL 2026
          </p>

          <h1>Admin Portal</h1>

          <p>
            Sign in to manage your festival.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="admin-login-form"
        >
          <div className="admin-login-field">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="admin@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="admin-login-field">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={submitting}
          >
            {submitting
              ? "SIGNING IN..."
              : "SIGN IN"}
          </button>
        </form>

        <div className="admin-login-footer">
          POWERED BY <strong>TrakLabs</strong>
        </div>
      </div>
    </main>
  );
}

export default Login;
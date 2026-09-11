import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function InviteSetup() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkInviteSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setError(
          "This invitation link is invalid or has expired."
        );
        setLoading(false);
        return;
      }

      setUser(session.user);
      setLoading(false);
    }

    checkInviteSession();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);

    try {
      const { error: updateError } =
        await supabase.auth.updateUser({
          password,
        });

      if (updateError) {
        throw updateError;
      }

      setMessage(
        "Password created successfully. Redirecting to the admin portal..."
      );

      setTimeout(() => {
        navigate("/admin", { replace: true });
      }, 1200);
    } catch (err) {
      setError(
        err.message ||
          "Unable to create your password."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-settings-message">
          Verifying invitation...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">
            ACCOUNT SETUP
          </p>

          <h1>Set Your Password</h1>

          <p>
            Complete your festival administration
            account setup.
          </p>
        </div>
      </div>

      <div className="admin-settings-form">
        <section className="admin-settings-section">
          <h2>Welcome</h2>

          {user?.email && (
            <p className="admin-settings-hint">
              Account: {user.email}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="admin-settings-grid"
          >
            <div className="admin-settings-field full-width">
              <label htmlFor="password">
                New Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                minLength={8}
                required
              />
            </div>

            <div className="admin-settings-field full-width">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                placeholder="Confirm your password"
                minLength={8}
                required
              />
            </div>

            <div className="admin-settings-actions full-width">
              <button
                type="submit"
                className="admin-settings-save"
                disabled={saving}
              >
                {saving
                  ? "Creating Password..."
                  : "Create Password"}
              </button>
            </div>
          </form>
        </section>

        {message && (
          <div className="admin-settings-message">
            {message}
          </div>
        )}

        {error && (
          <div className="admin-settings-message">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default InviteSetup;
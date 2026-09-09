import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { supabase } from "../../lib/supabase";

function Topbar() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        setEmail(user.email);
      }
    }

    loadUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  return (
    <header className="admin-topbar">
      <div>
        <span className="admin-topbar-label">ADMIN PORTAL</span>
        <h2>Dashboard</h2>
      </div>

      <div className="admin-topbar-actions">
        <div className="admin-user">
          <span className="admin-user-name">
            {email || "Administrator"}
          </span>

          <span className="admin-user-role">
            TrakLabs Admin
          </span>
        </div>

        <button type="button" onClick={handleLogout}>
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Topbar;
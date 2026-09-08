import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

function ProtectedAdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAuthorization() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("admin_users")
        .select("id, role, festival_id")
        .eq("user_id", user.id)
        .single();

      if (!error && data) {
        setAuthorized(true);
      }

      setLoading(false);
    }

    checkAuthorization();
  }, []);

  if (loading) {
    return <div>Checking admin access...</div>;
  }

  if (!authorized) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;
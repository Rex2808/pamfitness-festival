
import { useEffect, useState } from "react";

import {
  getAdminAttendees,
  getAdminVendors,
  getAdminVestOrders,
  getCurrentAdminProfile,
} from "../../services/adminService";

import { supabase } from "../../lib/supabase";

import StatCard from "../../components/admin/StatCard";

import {
  Users,
  Store,
  Shirt,
} from "lucide-react";

function Dashboard() {
  const [attendees, setAttendees] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vestOrders, setVestOrders] = useState([]);

  const [festival, setFestival] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        setError("");

        const adminProfile = await getCurrentAdminProfile();

        if (!adminProfile) {
          throw new Error("Admin profile not found.");
        }

        let festivalId = adminProfile.festival_id;
        let selectedFestival;

        if (adminProfile.role === "PLATFORM_ADMIN") {
          const { data, error: festivalError } = await supabase
            .from("festivals")
            .select("id, name, year, status")
            .eq("is_current", true)
            .eq("is_active", true)
            .single();

          if (festivalError) throw festivalError;

          selectedFestival = data;
          festivalId = data.id;
        } else {
          if (!festivalId) {
            throw new Error(
              "No festival is assigned to this admin account."
            );
          }

          const { data, error: festivalError } = await supabase
            .from("festivals")
            .select("id, name, year, status")
            .eq("id", festivalId)
            .single();

          if (festivalError) throw festivalError;

          selectedFestival = data;
        }

        const [
          attendeeData,
          vendorData,
          vestOrderData,
        ] = await Promise.all([
          getAdminAttendees(festivalId),
          getAdminVendors(festivalId),
          getAdminVestOrders(festivalId),
        ]);

        setFestival(selectedFestival);
        setAttendees(attendeeData || []);
        setVendors(vendorData || []);
        setVestOrders(vestOrderData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return <main>Loading dashboard...</main>;
  }

  if (error) {
    return (
      <main>
        <h1>TrakLabs Admin Dashboard</h1>
        <p>Failed to load dashboard: {error}</p>
      </main>
    );
  }

  return (
    <main>
      <div className="admin-page-header">
        <div>
          <span className="admin-topbar-label">
            FESTIVAL OVERVIEW
          </span>

          <h1>TrakLabs Admin Dashboard</h1>

          <p>
            You are authorized to access the admin area.
          </p>

          {festival && (
            <>
              <p>
                Festival: <strong>{festival.name}</strong>
              </p>

              <p>
                Festival status: <strong>{festival.status}</strong>
              </p>
            </>
          )}
        </div>
      </div>

      <div className="admin-stats-grid">
        <StatCard
          title="ATTENDEES"
          value={attendees.length}
          description="Total registrations"
          icon={Users}
        />

        <StatCard
          title="VENDORS"
          value={vendors.length}
          description="Vendor applications"
          icon={Store}
        />

        <StatCard
          title="VEST ORDERS"
          value={vestOrders.length}
          description="Total vest orders"
          icon={Shirt}
        />
      </div>
    </main>
  );
}

export default Dashboard;

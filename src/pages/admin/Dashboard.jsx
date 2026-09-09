import { useEffect, useState } from "react";
import {
  getAdminAttendees,
  getAdminVendors,
  getAdminVestOrders,
} from "../../services/adminService";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [attendeeData, vendorData, vestOrderData] =
          await Promise.all([
            getAdminAttendees(),
            getAdminVendors(),
            getAdminVestOrders(),
          ]);

        setAttendees(attendeeData);
        setVendors(vendorData);
        setVestOrders(vestOrderData);
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
      <h1>TrakLabs Admin Dashboard</h1>

      <p>You are authorized to access the admin area.</p>

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
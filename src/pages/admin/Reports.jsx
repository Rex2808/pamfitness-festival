
import { useEffect, useState } from "react";
import {
  getAdminReportSummary,
  getCurrentAdminProfile,
} from "../../services/adminService";
import { supabase } from "../../lib/supabase";

function Reports() {
  const [report, setReport] = useState(null);
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {
    try {
      setLoading(true);
      setError("");

      const adminProfile = await getCurrentAdminProfile();

      if (!adminProfile) {
        throw new Error("Admin profile not found.");
      }

      let festivalId = adminProfile.festival_id;

      // Platform Admins use the current homepage festival.
      if (adminProfile.role === "PLATFORM_ADMIN") {
        const { data: currentFestival, error: festivalError } =
          await supabase
            .from("festivals")
            .select("id, name, year, status")
            .eq("is_current", true)
            .eq("is_active", true)
            .single();

        if (festivalError) throw festivalError;

        festivalId = currentFestival.id;
        setFestival(currentFestival);
      } else {
        // Other admins use their assigned festival.
        if (!festivalId) {
          throw new Error(
            "No festival is assigned to this admin account."
          );
        }

        const { data: assignedFestival, error: festivalError } =
          await supabase
            .from("festivals")
            .select("id, name, year, status")
            .eq("id", festivalId)
            .single();

        if (festivalError) throw festivalError;

        setFestival(assignedFestival);
      }

      const reportData = await getAdminReportSummary(festivalId);

      setReport(reportData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(amount) {
    return `₦${Number(amount || 0).toLocaleString()}`;
  }

  if (loading) {
    return <p>Loading reports...</p>;
  }

  if (error) {
    return (
      <div className="admin-message">
        Failed to load reports: {error}
      </div>
    );
  }

  if (!report || !festival) {
    return (
      <div className="admin-message">
        No report data available.
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <span className="admin-topbar-label">
            FESTIVAL ANALYTICS
          </span>

          <h1>Reports</h1>

          <p>
            Overview of registrations, attendance,
            vendors, vest orders and confirmed revenue.
          </p>

          <p>
            Festival: <strong>{festival.name}</strong>
          </p>

          <p>
            Festival status: <strong>{festival.status}</strong>
          </p>
        </div>
      </div>

      <section className="admin-report-section">
        <div className="admin-report-section-header">
          <div>
            <h2>Registrations & Attendance</h2>
            <p>
              Monitor festival registrations and attendance activity.
            </p>
          </div>
        </div>

        <div className="admin-report-grid">
          <div className="admin-report-card">
            <span>Total Registrations</span>
            <strong>{report.attendees.total}</strong>
          </div>

          <div className="admin-report-card">
            <span>Checked In</span>
            <strong>{report.attendees.checkedIn}</strong>
          </div>

          <div className="admin-report-card">
            <span>Not Checked In</span>
            <strong>{report.attendees.notCheckedIn}</strong>
          </div>

          <div className="admin-report-card">
            <span>Attendance Rate</span>
            <strong>
              {report.attendees.attendanceRate.toFixed(1)}%
            </strong>
          </div>
        </div>
      </section>

      <section className="admin-report-section">
        <div className="admin-report-section-header">
          <div>
            <h2>Vendor Applications</h2>
            <p>
              Track vendor applications and their approval status.
            </p>
          </div>
        </div>

        <div className="admin-report-grid">
          <div className="admin-report-card">
            <span>Total Applications</span>
            <strong>{report.vendors.total}</strong>
          </div>

          <div className="admin-report-card">
            <span>Pending</span>
            <strong>{report.vendors.pending}</strong>
          </div>

          <div className="admin-report-card">
            <span>Approved</span>
            <strong>{report.vendors.approved}</strong>
          </div>

          <div className="admin-report-card">
            <span>Rejected</span>
            <strong>{report.vendors.rejected}</strong>
          </div>

          <div className="admin-report-card admin-report-card-wide">
            <span>Approved Vendor Revenue</span>
            <strong>{formatCurrency(report.vendors.revenue)}</strong>
          </div>
        </div>
      </section>

      <section className="admin-report-section">
        <div className="admin-report-section-header">
          <div>
            <h2>Festival Vest Orders</h2>
            <p>
              Track vest orders and confirmed vest revenue.
            </p>
          </div>
        </div>

        <div className="admin-report-grid">
          <div className="admin-report-card">
            <span>Total Orders</span>
            <strong>{report.vestOrders.total}</strong>
          </div>

          <div className="admin-report-card">
            <span>Pending</span>
            <strong>{report.vestOrders.pending}</strong>
          </div>

          <div className="admin-report-card">
            <span>Approved</span>
            <strong>{report.vestOrders.approved}</strong>
          </div>

          <div className="admin-report-card">
            <span>Rejected</span>
            <strong>{report.vestOrders.rejected}</strong>
          </div>

          <div className="admin-report-card admin-report-card-wide">
            <span>Approved Vest Revenue</span>
            <strong>{formatCurrency(report.vestOrders.revenue)}</strong>
          </div>
        </div>
      </section>

      <section className="admin-report-total">
        <div>
          <span>Total Confirmed Revenue</span>
          <p>
            Approved vendor and vest revenue combined.
          </p>
        </div>

        <strong>
          {formatCurrency(report.totalConfirmedRevenue)}
        </strong>
      </section>
    </div>
  );
}

export default Reports;

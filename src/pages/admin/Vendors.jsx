
import { useEffect, useState } from "react";

import {
  getAdminVendors,
} from "../../services/adminService";

import { supabase } from "../../lib/supabase";

import DataTable from "../../components/admin/DataTable";
import VendorDetails from "../../components/admin/VendorDetails";

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [festivalId, setFestivalId] = useState(null);
  const [festivalStatus, setFestivalStatus] = useState(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);

  const canManageVendors =
    Boolean(festivalId) &&
    !["DRAFT", "ARCHIVED"].includes(festivalStatus);

  useEffect(() => {
    async function loadVendors() {
      try {
        setLoading(true);
        setError("");

        // Get authenticated user
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (!user) {
          throw new Error("You are not authenticated.");
        }

        // Get administrator profile
        const { data: adminUser, error: adminError } =
          await supabase
            .from("admin_users")
            .select("role, festival_id")
            .eq("user_id", user.id)
            .single();

        if (adminError) throw adminError;

        // Resolve the festival for this administrator
        let festivalQuery = supabase
          .from("festivals")
          .select("id, name, status");

        if (adminUser.role === "PLATFORM_ADMIN") {
          festivalQuery = festivalQuery.eq(
            "is_current",
            true
          );
        } else if (adminUser.festival_id) {
          festivalQuery = festivalQuery.eq(
            "id",
            adminUser.festival_id
          );
        } else {
          throw new Error(
            "Your administrator account has no assigned festival."
          );
        }

        const {
          data: festival,
          error: festivalError,
        } = await festivalQuery.single();

        if (festivalError) throw festivalError;

        if (!festival) {
          throw new Error("No festival was found.");
        }

        setFestivalId(festival.id);
        setFestivalStatus(festival.status);

        // Load only vendors belonging to this festival
        const data = await getAdminVendors(festival.id);

        setVendors(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadVendors();
  }, []);

  const filteredVendors = vendors.filter((vendor) => {
    const searchTerm = search.toLowerCase();

    return (
      (vendor.business_name || "")
        .toLowerCase()
        .includes(searchTerm) ||
      (vendor.contact_name || "")
        .toLowerCase()
        .includes(searchTerm) ||
      (vendor.phone || "")
        .toLowerCase()
        .includes(searchTerm) ||
      (vendor.email || "")
        .toLowerCase()
        .includes(searchTerm) ||
      (vendor.category || "")
        .toLowerCase()
        .includes(searchTerm)
    );
  });

  const vendorColumns = [
    {
      key: "business_name",
      label: "Business",
    },
    {
      key: "contact_name",
      label: "Contact",
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "category",
      label: "Category",
      render: (vendor) => vendor.category || "—",
    },
    {
      key: "number_of_stands",
      label: "Stands",
    },
    {
      key: "total_amount",
      label: "Amount",
      render: (vendor) =>
        `₦${Number(
          vendor.total_amount || 0
        ).toLocaleString()}`,
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "actions",
      label: "Action",
      render: (vendor) => (
        <button
          type="button"
          onClick={() => setSelectedVendor(vendor)}
        >
          View
        </button>
      ),
    },
  ];

  if (loading) {
    return <p>Loading vendors...</p>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <span className="admin-topbar-label">
            FESTIVAL MANAGEMENT
          </span>

          <h1>Vendors</h1>

          <p>
            Manage vendor applications for the selected festival edition.
          </p>

          {festivalStatus && (
            <p>
              Festival status:{" "}
              <strong>{festivalStatus}</strong>
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="admin-message">
          Failed to load vendors: {error}
        </div>
      )}

      {!canManageVendors && !error && (
        <div className="admin-message">
          This festival is {festivalStatus?.toLowerCase()}.
          Vendor applications are available for viewing,
          but status changes are disabled.
        </div>
      )}

      {!error && (
        <>
          <div className="admin-search">
            <input
              type="search"
              placeholder="Search by business, contact, phone, email or category..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <p>
            Total vendor applications: {vendors.length}
          </p>

          <DataTable
            columns={vendorColumns}
            data={filteredVendors}
            emptyMessage="No vendors match your search."
          />
        </>
      )}

      {selectedVendor && (
        <VendorDetails
          vendor={selectedVendor}
          festivalId={festivalId}
          festivalStatus={festivalStatus}
          onClose={() => setSelectedVendor(null)}
          onUpdated={(updatedVendor) => {
            setVendors((currentVendors) =>
              currentVendors.map((vendor) =>
                vendor.id === updatedVendor.id
                  ? updatedVendor
                  : vendor
              )
            );

            setSelectedVendor(updatedVendor);
          }}
        />
      )}
    </div>
  );
}

export default Vendors;

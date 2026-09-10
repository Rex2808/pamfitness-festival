import { useEffect, useState } from "react";
import { getAdminVendors } from "../../services/adminService";
import DataTable from "../../components/admin/DataTable";
import VendorDetails from "../../components/admin/VendorDetails";

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => {
    async function loadVendors() {
      try {
        const data = await getAdminVendors();
        setVendors(data);
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
        `₦${Number(vendor.total_amount).toLocaleString()}`,
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

  

  return (
    <div>
      <h1>Vendors</h1>
      <p>Manage festival vendor applications.</p>

      <div className="admin-search">
        <input
          type="search"
          placeholder="Search by business, contact, phone, email or category..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {loading && <p>Loading vendors...</p>}

      {error && (
        <p>Failed to load vendors: {error}</p>
      )}

      {!loading && !error && (
        <div>
          <p>Total vendor applications: {vendors.length}</p>

          <DataTable
            columns={vendorColumns}
            data={filteredVendors}
            emptyMessage="No vendors match your search."
          />
        </div>
      )}

        {selectedVendor && (
  <VendorDetails
    vendor={selectedVendor}
    onClose={() => setSelectedVendor(null)}
    onUpdated={(updatedVendor) => {
      setVendors((currentVendors) =>
        currentVendors.map((vendor) =>
          vendor.id === updatedVendor.id
            ? updatedVendor
            : vendor
        )
      );
    }}
  />
)}
    </div>
  );
}

export default Vendors;
import { useEffect, useState } from "react";
import { getAdminVestOrders } from "../../services/adminService";
import DataTable from "../../components/admin/DataTable";
import VestOrderDetails from "../../components/admin/VestOrderDetails";

function VestOrders() {
  const [vestOrders, setVestOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    async function loadVestOrders() {
      try {
        const data = await getAdminVestOrders();
        setVestOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadVestOrders();
  }, []);

  const filteredVestOrders = vestOrders.filter((order) => {
    const searchTerm = search.toLowerCase();

    return (
      (order.first_name || "")
        .toLowerCase()
        .includes(searchTerm) ||
      (order.last_name || "")
        .toLowerCase()
        .includes(searchTerm) ||
      (order.phone || "")
        .toLowerCase()
        .includes(searchTerm)
    );
  });

  const vestOrderColumns = [
    {
      key: "name",
      label: "Name",
      render: (order) =>
        `${order.first_name} ${order.last_name}`,
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "quantity",
      label: "Quantity",
    },
    {
      key: "unit_price",
      label: "Unit Price",
      render: (order) =>
        `₦${Number(order.unit_price).toLocaleString()}`,
    },
    {
      key: "total_amount",
      label: "Total",
      render: (order) =>
        `₦${Number(order.total_amount).toLocaleString()}`,
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "created_at",
      label: "Ordered",
      render: (order) =>
        new Date(order.created_at).toLocaleDateString(),
    },

    {
  key: "actions",
  label: "Action",
  render: (order) => (
    <button
      type="button"
      onClick={() => setSelectedOrder(order)}
    >
      View
    </button>
  ),
},
  ];

  return (
    <div>
      <h1>Vest Orders</h1>
      <p>Manage official festival vest orders.</p>

      <div className="admin-search">
        <input
          type="search"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {loading && <p>Loading vest orders...</p>}

      {error && (
        <p>Failed to load vest orders: {error}</p>
      )}

      {!loading && !error && (
        <div>
          <p>Total vest orders: {vestOrders.length}</p>

          <DataTable
            columns={vestOrderColumns}
            data={filteredVestOrders}
            emptyMessage="No vest orders match your search."
          />
        </div>
      )}

      {selectedOrder && (
  <VestOrderDetails
    order={selectedOrder}
    onClose={() => setSelectedOrder(null)}
  />
)}
    </div>
  );
}

export default VestOrders;
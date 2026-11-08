
import { useEffect, useState } from "react";

import {
  getAdminVestOrders,
} from "../../services/adminService";

import { supabase } from "../../lib/supabase";

import DataTable from "../../components/admin/DataTable";
import VestOrderDetails from "../../components/admin/VestOrderDetails";

function VestOrders() {
  const [vestOrders, setVestOrders] = useState([]);
  const [festivalId, setFestivalId] = useState(null);
  const [festivalStatus, setFestivalStatus] = useState(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const canManageOrders =
    Boolean(festivalId) &&
    !["DRAFT", "ARCHIVED"].includes(festivalStatus);

  useEffect(() => {
    async function loadVestOrders() {
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
          festivalQuery = festivalQuery
            .eq("is_current", true)
            .eq("is_active", true);
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

        // Fetch only orders belonging to this festival
        const data = await getAdminVestOrders(festival.id);

        setVestOrders(data || []);
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
        `${order.first_name || ""} ${order.last_name || ""}`.trim() ||
        "—",
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
        `₦${Number(
          order.unit_price || 0
        ).toLocaleString()}`,
    },
    {
      key: "total_amount",
      label: "Total",
      render: (order) =>
        `₦${Number(
          order.total_amount || 0
        ).toLocaleString()}`,
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "created_at",
      label: "Ordered",
      render: (order) =>
        order.created_at
          ? new Date(order.created_at).toLocaleDateString()
          : "—",
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

  if (loading) {
    return <p>Loading vest orders...</p>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <span className="admin-topbar-label">
            FESTIVAL MANAGEMENT
          </span>

          <h1>Vest Orders</h1>

          <p>
            Manage vest orders for the selected festival edition.
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
          Failed to load vest orders: {error}
        </div>
      )}

      {!canManageOrders && !error && (
        <div className="admin-message">
          This festival is {festivalStatus?.toLowerCase()}.
          Vest orders are available for viewing, but status
          changes are disabled.
        </div>
      )}

      {!error && (
        <>
          <div className="admin-search">
            <input
              type="search"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <p>Total vest orders: {vestOrders.length}</p>

          <DataTable
            columns={vestOrderColumns}
            data={filteredVestOrders}
            emptyMessage="No vest orders match your search."
          />
        </>
      )}

      {selectedOrder && (
        <VestOrderDetails
          order={selectedOrder}
          festivalId={festivalId}
          festivalStatus={festivalStatus}
          onClose={() => setSelectedOrder(null)}
          onUpdated={(updatedOrder) => {
            setVestOrders((currentOrders) =>
              currentOrders.map((order) =>
                order.id === updatedOrder.id
                  ? updatedOrder
                  : order
              )
            );

            setSelectedOrder(updatedOrder);
          }}
        />
      )}
    </div>
  );
}

export default VestOrders;

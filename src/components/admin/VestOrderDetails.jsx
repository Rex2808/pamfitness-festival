import { useState } from "react";
import { updateVestOrderStatus } from "../../services/adminService";

function VestOrderDetails({ order, onClose, onUpdated }) {
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  if (!order) {
    return null;
  }

  async function handleStatusUpdate(status) {
    try {
      setUpdating(true);
      setUpdateError("");

      const updatedOrder = await updateVestOrderStatus(
        order.id,
        status
      );

      onUpdated(updatedOrder);
      onClose();
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <div className="admin-modal-header">
          <div>
            <span className="admin-modal-label">
              VEST ORDER DETAILS
            </span>

            <h2>
              {order.first_name} {order.last_name}
            </h2>
          </div>

          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
            aria-label="Close vest order details"
          >
            ×
          </button>
        </div>

        <div className="admin-modal-body">
          <section className="admin-detail-section">
            <h3>Customer Details</h3>

            <div className="admin-detail-grid">
              <div className="admin-detail-item">
                <span>First Name</span>
                <strong>
                  {order.first_name || "—"}
                </strong>
              </div>

              <div className="admin-detail-item">
                <span>Last Name</span>
                <strong>
                  {order.last_name || "—"}
                </strong>
              </div>

              <div className="admin-detail-item">
                <span>Phone</span>
                <strong>
                  {order.phone || "—"}
                </strong>
              </div>
            </div>
          </section>

          <section className="admin-detail-section">
            <h3>Order Details</h3>

            <div className="admin-detail-grid">
              <div className="admin-detail-item">
                <span>Quantity</span>
                <strong>
                  {order.quantity}
                </strong>
              </div>

              <div className="admin-detail-item">
                <span>Unit Price</span>
                <strong>
                  ₦{Number(
                    order.unit_price
                  ).toLocaleString()}
                </strong>
              </div>

              <div className="admin-detail-item">
                <span>Total Amount</span>
                <strong>
                  ₦{Number(
                    order.total_amount
                  ).toLocaleString()}
                </strong>
              </div>

              <div className="admin-detail-item">
                <span>Status</span>

                <strong>
                  {order.status || "—"}
                </strong>

                <div className="admin-status-actions">
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() =>
                      handleStatusUpdate("PENDING")
                    }
                  >
                    Pending
                  </button>

                  <button
                    type="button"
                    disabled={updating}
                    onClick={() =>
                      handleStatusUpdate("APPROVED")
                    }
                  >
                    Approve
                  </button>

                  <button
                    type="button"
                    disabled={updating}
                    onClick={() =>
                      handleStatusUpdate("REJECTED")
                    }
                  >
                    Reject
                  </button>
                </div>

                {updateError && (
                  <p>{updateError}</p>
                )}
              </div>

              <div className="admin-detail-item">
                <span>Ordered</span>
                <strong>
                  {order.created_at
                    ? new Date(
                        order.created_at
                      ).toLocaleString()
                    : "—"}
                </strong>
              </div>
            </div>
          </section>
        </div>

        <div className="admin-modal-footer">
          <button
            type="button"
            className="admin-modal-secondary-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default VestOrderDetails;
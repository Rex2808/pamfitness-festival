function VendorDetails({ vendor, onClose }) {
  if (!vendor) {
    return null;
  }

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <div className="admin-modal-header">
          <div>
            <span className="admin-modal-label">
              VENDOR DETAILS
            </span>

            <h2>{vendor.business_name}</h2>
          </div>

          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
            aria-label="Close vendor details"
          >
            ×
          </button>
        </div>

        <div className="admin-modal-body">
          <section className="admin-detail-section">
            <h3>Business Details</h3>

            <div className="admin-detail-grid">
              <div className="admin-detail-item">
                <span>Business Name</span>
                <strong>
                  {vendor.business_name || "—"}
                </strong>
              </div>

              <div className="admin-detail-item">
                <span>Contact Person</span>
                <strong>
                  {vendor.contact_name || "—"}
                </strong>
              </div>

              <div className="admin-detail-item">
                <span>Phone</span>
                <strong>
                  {vendor.phone || "—"}
                </strong>
              </div>

              <div className="admin-detail-item">
                <span>Email</span>
                <strong>
                  {vendor.email || "—"}
                </strong>
              </div>

              <div className="admin-detail-item">
                <span>Category</span>
                <strong>
                  {vendor.category || "—"}
                </strong>
              </div>

              <div className="admin-detail-item">
                <span>Website / Social</span>
                <strong>
                  {vendor.website_or_social || "—"}
                </strong>
              </div>
            </div>
          </section>

          <section className="admin-detail-section">
            <h3>Application</h3>

            <div className="admin-detail-grid">
              <div className="admin-detail-item">
                <span>Number of Stands</span>
                <strong>
                  {vendor.number_of_stands}
                </strong>
              </div>

              <div className="admin-detail-item">
                <span>Unit Price</span>
                <strong>
                  ₦{Number(
                    vendor.unit_price
                  ).toLocaleString()}
                </strong>
              </div>

              <div className="admin-detail-item">
                <span>Total Amount</span>
                <strong>
                  ₦{Number(
                    vendor.total_amount
                  ).toLocaleString()}
                </strong>
              </div>

              <div className="admin-detail-item">
                <span>Status</span>
                <strong>
                  {vendor.status || "—"}
                </strong>
              </div>

              <div className="admin-detail-item">
                <span>Applied</span>
                <strong>
                  {vendor.created_at
                    ? new Date(
                        vendor.created_at
                      ).toLocaleString()
                    : "—"}
                </strong>
              </div>
            </div>

            <div className="admin-detail-item" style={{ marginTop: "18px" }}>
              <span>Description</span>
              <strong>
                {vendor.description || "—"}
              </strong>
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

export default VendorDetails;
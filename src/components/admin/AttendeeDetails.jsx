function AttendeeDetails({ attendee, onClose }) {
  if (!attendee) {
    return null;
  }

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <div className="admin-modal-header">
          <div>
            <span className="admin-modal-label">
              ATTENDEE DETAILS
            </span>

            <h2>
              {attendee.first_name} {attendee.last_name}
            </h2>
          </div>

          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
            aria-label="Close attendee details"
          >
            ×
          </button>
        </div>

        <div className="admin-modal-body">
          <section className="admin-detail-section">
            <h3>Registration Details</h3>

            <div className="admin-detail-grid">
              <div className="admin-detail-item">
                <span>Phone</span>
                <strong>{attendee.phone || "—"}</strong>
              </div>

              <div className="admin-detail-item">
                <span>Email</span>
                <strong>{attendee.email || "—"}</strong>
              </div>

              <div className="admin-detail-item">
                <span>Age Range</span>
                <strong>{attendee.age_range || "—"}</strong>
              </div>

              <div className="admin-detail-item">
                <span>Gender</span>
                <strong>{attendee.gender || "—"}</strong>
              </div>

              <div className="admin-detail-item">
                <span>Interests</span>
                <strong>
                  {attendee.interests?.length
                    ? attendee.interests.join(", ")
                    : "—"}
                </strong>
              </div>

              <div className="admin-detail-item">
                <span>Registration Source</span>
                <strong>{attendee.source || "—"}</strong>
              </div>

              <div className="admin-detail-item">
                <span>Registered</span>
                <strong>
                  {attendee.registered_at
                    ? new Date(
                        attendee.registered_at
                      ).toLocaleString()
                    : "—"}
                </strong>
              </div>
            </div>
          </section>

          <section className="admin-detail-section">
            <h3>Attendance</h3>

            <div className="admin-detail-grid">
              <div className="admin-detail-item">
                <span>Status</span>
                <strong>
                  {attendee.attended
                    ? "Attended"
                    : "Not attended"}
                </strong>
              </div>

              <div className="admin-detail-item">
                <span>Attendance Time</span>
                <strong>
                  {attendee.attended_at
                    ? new Date(
                        attendee.attended_at
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

export default AttendeeDetails;
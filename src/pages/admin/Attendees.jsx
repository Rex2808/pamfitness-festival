import { useEffect, useState } from "react";
import { getAdminAttendees } from "../../services/adminService";
import DataTable from "../../components/admin/DataTable";
import AttendeeDetails from "../../components/admin/AttendeeDetails";

function Attendees() {
  const [attendees, setAttendees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAttendee, setSelectedAttendee] = useState(null);

  useEffect(() => {
    async function loadAttendees() {
      try {
        const data = await getAdminAttendees();
        setAttendees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadAttendees();
  }, []);

  const filteredAttendees = attendees.filter((attendee) => {
  const searchTerm = search.toLowerCase();

  return (
    `${attendee.first_name} ${attendee.last_name}`
      .toLowerCase()
      .includes(searchTerm) ||
    attendee.phone.toLowerCase().includes(searchTerm) ||
    (attendee.email || "").toLowerCase().includes(searchTerm)
  );
});

const attendeeColumns = [
  {
    key: "name",
    label: "Name",
    render: (attendee) =>
      `${attendee.first_name} ${attendee.last_name}`,
  },
  {
    key: "phone",
    label: "Phone",
  },
  {
    key: "email",
    label: "Email",
    render: (attendee) => attendee.email || "—",
  },
  {
    key: "registered_at",
    label: "Registered",
    render: (attendee) =>
      new Date(attendee.registered_at).toLocaleDateString(),
  },
  {
    key: "attended",
    label: "Attendance",
    render: (attendee) =>
      attendee.attended ? "Attended" : "Not attended",
  },

    {
    key: "actions",
    label: "Action",
    render: (attendee) => (
      <button
        type="button"
       onClick={() => setSelectedAttendee(attendee)}
      >
        View
      </button>
    ),
  },
];

  return (
    <div>
      <h1>Attendees</h1>
      <p>Manage festival registrations.</p>

      <div className="admin-search">
  <input
    type="search"
    placeholder="Search by name, phone or email..."
    value={search}
    onChange={(event) => setSearch(event.target.value)}
  />
</div>

      {loading && <p>Loading attendees...</p>}

      {error && (
        <p>Failed to load attendees: {error}</p>
      )}

      {!loading && !error && (
        <div>
          <p>Total registrations: {attendees.length}</p>

         <DataTable
  columns={attendeeColumns}
  data={filteredAttendees}
  emptyMessage="No attendees match your search."
/>
        </div>
      )}

      {selectedAttendee && (
  <AttendeeDetails
    attendee={selectedAttendee}
    onClose={() => setSelectedAttendee(null)}
  />
)}
    </div>

  );
}

export default Attendees;

import { useEffect, useState } from "react";
import {
  getAdminAttendees,
  checkInAttendee,
  checkOutAttendee,
} from "../../services/adminService";
import { supabase } from "../../lib/supabase";
import DataTable from "../../components/admin/DataTable";
import AttendeeDetails from "../../components/admin/AttendeeDetails";

function Attendees() {
  const [attendees, setAttendees] = useState([]);
  const [festivalId, setFestivalId] = useState(null);
  const [festivalStatus, setFestivalStatus] = useState(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAttendee, setSelectedAttendee] = useState(null);

  const [updatingId, setUpdatingId] = useState(null);
  const [updateError, setUpdateError] = useState("");

  const canManageAttendance =
    Boolean(festivalId) &&
    !["DRAFT", "ARCHIVED"].includes(festivalStatus);

  useEffect(() => {
    async function loadAttendees() {
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

        // Resolve the festival this administrator can manage
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

        // Load only attendees belonging to this festival
        const data = await getAdminAttendees(festival.id);

        setAttendees(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadAttendees();
  }, []);

  async function handleAttendanceToggle(attendee) {
    try {
      setUpdatingId(attendee.id);
      setUpdateError("");

      if (!festivalId) {
        throw new Error("No festival is selected.");
      }

      if (!canManageAttendance) {
        throw new Error(
          "Attendance updates are disabled for this festival."
        );
      }

      const updatedAttendee = attendee.attended
        ? await checkOutAttendee(
            attendee.id,
            festivalId
          )
        : await checkInAttendee(
            attendee.id,
            festivalId
          );

      setAttendees((currentAttendees) =>
        currentAttendees.map((currentAttendee) =>
          currentAttendee.id === updatedAttendee.id
            ? updatedAttendee
            : currentAttendee
        )
      );

      if (selectedAttendee?.id === updatedAttendee.id) {
        setSelectedAttendee(updatedAttendee);
      }
    } catch (err) {
      setUpdateError(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredAttendees = attendees.filter((attendee) => {
    const searchTerm = search.toLowerCase();

    return (
      `${attendee.first_name} ${attendee.last_name}`
        .toLowerCase()
        .includes(searchTerm) ||
      (attendee.phone || "")
        .toLowerCase()
        .includes(searchTerm) ||
      (attendee.email || "")
        .toLowerCase()
        .includes(searchTerm)
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
        new Date(
          attendee.registered_at
        ).toLocaleDateString(),
    },
    {
      key: "attended",
      label: "Attendance",
      render: (attendee) => (
        <button
          type="button"
          disabled={
            updatingId === attendee.id ||
            !canManageAttendance
          }
          onClick={() =>
            handleAttendanceToggle(attendee)
          }
        >
          {updatingId === attendee.id
            ? "Updating..."
            : attendee.attended
              ? "Check Out"
              : "Check In"}
        </button>
      ),
    },
    {
      key: "actions",
      label: "Action",
      render: (attendee) => (
        <button
          type="button"
          onClick={() =>
            setSelectedAttendee(attendee)
          }
        >
          View
        </button>
      ),
    },
  ];

  if (loading) {
    return <p>Loading attendees...</p>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <span className="admin-topbar-label">
            FESTIVAL MANAGEMENT
          </span>

          <h1>Attendees</h1>

          <p>
            Manage registrations for the selected festival edition.
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
          Failed to load attendees: {error}
        </div>
      )}

      {updateError && (
        <div className="admin-message">
          Attendance update failed: {updateError}
        </div>
      )}

      {!canManageAttendance && !error && (
        <div className="admin-message">
          This festival is {festivalStatus?.toLowerCase()}.
          Attendance updates are disabled, but historical
          registrations remain available.
        </div>
      )}

      {!error && (
        <>
          <div className="admin-search">
            <input
              type="search"
              placeholder="Search by name, phone or email..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <p>
            Total registrations: {attendees.length}
          </p>

          <DataTable
            columns={attendeeColumns}
            data={filteredAttendees}
            emptyMessage="No attendees match your search."
          />
        </>
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

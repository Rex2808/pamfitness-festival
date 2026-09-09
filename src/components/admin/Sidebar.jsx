import {
  LayoutDashboard,
  Users,
  Store,
  Shirt,
  Settings,
  Image,
  Dumbbell,
  HelpCircle,
  BarChart3,
  LogOut,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <h2>TrakLabs</h2>
        <span>Festival Admin</span>
      </div>

      <nav className="admin-sidebar-nav">
        <div className="admin-nav-section">
          <span className="admin-nav-label">MAIN</span>

          <a href="/admin">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </a>
        </div>

        <div className="admin-nav-section">
          <span className="admin-nav-label">FESTIVAL</span>

          <a href="/admin/settings">
            <Settings size={18} />
            <span>Settings</span>
          </a>

          <a href="/admin/activities">
            <Dumbbell size={18} />
            <span>Activities</span>
          </a>

          <a href="/admin/gallery">
            <Image size={18} />
            <span>Gallery</span>
          </a>

          <a href="/admin/faqs">
            <HelpCircle size={18} />
            <span>FAQs</span>
          </a>
        </div>

        <div className="admin-nav-section">
          <span className="admin-nav-label">MANAGEMENT</span>

          <a href="/admin/attendees">
            <Users size={18} />
            <span>Attendees</span>
          </a>

          <a href="/admin/vendors">
            <Store size={18} />
            <span>Vendors</span>
          </a>

          <a href="/admin/vest-orders">
            <Shirt size={18} />
            <span>Vest Orders</span>
          </a>

          <a href="/admin/reports">
            <BarChart3 size={18} />
            <span>Reports</span>
          </a>
        </div>
      </nav>

      <div className="admin-sidebar-footer">
        <button type="button">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
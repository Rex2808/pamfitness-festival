import { NavLink } from "react-router-dom";
import { supabase } from "../../lib/supabase";

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
  UserCog,
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

         <NavLink
           to="/admin"
           end
         >
         <LayoutDashboard size={18} />
         <span>Dashboard</span>
         </NavLink>
        </div>

        <div className="admin-nav-section">
          <span className="admin-nav-label">FESTIVAL</span>

          <NavLink to="/admin/settings">
  <Settings size={18} />
  <span>Settings</span>
</NavLink>

<NavLink to="/admin/activities">
  <Dumbbell size={18} />
  <span>Activities</span>
</NavLink>

<NavLink to="/admin/gallery">
  <Image size={18} />
  <span>Gallery</span>
</NavLink>

<NavLink to="/admin/faqs">
  <HelpCircle size={18} />
  <span>FAQs</span>
</NavLink>

<NavLink to="/admin/admins">
  <UserCog size={18} />
  <span>Admins & Staff</span>
</NavLink>
        </div>

        <div className="admin-nav-section">
          <span className="admin-nav-label">MANAGEMENT</span>

          <NavLink to="/admin/attendees">
  <Users size={18} />
  <span>Attendees</span>
</NavLink>

<NavLink to="/admin/vendors">
  <Store size={18} />
  <span>Vendors</span>
</NavLink>

<NavLink to="/admin/vest-orders">
  <Shirt size={18} />
  <span>Vest Orders</span>
</NavLink>

<NavLink to="/admin/reports">
  <BarChart3 size={18} />
  <span>Reports</span>
</NavLink>
        </div>
      </nav>

     <div className="admin-sidebar-footer">
  <button
    type="button"
    onClick={async () => {
      await supabase.auth.signOut();
      window.location.href = "/admin/login";
    }}
  >
    <LogOut size={18} />
    <span>Logout</span>
  </button>
</div>
    </aside>
  );
}

export default Sidebar;
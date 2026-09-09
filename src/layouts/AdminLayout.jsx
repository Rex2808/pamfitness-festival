import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";
import "../styles/admin.css";

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />

      <main className="admin-main">
        <Topbar />

        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
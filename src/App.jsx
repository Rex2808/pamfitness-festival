import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Settings from "./pages/admin/Settings";
import Activities from "./pages/admin/Activities";
import Gallery from "./pages/admin/Gallery";
import Faqs from "./pages/admin/Faqs";
import Attendees from "./pages/admin/Attendees";
import Vendors from "./pages/admin/Vendors";
import VestOrders from "./pages/admin/VestOrders";
import Reports from "./pages/admin/Reports";
import Admins from "./pages/admin/Admins";
import InviteSetup from "./pages/admin/InviteSetup";

import AdminLayout from "./layouts/AdminLayout";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />

      {/* Admin authentication */}
      <Route
        path="/admin/login"
        element={<Login />}
      />

      <Route
        path="/admin/setup"
        element={<InviteSetup />}
      />

      {/* Admin dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedAdminRoute>
        }
      />

      {/* Festival management */}
      <Route
        path="/admin/settings"
        element={
          <ProtectedAdminRoute
            allowedRoles={[
              "PLATFORM_ADMIN",
              "FESTIVAL_ADMIN",
            ]}
          >
            <AdminLayout>
              <Settings />
            </AdminLayout>
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/activities"
        element={
          <ProtectedAdminRoute
            allowedRoles={[
              "PLATFORM_ADMIN",
              "FESTIVAL_ADMIN",
            ]}
          >
            <AdminLayout>
              <Activities />
            </AdminLayout>
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/gallery"
        element={
          <ProtectedAdminRoute
            allowedRoles={[
              "PLATFORM_ADMIN",
              "FESTIVAL_ADMIN",
            ]}
          >
            <AdminLayout>
              <Gallery />
            </AdminLayout>
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/faqs"
        element={
          <ProtectedAdminRoute
            allowedRoles={[
              "PLATFORM_ADMIN",
              "FESTIVAL_ADMIN",
            ]}
          >
            <AdminLayout>
              <Faqs />
            </AdminLayout>
          </ProtectedAdminRoute>
        }
      />

      {/* Operational management */}
      <Route
        path="/admin/attendees"
        element={
          <ProtectedAdminRoute>
            <AdminLayout>
              <Attendees />
            </AdminLayout>
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/vendors"
        element={
          <ProtectedAdminRoute>
            <AdminLayout>
              <Vendors />
            </AdminLayout>
          </ProtectedAdminRoute>
        }
      />

      <Route
        path="/admin/vest-orders"
        element={
          <ProtectedAdminRoute>
            <AdminLayout>
              <VestOrders />
            </AdminLayout>
          </ProtectedAdminRoute>
        }
      />

      {/* Reports */}
      <Route
        path="/admin/reports"
        element={
          <ProtectedAdminRoute
            allowedRoles={[
              "PLATFORM_ADMIN",
              "FESTIVAL_ADMIN",
            ]}
          >
            <AdminLayout>
              <Reports />
            </AdminLayout>
          </ProtectedAdminRoute>
        }
      />

      {/* Platform administration */}
      <Route
        path="/admin/admins"
        element={
          <ProtectedAdminRoute
            allowedRoles={["PLATFORM_ADMIN"]}
          >
            <AdminLayout>
              <Admins />
            </AdminLayout>
          </ProtectedAdminRoute>
        }
      />
    </Routes>
  );
}

export default App;
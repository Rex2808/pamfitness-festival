import "./App.css";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import AdminLayout from "./layouts/AdminLayout";
import Attendees from "./pages/admin/Attendees";
import Vendors from "./pages/admin/Vendors";
import VestOrders from "./pages/admin/VestOrders";
import Settings from "./pages/admin/Settings";
import Activities from "./pages/admin/Activities";
import Gallery from "./pages/admin/Gallery";
import Faqs from "./pages/admin/Faqs";
import Reports from "./pages/admin/Reports";
import Admins from "./pages/admin/Admins";
import InviteSetup from "./pages/admin/InviteSetup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/admin/login" element={<Login />} />

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

<Route
  path="/admin/settings"
  element={
    <ProtectedAdminRoute>
      <AdminLayout>
        <Settings />
      </AdminLayout>
    </ProtectedAdminRoute>
  }
/>
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

<Route
  path="/admin/activities"
  element={
    <ProtectedAdminRoute>
      <AdminLayout>
        <Activities />
      </AdminLayout>
    </ProtectedAdminRoute>
  }
/>

<Route
  path="/admin/gallery"
  element={
    <ProtectedAdminRoute>
      <AdminLayout>
        <Gallery />
      </AdminLayout>
    </ProtectedAdminRoute>
  }
/>

<Route
  path="/admin/faqs"
  element={
    <ProtectedAdminRoute>
      <AdminLayout>
        <Faqs />
      </AdminLayout>
    </ProtectedAdminRoute>
  }
/>

<Route
  path="/admin/reports"
  element={
    <ProtectedAdminRoute>
      <AdminLayout>
        <Reports />
      </AdminLayout>
    </ProtectedAdminRoute>
  }
/>

<Route
  path="/admin/admins"
  element={
    <ProtectedAdminRoute>
      <AdminLayout>
        <Admins />
      </AdminLayout>
    </ProtectedAdminRoute>
  }
/>

<Route
  path="/admin/setup"
  element={<InviteSetup />}
/>
    </Routes>
  );
}

export default App;
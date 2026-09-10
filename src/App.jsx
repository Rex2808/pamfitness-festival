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
    </Routes>
  );
}

export default App;
import "./App.css";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import AdminLayout from "./layouts/AdminLayout";

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
    </Routes>
  );
}

export default App;
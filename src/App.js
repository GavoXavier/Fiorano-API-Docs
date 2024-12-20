import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageCategories from "./pages/Admin/ManageCategories";
import ManageAPIs from "./pages/Admin/ManageAPIs";
import AddAPI from "./pages/Admin/AddAPI"; // Import AddAPI Component
import EditAPI from "./pages/Admin/EditAPI"; // Import EditAPI Component
import AdminLayout from "./components/AdminLayout"; // Import AdminLayout

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/manage-categories"
          element={
            <AdminLayout>
              <ManageCategories />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/manage-apis"
          element={
            <AdminLayout>
              <ManageAPIs />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/add-api"
          element={
            <AdminLayout>
              <AddAPI />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/edit-api/:id"
          element={
            <AdminLayout>
              <EditAPI />
            </AdminLayout>
          }
        />

        {/* Default Route */}
        <Route
          path="/"
          element={
            <h1 className="text-center mt-10 text-gray-800 dark:text-white">
              Welcome to Fiorano API Docs
            </h1>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

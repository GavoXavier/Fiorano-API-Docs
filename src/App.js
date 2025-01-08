import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageCategories from "./pages/Admin/ManageCategories";
import ManageAPIs from "./pages/Admin/ManageAPIs";
import AddAPI from "./pages/Admin/AddAPI";
import EditAPI from "./pages/Admin/EditAPI";
import AdminLayout from "./components/AdminLayout";
import MigrateAPIs from "./pages/Admin/MigrateAPIs";
import ImportAPIs from "./pages/Admin/ImportAPIs";

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
          path="/admin/edit-api"
          element={
            <AdminLayout>
              <EditAPI />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/migrate-apis"
          element={
            <AdminLayout>
              <MigrateAPIs />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/import-apis"
          element={
            <AdminLayout>
              <ImportAPIs />
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

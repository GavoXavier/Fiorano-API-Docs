import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // Import Navbar
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageCategories from "./pages/Admin/ManageCategories";
import ManageAPIs from "./pages/Admin/ManageAPIs";

// Layout Component for Admin Pages
const AdminLayout = ({ children }) => (
  <div>
    <Navbar /> {/* Include Navbar for admin pages */}
    <main>{children}</main>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route
          path="/admin/login"
          element={<AdminLogin />} // No Navbar for login
        />
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

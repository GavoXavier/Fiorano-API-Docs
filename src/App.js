import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageCategories from "./pages/Admin/ManageCategories";
import ManageAPIs from "./pages/Admin/ManageAPIs";
import AddAPI from "./pages/Admin/AddAPI";
import EditAPI from "./pages/Admin/EditAPI";
import EditAPIOverview from "./pages/Admin/EditAPIOverview"; // Added EditAPIOverview
import AdminLayout from "./components/AdminLayout";
import MigrateAPIs from "./pages/Admin/MigrateAPIs";
import ImportAPIs from "./pages/Admin/ImportAPIs";
import Layout from "./pages/User/Layout"; // User Layout
import Home from "./pages/User/Home"; // User Home Page
import APIOverview from "./pages/User/APIOverview"; // Example API Overview Page
import Categories from "./pages/User/Categories"; // Categories Page
import CategoryDetails from "./pages/User/CategoryDetails"; // Category Details Page
import AuthPage from "./pages/User/AuthPage"; // Added AuthPage

// Admin Protected Route
const AdminProtectedRoute = ({ element }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return user ? element : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute
              element={
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              }
            />
          }
        />
        <Route
          path="/admin/manage-categories"
          element={
            <AdminProtectedRoute
              element={
                <AdminLayout>
                  <ManageCategories />
                </AdminLayout>
              }
            />
          }
        />
        <Route
          path="/admin/manage-apis"
          element={
            <AdminProtectedRoute
              element={
                <AdminLayout>
                  <ManageAPIs />
                </AdminLayout>
              }
            />
          }
        />
        <Route
          path="/admin/add-api"
          element={
            <AdminProtectedRoute
              element={
                <AdminLayout>
                  <AddAPI />
                </AdminLayout>
              }
            />
          }
        />
        <Route
          path="/admin/edit-api"
          element={
            <AdminProtectedRoute
              element={
                <AdminLayout>
                  <EditAPI />
                </AdminLayout>
              }
            />
          }
        />
        <Route
          path="/admin/edit-api/:id"
          element={
            <AdminProtectedRoute
              element={
                <AdminLayout>
                  <EditAPIOverview />
                </AdminLayout>
              }
            />
          }
        />
        <Route
          path="/admin/migrate-apis"
          element={
            <AdminProtectedRoute
              element={
                <AdminLayout>
                  <MigrateAPIs />
                </AdminLayout>
              }
            />
          }
        />
        <Route
          path="/admin/import-apis"
          element={
            <AdminProtectedRoute
              element={
                <AdminLayout>
                  <ImportAPIs />
                </AdminLayout>
              }
            />
          }
        />

        {/* User Routes */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/user/api/:id"
          element={
            <Layout>
              <APIOverview />
            </Layout>
          }
        />
        <Route
          path="/user/categories"
          element={
            <Layout>
              <Categories />
            </Layout>
          }
        />
        <Route
          path="/user/category/:id"
          element={
            <Layout>
              <CategoryDetails />
            </Layout>
          }
        />
        <Route
          path="/user/authentication"
          element={
            <Layout>
              <AuthPage />
            </Layout>
          }
        />

        {/* Default Route */}
        <Route
          path="*"
          element={
            <h1 className="text-center mt-10 text-gray-800 dark:text-white">
              404: Page Not Found
            </h1>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

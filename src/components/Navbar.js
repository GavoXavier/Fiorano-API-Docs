import React from "react";
import { NavLink } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import ApiIcon from "@mui/icons-material/Api";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <ul className="flex space-x-6">
          {/* Dashboard Link */}
          <li>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-1 ${
                  isActive ? "text-blue-300" : "hover:text-blue-300"
                }`
              }
            >
              <DashboardIcon fontSize="small" />
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/* Manage APIs Link */}
          <li>
            <NavLink
              to="/admin/manage-apis"
              className={({ isActive }) =>
                `flex items-center space-x-1 ${
                  isActive ? "text-blue-300" : "hover:text-blue-300"
                }`
              }
            >
              <ApiIcon fontSize="small" />
              <span>Manage APIs</span>
            </NavLink>
          </li>

          {/* Manage Categories Link */}
          <li>
            <NavLink
              to="/admin/manage-categories"
              className={({ isActive }) =>
                `flex items-center space-x-1 ${
                  isActive ? "text-blue-300" : "hover:text-blue-300"
                }`
              }
            >
              <CategoryIcon fontSize="small" />
              <span>Manage Categories</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCogs,
  faLayerGroup,
  faBars,
  faSignOutAlt,
  faSun,
  faMoon,
  faUpload,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      navigate("/");
    }
  };

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-white dark:bg-gray-900 text-gray-800 dark:text-white h-screen transition-all duration-300 fixed flex flex-col shadow-lg`}
    >
      {/* Hamburger Button */}
      <button
        className="p-4 text-gray-700 dark:text-gray-300 focus:outline-none"
        onClick={toggleSidebar}
      >
        <FontAwesomeIcon icon={faBars} />
      </button>

      {/* Navigation Links */}
      <ul className="space-y-4 mt-4 flex-1">
        <li>
          <NavLink
            to="/admin/dashboard"
            className="flex items-center space-x-4 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <FontAwesomeIcon icon={faHome} />
            {isOpen && <span>Dashboard</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/manage-apis"
            className="flex items-center space-x-4 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <FontAwesomeIcon icon={faCogs} />
            {isOpen && <span>Manage APIs</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/schemas"
            className="flex items-center space-x-4 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <FontAwesomeIcon icon={faCogs} />
            {isOpen && <span>API Schemas </span>}
          </NavLink>
        </li>
        <li>
        <NavLink
            to="/admin/schemas/list"
            className="flex items-center space-x-4 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <FontAwesomeIcon icon={faCogs} />
            {isOpen && <span>EDIT API Schemas </span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/manage-categories"
            className="flex items-center space-x-4 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <FontAwesomeIcon icon={faLayerGroup} />
            {isOpen && <span>Manage Categories</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/import-apis"
            className="flex items-center space-x-4 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <FontAwesomeIcon icon={faUpload} />
            {isOpen && <span>Import APIs</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/edit-api"
            className="flex items-center space-x-4 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <FontAwesomeIcon icon={faEdit} />
            {isOpen && <span>Edit APIs</span>}
          </NavLink>
        </li>
      </ul>

      {/* Dark Mode Toggle */}
      <div className="p-4 flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className="flex items-center space-x-2 p-2 w-full text-left hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          {isOpen && <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
        </button>
      </div>

      {/* Logout Button */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-4 p-2 w-full text-left hover:bg-red-100 dark:hover:bg-red-700 rounded text-red-500"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

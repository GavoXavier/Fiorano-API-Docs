import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSun, faMoon, faSignOutAlt, faBars } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const [darkMode, setDarkMode] = React.useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    const root = document.documentElement;
    root.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    navigate("/");
    alert("Logged out successfully!");
  };

  return (
    <nav className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow sticky top-0 z-10 p-4 flex items-center justify-between">
      {/* Hamburger */}
      <button onClick={toggleSidebar} className="p-2">
        <FontAwesomeIcon icon={faBars} />
      </button>

      {/* Search */}
      <div className="relative flex-1 mx-4">
        <input
          type="text"
          placeholder="Search for APIs or Categories..."
          className="w-full px-4 py-2 rounded-full border border-gray-300 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
        />
        <FontAwesomeIcon icon={faSearch} className="absolute top-3 right-4 text-gray-400" />
      </div>

      {/* Dark Mode Toggle */}
      <button onClick={toggleDarkMode} className="p-2">
        <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
      </button>

      {/* Logout */}
      <button onClick={handleLogout} className="p-2">
        <FontAwesomeIcon icon={faSignOutAlt} />
      </button>
    </nav>
  );
};

export default Navbar;

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCog, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const toggleDarkMode = () => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-100 dark:bg-gray-800 shadow">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Home / <span className="font-bold">API Details</span>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-600 dark:text-gray-300">
          <FontAwesomeIcon icon={faBell} />
        </button>
        <button className="text-gray-600 dark:text-gray-300">
          <FontAwesomeIcon icon={faCog} />
        </button>
        <button onClick={toggleDarkMode} className="text-gray-600 dark:text-gray-300">
          <FontAwesomeIcon icon={localStorage.getItem("theme") === "dark" ? faSun : faMoon} />
        </button>
      </div>
    </header>
  );
};

export default Header;

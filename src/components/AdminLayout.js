import React, { useState } from "react";
import Sidebar from "./Sidebar";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"} bg-white dark:bg-gray-800 shadow`}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">{children}</div>
    </div>
  );
};

export default AdminLayout;

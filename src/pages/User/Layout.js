import React from "react";
import UserSidebar from "../../components/UserSidebar";

const Layout = ({ children }) => {
  return (
    <div className="h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-800 shadow">
        <UserSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto text-gray-800 dark:text-white">
        {children}
      </div>
    </div>
  );
};

export default Layout;

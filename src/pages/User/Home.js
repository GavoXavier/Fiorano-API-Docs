import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-6">
      {/* Welcome Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Welcome to Fiorano APIs
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Browse through our extensive collection of APIs. Click on a category
          to explore the APIs available and learn how to integrate them
          seamlessly into your applications.
        </p>
      </div>

      {/* Categories Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Explore Categories
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Discover various API categories tailored for different use cases.
          </p>
          <button
            onClick={() => navigate("/user/categories")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View Categories
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

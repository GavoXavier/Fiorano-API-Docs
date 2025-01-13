import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ categories: 0, apis: 0 });

  // Fetch API and Category Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        const apisSnapshot = await getDocs(collection(db, "apiv2"));

        setStats({
          categories: categoriesSnapshot.docs.length,
          apis: apisSnapshot.docs.length,
        });
      } catch (error) {
        console.error("Error fetching stats: ", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-6">
      {/* Welcome Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Welcome to Fiorano APIs
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Discover, explore, and integrate our APIs seamlessly into your
          applications.
        </p>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-3xl font-bold text-blue-500">{stats.categories}</h3>
          <p className="text-gray-600 dark:text-gray-300">Categories</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-3xl font-bold text-green-500">{stats.apis}</h3>
          <p className="text-gray-600 dark:text-gray-300">APIs Available</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-3xl font-bold text-yellow-500">99.99%</h3>
          <p className="text-gray-600 dark:text-gray-300">Uptime</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-3xl font-bold text-red-500">Secure</h3>
          <p className="text-gray-600 dark:text-gray-300">Reliable APIs</p>
        </div>
      </div>

      {/* Action Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Explore Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Explore Categories
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Browse API categories tailored for different use cases.
          </p>
          <button
            onClick={() => navigate("/user/categories")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View Categories
          </button>
        </div>

        {/* Documentation Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            API Documentation
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Learn how to integrate and use our APIs.
          </p>
          <button
            onClick={() => navigate("/documentation")}
            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Read Docs
          </button>
        </div>
      </div>

      {/* Get Started Section */}
      <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-6 mt-12">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-6">
          Getting Started
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              1. Explore APIs
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Browse through categories and APIs to find the ones you need.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              2. Get Your Key
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Register for API access and get your authentication key.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              3. Integrate & Build
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Use our documentation to integrate APIs and start building.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categorySnapshot = await getDocs(collection(db, "categories"));
        const categoriesWithAPIs = await Promise.all(
          categorySnapshot.docs.map(async (doc) => {
            const categoryData = { id: doc.id, ...doc.data() };

            // Fetch API count for this category
            const apiQuery = query(
              collection(db, "apiv2"),
              where("categoryId", "==", categoryData.id)
            );
            const apiSnapshot = await getDocs(apiQuery);
            const apiCount = apiSnapshot.size; // Get the number of APIs

            return { ...categoryData, apiCount };
          })
        );

        setCategories(categoriesWithAPIs);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        API Categories
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={() => navigate(`/user/category/${category.id}`)}
          >
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {category.name}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {category.description || "No description available."}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                APIs: {category.apiCount}
              </span>
              <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;

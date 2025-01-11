import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categorySnapshot = await getDocs(collection(db, "categories"));
        const categoriesWithAPIs = await Promise.all(
          categorySnapshot.docs.map(async (doc) => {
            const categoryData = { id: doc.id, ...doc.data() };

            // Fetch APIs for this category
            const apiQuery = query(
              collection(db, "apiv2"),
              where("categoryId", "==", categoryData.id)
            );
            const apiSnapshot = await getDocs(apiQuery);
            const apis = apiSnapshot.docs.map((apiDoc) => ({
              id: apiDoc.id,
              ...apiDoc.data(),
            }));

            return { ...categoryData, apis };
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
      <div className="space-y-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {category.name}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {category.description || "No description available."}
            </p>
            <h3 className="text-lg font-semibold mt-4">APIs:</h3>
            <ul className="list-disc list-inside mt-2 space-y-1">
              {category.apis.length > 0 ? (
                category.apis.map((api) => (
                  <li key={api.id} className="text-gray-600 dark:text-gray-300">
                    {api.name} - {api.method} {api.endpoint}
                  </li>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No APIs available in this category.
                </p>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;

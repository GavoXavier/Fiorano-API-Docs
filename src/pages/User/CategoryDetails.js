import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";

const CategoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch category details and APIs
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        // Fetch category details
        const categoryDoc = await getDoc(doc(db, "categories", id));
        if (categoryDoc.exists()) {
          setCategory({ id: categoryDoc.id, ...categoryDoc.data() });
        }

        // Fetch APIs for the category
        const apiQuery = query(collection(db, "apiv2"), where("categoryId", "==", id));
        const apiSnapshot = await getDocs(apiQuery);
        setApis(
          apiSnapshot.docs.map((apiDoc) => ({
            id: apiDoc.id,
            ...apiDoc.data(),
          }))
        );
      } catch (error) {
        console.error("Error fetching category details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-400">Loading category details...</p>;
  }

  if (!category) {
    return <p className="text-center text-red-500">Category not found.</p>;
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex mb-6">
        <ol className="flex overflow-hidden rounded-lg border border-gray-700 text-gray-400">
          <li className="flex items-center">
            <Link
              to="/"
              className="flex h-10 items-center gap-1.5 bg-gray-800 px-4 transition hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="ms-1.5 text-xs font-medium">Home</span>
            </Link>
          </li>
          <li className="relative flex items-center">
            <span className="absolute inset-y-0 -start-px h-10 w-4 bg-gray-800 [clip-path:_polygon(0_0,_0%_100%,_100%_50%)]"></span>
            <Link
              to="/user/categories"
              className="flex h-10 items-center bg-gray-900 pe-4 ps-8 text-xs font-medium transition hover:text-white"
            >
              Categories
            </Link>
          </li>
          <li className="relative flex items-center">
            <span className="absolute inset-y-0 -start-px h-10 w-4 bg-gray-800 [clip-path:_polygon(0_0,_0%_100%,_100%_50%)]"></span>
            <span className="flex h-10 items-center bg-gray-900 pe-4 ps-8 text-xs font-medium text-gray-500">
              {category.name}
            </span>
          </li>
        </ol>
      </nav>

      {/* Info Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {category.description || "No description available for this category."}
        </p>
        <div className="flex flex-wrap gap-6">
          <div>
            <h2 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Created On</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{category.createdAt || "N/A"}</p>
          </div>
          <div>
            <h2 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              Last Updated
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {category.updatedAt || "N/A"}
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Number of APIs</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{apis.length}</p>
          </div>
          <div>
            <h2 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              Authorization
            </h2>
            <button
              onClick={() => navigate("/user/authentication")}
              className="text-blue-500 hover:text-blue-600 text-sm"
            >
              Go to Authentication
            </button>
          </div>
        </div>
      </div>

      {/* APIs Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">APIs in {category.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {apis.map((api) => (
            <div
              key={api.id}
              className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg cursor-pointer"
              onClick={() => navigate(`/user/api/${api.id}`)}
            >
              <h3 className="text-lg font-bold text-white">{api.name}</h3>
              <p className="text-sm text-gray-400 truncate mb-3">{api.endpoint}</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  api.method === "GET"
                    ? "bg-green-700 text-green-200"
                    : api.method === "POST"
                    ? "bg-blue-700 text-blue-200"
                    : api.method === "PUT"
                    ? "bg-yellow-700 text-yellow-200"
                    : api.method === "DELETE"
                    ? "bg-red-700 text-red-200"
                    : "bg-gray-700 text-gray-200"
                }`}
              >
                {api.method}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetails;

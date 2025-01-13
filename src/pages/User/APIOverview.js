import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const APIOverview = () => {
  const { id } = useParams();
  const [apiDetails, setApiDetails] = useState(null);
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const apiDoc = await getDoc(doc(db, "apiv2", id));
        if (apiDoc.exists()) {
          const apiData = apiDoc.data();
          setApiDetails(apiData);

          const categoryDoc = await getDoc(doc(db, "categories", apiData.categoryId));
          if (categoryDoc.exists()) {
            setCategoryDetails({ id: categoryDoc.id, ...categoryDoc.data() });
          }
        } else {
          console.error("API not found");
        }
      } catch (error) {
        console.error("Error fetching API details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center text-gray-800 dark:text-white">
        Loading API details...
      </div>
    );
  }

  if (!apiDetails) {
    return (
      <div className="text-center text-red-500 dark:text-red-400">
        API not found.
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex space-x-2 text-gray-600 dark:text-gray-400">
          <li>
            <Link to="/" className="hover:text-blue-500">
              Home
            </Link>
          </li>
          {categoryDetails && (
            <li>
              <span>/</span>
              <Link to={`/user/category/${categoryDetails.id}`} className="hover:text-blue-500">
                {categoryDetails.name}
              </Link>
            </li>
          )}
          <li>
            <span>/</span>
            <span className="text-gray-800 dark:text-white">{apiDetails.name}</span>
          </li>
        </ol>
      </nav>

      {/* API Overview */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-6">
        {/* API Header */}
        <div className="space-y-2">
          <span
            className={`px-3 py-1 rounded-full text-xs ${
              apiDetails.method === "GET"
                ? "bg-green-100 text-green-700"
                : apiDetails.method === "POST"
                ? "bg-blue-100 text-blue-700"
                : apiDetails.method === "PUT"
                ? "bg-yellow-100 text-yellow-700"
                : apiDetails.method === "DELETE"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {apiDetails.method}
          </span>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{apiDetails.name}</h1>
          <p className="text-gray-600 dark:text-gray-300">{apiDetails.description || "No description available."}</p>
        </div>

        {/* Base URL */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Base URL</h2>
          <input
            type="text"
            readOnly
            value={apiDetails.endpoint}
            className="w-full mt-2 p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600"
          />
        </div>

        {/* Authentication Token */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Authentication Token</h2>
          <input
            type="text"
            readOnly
            value="Bearer YOUR_TOKEN_HERE"
            className="w-full mt-2 p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600"
          />
        </div>

        {/* Headers */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Headers</h2>
          <div className="w-full mt-2 p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 h-28 overflow-y-auto custom-scrollbar">
            <pre>{JSON.stringify(apiDetails.headers, null, 2)}</pre>
          </div>
        </div>

        {/* Body */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Body</h2>
          <div className="w-full mt-2 p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 h-28 overflow-y-auto custom-scrollbar">
            <pre>{JSON.stringify(apiDetails.requestBody, null, 2)}</pre>
          </div>
        </div>

        {/* Response */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Response</h2>
          <div className="w-full mt-2 p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 h-28 overflow-y-auto custom-scrollbar">
            <pre>{JSON.stringify(apiDetails.responseExample, null, 2)}</pre>
          </div>
        </div>

        {/* Example Integration */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Example Integration</h2>
          <div className="flex items-center space-x-4 mt-4">
            <img
              src="/path-to-curl-logo.png"
              alt="cURL"
              className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600"
            />
            <textarea
              readOnly
              value={apiDetails.exampleIntegration}
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 h-28 overflow-y-auto custom-scrollbar"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIOverview;

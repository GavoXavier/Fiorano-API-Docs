import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const APIOverview = () => {
  const { id } = useParams();
  const [apiDetails, setApiDetails] = useState(null);
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRequestExample, setShowRequestExample] = useState(false);
  const [showResponseExample, setShowResponseExample] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const apiDoc = await getDoc(doc(db, "apiv2", id));
        if (apiDoc.exists()) {
          const apiData = apiDoc.data();
          setApiDetails(apiData);

          if (apiData.categoryId) {
            const categoryDoc = await getDoc(doc(db, "categories", apiData.categoryId));
            if (categoryDoc.exists()) {
              setCategoryDetails({ id: categoryDoc.id, ...categoryDoc.data() });
            }
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

  // Format headers and body fields
  const formatHeaders = (headers) =>
    headers.length > 0
      ? headers.map((header) => `${header.key || "null"}: ${header.value || "null"}`).join("\n")
      : "No headers available.";

  const formatBodyFields = (fields) =>
    fields.length > 0
      ? fields.map((field) => `"${field.name}": "${field.type}"`).join(",\n")
      : "No fields available.";

  const formatStatusCodes = (statusCodes) =>
    statusCodes.length > 0
      ? statusCodes.map((code) => `${code.code}: ${code.description}`).join("\n")
      : "No status codes available.";

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Base URL</h2>
            <input
              type="text"
              readOnly
              value={apiDetails.endpoint}
              className="w-full mt-2 p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Authentication */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Authentication</h2>
            <input
              type="text"
              readOnly
              value={apiDetails.requiresAuth ? "Bearer YOUR_TOKEN_HERE" : "No Authentication Required"}
              className="w-full mt-2 p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>

        {/* Headers
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Headers</h2>
          <textarea
            readOnly
            value={formatHeaders(apiDetails.headers || [])}
            className="w-full mt-2 p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 h-28 overflow-y-auto custom-scrollbar"
          />
        </div> */}

        {/* Request Body */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Request Body</h2>
          <textarea
            readOnly
            value={formatBodyFields(apiDetails.requestBody || [])}
            className="w-full mt-2 p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 h-28 overflow-y-auto custom-scrollbar"
          />
          <button
            onClick={() => setShowRequestExample(!showRequestExample)}
            className="mt-2 text-blue-500"
          >
            {showRequestExample ? "Hide Example" : "Show Example"}
          </button>
          {showRequestExample && (
            <div className="mt-2 p-3 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
              <pre>{apiDetails.exampleRequestBody || "No example available."}</pre>
            </div>
          )}
        </div>

        {/* Response Body */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Response Body</h2>
          <textarea
            readOnly
            value={formatBodyFields(apiDetails.responseBody || [])}
            className="w-full mt-2 p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 h-28 overflow-y-auto custom-scrollbar"
          />
          <button
            onClick={() => setShowResponseExample(!showResponseExample)}
            className="mt-2 text-blue-500"
          >
            {showResponseExample ? "Hide Example" : "Show Example"}
          </button>
          {showResponseExample && (
            <div className="mt-2 p-3 bg-gray-200 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
              <pre>{apiDetails.exampleResponseBody || "No example available."}</pre>
            </div>
          )}
        </div>

        {/* Status Codes */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Status Codes</h2>
          <textarea
            readOnly
            value={formatStatusCodes(apiDetails.statusCodes || [])}
            className="w-full mt-2 p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 h-28 overflow-y-auto custom-scrollbar"
          />
        </div>

        {/* Example Integration */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Example Integration</h2>
          <textarea
            readOnly
            value={apiDetails.exampleIntegration || "No example integration available."}
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600"
            rows="5"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default APIOverview;

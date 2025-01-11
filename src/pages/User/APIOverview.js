import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const APIOverview = () => {
  const { id } = useParams(); // Get the API ID from the URL
  const [apiDetails, setApiDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch API details from Firestore
  useEffect(() => {
    const fetchApiDetails = async () => {
      try {
        const apiDoc = await getDoc(doc(db, "apiv2", id));
        if (apiDoc.exists()) {
          setApiDetails(apiDoc.data());
        } else {
          console.error("API not found");
        }
      } catch (error) {
        console.error("Error fetching API details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApiDetails();
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
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex mb-6">
        <ol className="flex overflow-hidden rounded-lg border border-gray-700 text-gray-400">
          {/* Home Breadcrumb */}
          <li className="flex items-center">
            <Link
              to="/"
              className="flex h-10 items-center gap-1.5 bg-gray-800 px-4 transition hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4"
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
              <span className="ms-1.5 text-xs font-medium"> Home </span>
            </Link>
          </li>

          {/* Categories Breadcrumb */}
          <li className="relative flex items-center">
            <span className="absolute inset-y-0 -start-px h-10 w-4 bg-gray-800 [clip-path:_polygon(0_0,_0%_100%,_100%_50%)]"></span>
            <Link
              to="/user/categories"
              className="flex h-10 items-center bg-gray-900 pe-4 ps-8 text-xs font-medium transition hover:text-white"
            >
              Categories
            </Link>
          </li>

          {/* API Name Breadcrumb */}
          <li className="relative flex items-center">
            <span className="absolute inset-y-0 -start-px h-10 w-4 bg-gray-800 [clip-path:_polygon(0_0,_0%_100%,_100%_50%)]"></span>
            <span className="flex h-10 items-center bg-gray-900 pe-4 ps-8 text-xs font-medium text-gray-500">
              {apiDetails.name}
            </span>
          </li>
        </ol>
      </nav>

      {/* API Details */}
      <h1 className="text-3xl font-bold mb-4">{apiDetails.name}</h1>
      <div className="mb-4">
        <p className="text-sm text-gray-400">
          {apiDetails.description || "No description available."}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Endpoint</h2>
        <p className="bg-gray-800 p-4 rounded">{apiDetails.endpoint}</p>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Method</h2>
        <p className="bg-gray-800 p-4 rounded">{apiDetails.method}</p>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Headers</h2>
        <pre className="bg-gray-800 p-4 rounded">
          {JSON.stringify(apiDetails.headers, null, 2)}
        </pre>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Request Body</h2>
        <pre className="bg-gray-800 p-4 rounded">
          {JSON.stringify(apiDetails.requestBody, null, 2)}
        </pre>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Response Example</h2>
        <pre className="bg-gray-800 p-4 rounded">
          {JSON.stringify(apiDetails.responseExample, null, 2)}
        </pre>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Example Integration</h2>
        <pre className="bg-gray-800 p-4 rounded">
          {apiDetails.exampleIntegration}
        </pre>
      </div>
    </div>
  );
};

export default APIOverview;

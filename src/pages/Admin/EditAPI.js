import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import EditAPIOverview from "./EditAPIOverview";

const EditAPI = () => {
  const [apis, setApis] = useState([]); // List of APIs
  const [selectedApi, setSelectedApi] = useState(null); // API selected for editing
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering APIs
  const [filteredApis, setFilteredApis] = useState([]); // Filtered list of APIs

  // Fetch APIs from Firestore
  useEffect(() => {
    const fetchAPIs = async () => {
      try {
        const apiSnapshot = await getDocs(collection(db, "apiv2"));
        const apis = apiSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setApis(apis);
        setFilteredApis(apis);
      } catch (error) {
        console.error("Error fetching APIs: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAPIs();
  }, []);

  // Filter APIs based on search term
  useEffect(() => {
    const filtered = apis.filter((api) =>
      api.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredApis(filtered);
  }, [searchTerm, apis]);

  if (loading) {
    return <p>Loading APIs...</p>;
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Edit APIs</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search APIs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 w-full sm:w-1/3 border rounded dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* List of APIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApis.map((api) => (
          <div
            key={api.id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:shadow-lg cursor-pointer"
            onClick={() => setSelectedApi(api)} // Open dialog box with the selected API
          >
            <h2 className="text-lg font-bold">{api.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {api.endpoint}
            </p>
            <div className="mt-2 flex space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  api.method === "GET"
                    ? "bg-green-100 text-green-800"
                    : api.method === "POST"
                    ? "bg-blue-100 text-blue-800"
                    : api.method === "PUT"
                    ? "bg-yellow-100 text-yellow-800"
                    : api.method === "DELETE"
                    ? "bg-red-100 text-red-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {api.method}
              </span>
              {api.requiresAuth && (
                <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-800">
                  Auth Required
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog Box */}
      {selectedApi && (
        <EditAPIOverview
          api={selectedApi}
          onClose={() => setSelectedApi(null)} // Close dialog box
          onUpdate={(updatedApi) => {
            // Update the API list locally after saving changes
            setApis((prevApis) =>
              prevApis.map((api) =>
                api.id === updatedApi.id ? updatedApi : api
              )
            );
            setFilteredApis((prevApis) =>
              prevApis.map((api) =>
                api.id === updatedApi.id ? updatedApi : api
              )
            );
          }}
        />
      )}
    </div>
  );
};

export default EditAPI;

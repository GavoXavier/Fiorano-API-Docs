import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import EditAPIOverview from "./EditAPIOverview";

const EditAPI = () => {
  const [apis, setApis] = useState([]); // List of APIs
  const [selectedApi, setSelectedApi] = useState(null); // API selected for editing
  const [loading, setLoading] = useState(true);

  // Fetch APIs from Firestore
  useEffect(() => {
    const fetchAPIs = async () => {
      try {
        const apiSnapshot = await getDocs(collection(db, "apiv2"));
        setApis(apiSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching APIs: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAPIs();
  }, []);

  if (loading) {
    return <p>Loading APIs...</p>;
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Edit APIs</h1>

      {/* List of APIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {apis.map((api) => (
          <div
            key={api.id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:shadow-lg cursor-pointer"
            onClick={() => setSelectedApi(api)} // Open dialog box with the selected API
          >
            <h2 className="text-lg font-bold">{api.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {api.endpoint}
            </p>
            <div className="mt-2">
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
          }}
        />
      )}
    </div>
  );
};

export default EditAPI;

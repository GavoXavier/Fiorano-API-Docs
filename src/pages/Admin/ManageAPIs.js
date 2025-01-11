import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const ManageAPIs = () => {
  const [apis, setAPIs] = useState([]);
  const navigate = useNavigate();

  // Fetch APIs from Firestore
  useEffect(() => {
    const fetchAPIs = async () => {
      try {
        const apiSnapshot = await getDocs(collection(db, "apiv2")); // Ensure correct collection
        setAPIs(apiSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching APIs:", error);
        alert("Failed to fetch APIs.");
      }
    };

    fetchAPIs();
  }, []);

  // Delete API
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this API?")) {
      try {
        await deleteDoc(doc(db, "apiv2", id)); // Ensure correct collection
        setAPIs(apis.filter((api) => api.id !== id));
        alert("API deleted successfully!");
      } catch (error) {
        console.error("Error deleting API:", error);
        alert("Failed to delete API.");
      }
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage APIs</h1>
        <button
          onClick={() => navigate("/admin/add-api")}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center space-x-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>Add New API</span>
        </button>
      </div>

      {/* API Table */}
      <table className="w-full bg-white dark:bg-gray-800 rounded shadow">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Endpoint</th>
            <th className="p-2 text-left">Method</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {apis.length > 0 ? (
            apis.map((api) => (
              <tr key={api.id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                <td className="p-2">{api.name}</td>
                <td className="p-2 truncate">{api.endpoint}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
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
                </td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleDelete(api.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-600 dark:text-gray-400">
                No APIs available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageAPIs;

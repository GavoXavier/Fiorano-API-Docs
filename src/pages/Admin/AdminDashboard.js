import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [apis, setApis] = useState([]);
  const [selectedApi, setSelectedApi] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const navigate = useNavigate();

  // Fetch Categories and APIs
  useEffect(() => {
    const fetchData = async () => {
      const categorySnapshot = await getDocs(collection(db, "categories"));
      const apiSnapshot = await getDocs(collection(db, "apis"));

      setCategories(
        categorySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setApis(apiSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
  }, []);

  // Toggle Category Expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  // Handle Dialog Close
  const closeDialog = () => {
    setSelectedApi(null);
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Categories */}
      {categories.map((category) => (
        <div key={category.id} className="mb-6">
          <div
            className="cursor-pointer bg-white dark:bg-gray-800 p-4 rounded shadow mb-2 flex justify-between items-center"
            onClick={() => toggleCategory(category.id)}
          >
            <h2 className="text-lg font-semibold">{category.name}</h2>
            <span
              className={`transform ${
                expandedCategory === category.id ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </div>

          {expandedCategory === category.id && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {apis
                .filter((api) => api.categoryId === category.id)
                .map((api) => (
                  <div
                    key={api.id}
                    className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow group hover:shadow-lg cursor-pointer"
                    onClick={() => setSelectedApi(api)}
                  >
                    <h3 className="text-lg font-bold">{api.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm truncate">
                      {api.endpoint}
                    </p>
                    <div className="flex space-x-2 mt-3">
                      {["GET", "POST", "PUT", "DELETE", "PATCH"].map(
                        (method) =>
                          api.method === method && (
                            <span
                              key={method}
                              className={`px-3 py-1 rounded-full text-xs ${
                                method === "GET"
                                  ? "bg-green-100 text-green-800"
                                  : method === "POST"
                                  ? "bg-blue-100 text-blue-800"
                                  : method === "PUT"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : method === "DELETE"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {method}
                            </span>
                          )
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}

      {/* API Details Dialog */}
      {selectedApi && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-3/4 max-w-4xl overflow-auto max-h-[80vh]">
            <h2 className="text-2xl font-bold mb-4">{selectedApi.name}</h2>
            <table className="table-auto w-full text-left">
              <tbody>
                <tr>
                  <td className="font-semibold py-2">Endpoint:</td>
                  <td>{selectedApi.endpoint}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-2">Method:</td>
                  <td>{selectedApi.method}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-2">Headers:</td>
                  <td>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      {JSON.stringify(selectedApi.headers, null, 2)}
                    </pre>
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold py-2">Request Body:</td>
                  <td>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      {JSON.stringify(selectedApi.requestBody, null, 2)}
                    </pre>
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold py-2">Response Example:</td>
                  <td>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      {JSON.stringify(selectedApi.responseExample, null, 2)}
                    </pre>
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold py-2">Integration:</td>
                  <td>
                    <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      {selectedApi.exampleIntegration}
                    </pre>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={() => navigate(`/admin/edit-api/${selectedApi.id}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit API
              </button>
              <button
                onClick={closeDialog}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

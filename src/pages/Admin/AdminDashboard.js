import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [apis, setApis] = useState([]);
  const [filteredApis, setFilteredApis] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedApi, setSelectedApi] = useState(null); // Holds the selected API for the dialog box
  const navigate = useNavigate();

  // Fetch Categories and APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categorySnapshot = await getDocs(collection(db, "categories"));
        const apiSnapshot = await getDocs(collection(db, "apiv2"));

        setCategories(
          categorySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
        setApis(apiSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  // Filter APIs
  useEffect(() => {
    const filtered = apis.filter((api) => {
      const matchesCategory =
        selectedCategory === null || api.categoryId === selectedCategory;
      const matchesSearch = api.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setFilteredApis(filtered);
  }, [apis, selectedCategory, searchTerm]);

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <input
          type="text"
          placeholder="Search APIs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 sm:mb-0 p-2 w-full sm:w-1/3 border rounded dark:bg-gray-700 dark:text-white"
        />
        <select
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          className="p-2 w-full sm:w-1/4 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Categories and APIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApis.length > 0 ? (
          filteredApis.map((api) => (
            <div
              key={api.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow group hover:shadow-lg cursor-pointer"
              onClick={() => setSelectedApi(api)} // Set the selected API for the dialog box
            >
              <h3 className="text-lg font-bold">{api.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm truncate">
                {api.endpoint}
              </p>
              <div className="flex space-x-2 mt-3">
                {api.method && (
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
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No APIs found matching the criteria.
          </p>
        )}
      </div>

      {/* API Details Dialog */}
      {selectedApi && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-3/4 max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">{selectedApi.name}</h2>
            <div className="overflow-auto max-h-96">
              <table className="table-auto w-full text-left text-sm">
                <tbody>
                  <tr>
                    <th className="px-4 py-2 font-medium">Endpoint:</th>
                    <td className="px-4 py-2">{selectedApi.endpoint}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium">Method:</th>
                    <td className="px-4 py-2">{selectedApi.method}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium">Headers:</th>
                    <td className="px-4 py-2">
                      <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                        {JSON.stringify(selectedApi.headers, null, 2)}
                      </pre>
                    </td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium">Request Body:</th>
                    <td className="px-4 py-2">
                      <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                        {JSON.stringify(selectedApi.requestBody, null, 2)}
                      </pre>
                    </td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium">Response Example:</th>
                    <td className="px-4 py-2">
                      <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                        {JSON.stringify(selectedApi.responseExample, null, 2)}
                      </pre>
                    </td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium">Description:</th>
                    <td className="px-4 py-2">{selectedApi.description}</td>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 font-medium">Example Integration:</th>
                    <td className="px-4 py-2">{selectedApi.exampleIntegration}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => navigate(`/admin/edit-api/${selectedApi.id}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => setSelectedApi(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

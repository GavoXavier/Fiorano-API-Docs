import React, { useState, useEffect } from "react";
import { doc, updateDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase";

const EditAPIOverview = ({ api, onClose, onUpdate }) => {
  const [editFormData, setEditFormData] = useState({ ...api });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categorySnapshot = await getDocs(collection(db, "categories"));
      setCategories(
        categorySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    };
    fetchCategories();
  }, []);

  // Handle input changes for general fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // Handle toggle for requiresAuth
  const handleToggleAuth = () => {
    setEditFormData((prev) => ({ ...prev, requiresAuth: !prev.requiresAuth }));
  };

  // Handle map-like fields (e.g., headers, queryParams, responseExample)
  const handleMapChange = (field, key, value) => {
    const updatedField = { ...editFormData[field], [key]: value };
    setEditFormData({ ...editFormData, [field]: updatedField });
  };

  const addMapField = (field) => {
    const updatedField = { ...editFormData[field], "": "" };
    setEditFormData({ ...editFormData, [field]: updatedField });
  };

  const removeMapField = (field, key) => {
    const updatedField = { ...editFormData[field] };
    delete updatedField[key];
    setEditFormData({ ...editFormData, [field]: updatedField });
  };

  // Handle updating the API in Firestore
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const apiRef = doc(db, "apiv2", api.id);
      await updateDoc(apiRef, editFormData);
      alert("API updated successfully!");
      onUpdate(editFormData);
      onClose();
    } catch (error) {
      console.error("Error updating API: ", error);
      alert("Failed to update API.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-3/4 max-w-4xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">Edit API: {api.name}</h2>
        <form onSubmit={handleUpdate}>
          <div className="overflow-y-auto max-h-[70vh]">
            {/* API Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium">
                API Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={editFormData.name || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Endpoint */}
            <div className="mb-4">
              <label htmlFor="endpoint" className="block text-sm font-medium">
                Endpoint
              </label>
              <input
                type="text"
                id="endpoint"
                name="endpoint"
                value={editFormData.endpoint || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Method */}
            <div className="mb-4">
              <label htmlFor="method" className="block text-sm font-medium">
                Method
              </label>
              <select
                id="method"
                name="method"
                value={editFormData.method || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              >
                {["GET", "POST", "PUT", "DELETE", "PATCH"].map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="mb-4">
              <label htmlFor="categoryId" className="block text-sm font-medium">
                Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={editFormData.categoryId || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Requires Authentication */}
            <div className="mb-4 flex items-center">
              <label htmlFor="requiresAuth" className="text-sm font-medium mr-4">
                Requires Authentication
              </label>
              <input
                type="checkbox"
                id="requiresAuth"
                name="requiresAuth"
                checked={editFormData.requiresAuth || false}
                onChange={handleToggleAuth}
                className="w-5 h-5"
              />
            </div>

            {/* Headers */}
            <div className="mb-4">
              <label className="block text-sm font-medium">Headers</label>
              {Object.entries(editFormData.headers || {}).map(([key, value], index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    placeholder="Key"
                    value={key}
                    onChange={(e) => handleMapChange("headers", e.target.value, value)}
                    className="flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white mr-2"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={value}
                    onChange={(e) => handleMapChange("headers", key, e.target.value)}
                    className="flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white mr-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeMapField("headers", key)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addMapField("headers")}
                className="text-blue-500"
              >
                Add Header
              </button>
            </div>

            {/* Request Body */}
            <div className="mb-4">
              <label htmlFor="requestBody" className="block text-sm font-medium">
                Request Body
              </label>
              <textarea
                id="requestBody"
                name="requestBody"
                value={JSON.stringify(editFormData.requestBody || {}, null, 2)}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    requestBody: JSON.parse(e.target.value || "{}"),
                  })
                }
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                rows="5"
              />
            </div>

            {/* Response Example */}
            <div className="mb-4">
              <label
                htmlFor="responseExample"
                className="block text-sm font-medium"
              >
                Response Example
              </label>
              <textarea
                id="responseExample"
                name="responseExample"
                value={JSON.stringify(
                  editFormData.responseExample || {},
                  null,
                  2
                )}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    responseExample: JSON.parse(e.target.value || "{}"),
                  })
                }
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                rows="5"
              />
            </div>

            {/* Example Integration */}
            <div className="mb-4">
              <label
                htmlFor="exampleIntegration"
                className="block text-sm font-medium"
              >
                Example Integration (cURL)
              </label>
              <textarea
                id="exampleIntegration"
                name="exampleIntegration"
                value={editFormData.exampleIntegration || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                rows="5"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAPIOverview;

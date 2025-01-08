import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const EditAPIOverview = ({ api, categories, closeModal, updateAPI }) => {
  const [formData, setFormData] = useState({
    ...api,
    headers: JSON.stringify(api.headers || {}, null, 2),
    requestBody: JSON.stringify(api.requestBody || {}, null, 2),
    responseExample: JSON.stringify(api.responseExample || {}, null, 2),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiRef = doc(db, "apiv2", api.id);
      const updatedData = {
        ...formData,
        headers: JSON.parse(formData.headers),
        requestBody: JSON.parse(formData.requestBody),
        responseExample: JSON.parse(formData.responseExample),
      };
      await updateDoc(apiRef, updatedData);
      updateAPI({ id: api.id, ...updatedData });
      closeModal();
      alert("API updated successfully!");
    } catch (error) {
      console.error("Error updating API:", error);
      alert("Failed to update API.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-3/4 max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit API: {api.name}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Endpoint</label>
            <input
              type="text"
              name="endpoint"
              value={formData.endpoint}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Method</label>
            <select
              name="method"
              value={formData.method}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              {["GET", "POST", "PUT", "DELETE", "PATCH"].map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Headers (JSON)</label>
            <textarea
              name="headers"
              value={formData.headers}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              rows="4"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Request Body (JSON)</label>
            <textarea
              name="requestBody"
              value={formData.requestBody}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              rows="4"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Example Integration (cURL)</label>
            <textarea
              name="exampleIntegration"
              value={formData.exampleIntegration}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              rows="4"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              rows="3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update API
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAPIOverview;

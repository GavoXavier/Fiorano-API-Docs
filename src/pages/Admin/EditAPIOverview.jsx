import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const EditAPIOverview = ({ api, onClose, onUpdate }) => {
  const [editFormData, setEditFormData] = useState({
    name: api.name || "",
    endpoint: api.endpoint || "",
    method: api.method || "POST",
    headers: api.headers || [],
    queryParams: api.queryParams || [],
    requestBody: api.requestBody || [],
    responseBody: api.responseBody || [],
    statusCodes: api.statusCodes || [],
    exampleRequestBody: api.exampleRequestBody || "",
    exampleResponseBody: api.exampleResponseBody || "",
    description: api.description || "",
    exampleIntegration: api.exampleIntegration || "",
    requiresAuth: api.requiresAuth || false,
    categoryId: api.categoryId || "",
  });

  // const [activeTab, setActiveTab] = useState("headers");

  // Handle input changes for form fields
  const handleInputChange = (field, value) => {
    setEditFormData({ ...editFormData, [field]: value });
  };

  // Handle array field changes (headers, queryParams, statusCodes, requestBody, responseBody)
  const handleArrayFieldChange = (field, index, key, value) => {
    const updatedField = [...editFormData[field]];
    updatedField[index][key] = value;
    setEditFormData({ ...editFormData, [field]: updatedField });
  };

  const addField = (field) => {
    const newField =
      field === "statusCodes"
        ? { code: "", message: "", description: "" }
        : { name: "", type: "", description: "" };
    setEditFormData({ ...editFormData, [field]: [...editFormData[field], newField] });
  };

  const removeField = (field, index) => {
    const updatedField = editFormData[field].filter((_, i) => i !== index);
    setEditFormData({ ...editFormData, [field]: updatedField });
  };

  // Handle form submission and Firestore update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const apiRef = doc(db, "apiv2", api.id);
      await updateDoc(apiRef, editFormData);
      alert("API updated successfully!");
      onUpdate(editFormData);
      onClose();
    } catch (error) {
      console.error("Error updating API:", error);
      alert("Failed to update API.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-5xl rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">Edit API: {api.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleUpdate} className="p-4 overflow-y-auto max-h-[75vh] grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Information */}
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <div className="mb-4">
              <label className="block mb-2 font-medium">API Name</label>
              <input
                type="text"
                value={editFormData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Endpoint</label>
              <input
                type="text"
                value={editFormData.endpoint}
                onChange={(e) => handleInputChange("endpoint", e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Method</label>
              <select
                value={editFormData.method}
                onChange={(e) => handleInputChange("method", e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded"
              >
                {["GET", "POST", "PUT", "DELETE", "PATCH"].map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Description</label>
              <textarea
                value={editFormData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded"
                rows="5"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editFormData.requiresAuth}
                  onChange={(e) => handleInputChange("requiresAuth", e.target.checked)}
                  className="mr-2"
                />
                Requires Authentication
              </label>
            </div>
          </div>

          {/* Tabs for headers, requestBody, and responseBody */}
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Headers</h3>
              {editFormData.headers.map((header, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={header.name}
                    onChange={(e) => handleArrayFieldChange("headers", index, "name", e.target.value)}
                    className="w-1/3 p-3 bg-gray-700 text-white rounded"
                  />
                  <input
                    type="text"
                    placeholder="Type"
                    value={header.type}
                    onChange={(e) => handleArrayFieldChange("headers", index, "type", e.target.value)}
                    className="w-1/3 p-3 bg-gray-700 text-white rounded"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={header.description}
                    onChange={(e) => handleArrayFieldChange("headers", index, "description", e.target.value)}
                    className="w-1/3 p-3 bg-gray-700 text-white rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeField("headers", index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField("headers")}
                className="text-blue-500"
              >
                Add Header
              </button>
            </div>

            {/* Request Body */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Request Body</h3>
              {editFormData.requestBody.map((field, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={field.name}
                    onChange={(e) => handleArrayFieldChange("requestBody", index, "name", e.target.value)}
                    className="w-1/3 p-3 bg-gray-700 text-white rounded"
                  />
                  <input
                    type="text"
                    placeholder="Type"
                    value={field.type}
                    onChange={(e) => handleArrayFieldChange("requestBody", index, "type", e.target.value)}
                    className="w-1/3 p-3 bg-gray-700 text-white rounded"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={field.description}
                    onChange={(e) => handleArrayFieldChange("requestBody", index, "description", e.target.value)}
                    className="w-1/3 p-3 bg-gray-700 text-white rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeField("requestBody", index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField("requestBody")}
                className="text-blue-500"
              >
                Add Request Field
              </button>
            </div>

            {/* Response Body */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Response Body</h3>
              {editFormData.responseBody.map((field, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={field.name}
                    onChange={(e) => handleArrayFieldChange("responseBody", index, "name", e.target.value)}
                    className="w-1/3 p-3 bg-gray-700 text-white rounded"
                  />
                  <input
                    type="text"
                    placeholder="Type"
                    value={field.type}
                    onChange={(e) => handleArrayFieldChange("responseBody", index, "type", e.target.value)}
                    className="w-1/3 p-3 bg-gray-700 text-white rounded"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={field.description}
                    onChange={(e) => handleArrayFieldChange("responseBody", index, "description", e.target.value)}
                    className="w-1/3 p-3 bg-gray-700 text-white rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeField("responseBody", index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField("responseBody")}
                className="text-blue-500"
              >
                Add Response Field
              </button>
            </div>
          </div>

          {/* Example and Status Codes */}
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <div className="mb-4">
              <label className="block mb-2 font-medium">Example Request Body (JSON)</label>
              <textarea
                value={editFormData.exampleRequestBody}
                onChange={(e) => handleInputChange("exampleRequestBody", e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded"
                rows="5"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Example Response Body (JSON)</label>
              <textarea
                value={editFormData.exampleResponseBody}
                onChange={(e) => handleInputChange("exampleResponseBody", e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded"
                rows="5"
              ></textarea>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Status Codes</h3>
              {editFormData.statusCodes.map((code, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Code"
                    value={code.code}
                    onChange={(e) => handleArrayFieldChange("statusCodes", index, "code", e.target.value)}
                    className="w-1/4 p-3 bg-gray-700 text-white rounded"
                  />
                  <input
                    type="text"
                    placeholder="Message"
                    value={code.message}
                    onChange={(e) => handleArrayFieldChange("statusCodes", index, "message", e.target.value)}
                    className="w-1/4 p-3 bg-gray-700 text-white rounded"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={code.description}
                    onChange={(e) => handleArrayFieldChange("statusCodes", index, "description", e.target.value)}
                    className="w-1/3 p-3 bg-gray-700 text-white rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeField("statusCodes", index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField("statusCodes")}
                className="text-blue-500"
              >
                Add Status Code
              </button>
            </div>
            <div>
              <label className="block mb-2 font-medium">Example Integration (cURL)</label>
              <textarea
                value={editFormData.exampleIntegration}
                onChange={(e) => handleInputChange("exampleIntegration", e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded"
                rows="5"
              ></textarea>
            </div>
          </div>
        </form>

        <div className="flex justify-end space-x-4 p-4 border-t dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAPIOverview;

import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

const Schemas = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    headers: [],
    queryParams: [],
    requestBody: [],
    responseBody: [],
    responseCodes: [],
  });

  // Handle input changes for top-level fields
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle input changes for array fields
  const handleArrayFieldChange = (field, index, key, value) => {
    const updatedField = [...formData[field]];
    updatedField[index][key] = value;
    setFormData({ ...formData, [field]: updatedField });
  };

  // Add a new field to array fields
  const addArrayField = (field) => {
    const newField =
      field === "responseCodes"
        ? { code: "", description: "" }
        : { name: "", type: "", description: "" };

    setFormData({ ...formData, [field]: [...formData[field], newField] });
  };

  // Remove a field from array fields
  const removeArrayField = (field, index) => {
    const updatedField = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updatedField });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "schemas"), formData);
      alert("Schema added successfully!");
      setFormData({
        name: "",
        description: "",
        headers: [],
        queryParams: [],
        requestBody: [],
        responseBody: [],
        responseCodes: [],
      });
    } catch (error) {
      console.error("Error adding schema:", error);
      alert("Failed to add schema.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Define Schema</h1>
      <form onSubmit={handleSubmit} className="grid gap-6">
        {/* Schema Name */}
        <div>
          <label className="block text-sm font-medium">Schema Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full p-3 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="w-full p-3 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
            rows="3"
          />
        </div>

        {/* Headers */}
        <div>
          <h2 className="text-lg font-semibold">Headers</h2>
          {formData.headers.map((header, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Key"
                value={header.name}
                onChange={(e) =>
                  handleArrayFieldChange("headers", index, "name", e.target.value)
                }
                className="w-1/3 p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <select
                value={header.type}
                onChange={(e) =>
                  handleArrayFieldChange("headers", index, "type", e.target.value)
                }
                className="w-1/3 p-2 border rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="">Type</option>
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
              </select>
              <input
                type="text"
                placeholder="Description"
                value={header.description}
                onChange={(e) =>
                  handleArrayFieldChange("headers", index, "description", e.target.value)
                }
                className="w-1/3 p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={() => removeArrayField("headers", index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField("headers")}
            className="text-blue-500"
          >
            Add Header
          </button>
        </div>

        {/* Query Parameters */}
        <div>
          <h2 className="text-lg font-semibold">Query Parameters</h2>
          {formData.queryParams.map((param, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Name"
                value={param.name}
                onChange={(e) =>
                  handleArrayFieldChange("queryParams", index, "name", e.target.value)
                }
                className="w-1/3 p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <select
                value={param.type}
                onChange={(e) =>
                  handleArrayFieldChange("queryParams", index, "type", e.target.value)
                }
                className="w-1/3 p-2 border rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="">Type</option>
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
              </select>
              <input
                type="text"
                placeholder="Description"
                value={param.description}
                onChange={(e) =>
                  handleArrayFieldChange("queryParams", index, "description", e.target.value)
                }
                className="w-1/3 p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={() => removeArrayField("queryParams", index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField("queryParams")}
            className="text-blue-500"
          >
            Add Query Parameter
          </button>
        </div>

        {/* Request Body */}
        <div>
          <h2 className="text-lg font-semibold">Request Body</h2>
          {formData.requestBody.map((field, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Name"
                value={field.name}
                onChange={(e) =>
                  handleArrayFieldChange("requestBody", index, "name", e.target.value)
                }
                className="w-1/3 p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <select
                value={field.type}
                onChange={(e) =>
                  handleArrayFieldChange("requestBody", index, "type", e.target.value)
                }
                className="w-1/3 p-2 border rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="">Type</option>
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="array">Array</option>
              </select>
              <input
                type="text"
                placeholder="Description"
                value={field.description}
                onChange={(e) =>
                  handleArrayFieldChange("requestBody", index, "description", e.target.value)
                }
                className="w-1/3 p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={() => removeArrayField("requestBody", index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField("requestBody")}
            className="text-blue-500"
          >
            Add Request Body Field
          </button>
        </div>

        {/* Response Body */}
        <div>
          <h2 className="text-lg font-semibold">Response Body</h2>
          {formData.responseBody.map((field, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Name"
                value={field.name}
                onChange={(e) =>
                  handleArrayFieldChange("responseBody", index, "name", e.target.value)
                }
                className="w-1/3 p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <select
                value={field.type}
                onChange={(e) =>
                  handleArrayFieldChange("responseBody", index, "type", e.target.value)
                }
                className="w-1/3 p-2 border rounded dark:bg-gray-700 dark:text-white"
              >
                <option value="">Type</option>
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
              </select>
              <input
                type="text"
                placeholder="Description"
                value={field.description}
                onChange={(e) =>
                  handleArrayFieldChange("responseBody", index, "description", e.target.value)
                }
                className="w-1/3 p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={() => removeArrayField("responseBody", index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField("responseBody")}
            className="text-blue-500"
          >
            Add Response Body Field
          </button>
        </div>

        {/* Response Codes */}
        <div>
          <h2 className="text-lg font-semibold">Response Codes</h2>
          {formData.responseCodes.map((code, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Code"
                value={code.code}
                onChange={(e) =>
                  handleArrayFieldChange("responseCodes", index, "code", e.target.value)
                }
                className="w-1/3 p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                placeholder="Description"
                value={code.description}
                onChange={(e) =>
                  handleArrayFieldChange("responseCodes", index, "description", e.target.value)
                }
                className="w-2/3 p-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={() => removeArrayField("responseCodes", index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField("responseCodes")}
            className="text-blue-500"
          >
            Add Response Code
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded"
        >
          Save Schema
        </button>
      </form>
    </div>
  );
};

export default Schemas;

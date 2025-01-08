import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

// Default templates for fields
const defaultHeaders = JSON.stringify(
  {
    Authorization: "Bearer YOUR_TOKEN_HERE",
    "Content-Type": "application/json",
  },
  null,
  2
);

const defaultRequestBody = JSON.stringify(
  {
    key1: "value1",
    key2: "value2",
  },
  null,
  2
);

const defaultResponseExample = JSON.stringify(
  {
    status: "success",
    data: {
      exampleKey: "exampleValue",
    },
  },
  null,
  2
);

const defaultIntegrationCode = `
curl --request POST \\
--url https://example.com/api/endpoint \\
--header 'Authorization: Bearer YOUR_TOKEN_HERE' \\
--header 'Content-Type: application/json' \\
--data '{
  "key1": "value1",
  "key2": "value2"
}'
`;

const AddAPI = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    endpoint: "",
    method: "POST",
    headers: defaultHeaders,
    requestBody: defaultRequestBody,
    responseExample: defaultResponseExample,
    description: "",
    categoryId: "",
    exampleIntegration: defaultIntegrationCode,
    dataType: "raw",
    formData: [{ key: "", value: "" }], // Key-value for form-data or x-www-form-urlencoded
    graphqlQuery: "",
    graphqlVariables: JSON.stringify({}, null, 2), // GraphQL default
  });

  // Fetch categories from Firestore
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

  // Validate JSON input
  const isValidJSON = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidJSON(formData.headers)) {
      alert("Headers must be a valid JSON.");
      return;
    }
    if (!isValidJSON(formData.requestBody) && formData.dataType === "raw") {
      alert("Request Body must be a valid JSON.");
      return;
    }
    if (!isValidJSON(formData.responseExample)) {
      alert("Response Example must be a valid JSON.");
      return;
    }
    if (!isValidJSON(formData.graphqlVariables) && formData.dataType === "graphql") {
      alert("GraphQL Variables must be valid JSON.");
      return;
    }

    // Prepare requestBody based on dataType
    const requestBody =
      formData.dataType === "raw"
        ? JSON.parse(formData.requestBody)
        : formData.dataType === "form-data" || formData.dataType === "x-www-form-urlencoded"
        ? Object.fromEntries(formData.formData.map((field) => [field.key, field.value]))
        : formData.dataType === "graphql"
        ? {
            query: formData.graphqlQuery,
            variables: JSON.parse(formData.graphqlVariables),
          }
        : null;

    const apiData = {
      ...formData,
      headers: JSON.parse(formData.headers),
      responseExample: JSON.parse(formData.responseExample),
      requestBody,
    };

    try {
      await addDoc(collection(db, "apiv2"), apiData);
      alert("API added successfully!");
      setFormData({
        name: "",
        endpoint: "",
        method: "POST",
        headers: defaultHeaders,
        requestBody: defaultRequestBody,
        responseExample: defaultResponseExample,
        description: "",
        categoryId: "",
        exampleIntegration: defaultIntegrationCode,
        dataType: "raw",
        formData: [{ key: "", value: "" }],
        graphqlQuery: "",
        graphqlVariables: JSON.stringify({}, null, 2),
      });
    } catch (error) {
      console.error("Error adding API:", error);
      alert("Failed to add API.");
    }
  };

  // Handle form field updates
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormDataChange = (index, field, value) => {
    const updatedFormData = [...formData.formData];
    updatedFormData[index][field] = value;
    setFormData({ ...formData, formData: updatedFormData });
  };

  const addFormDataField = () => {
    setFormData({
      ...formData,
      formData: [...formData.formData, { key: "", value: "" }],
    });
  };

  const removeFormDataField = (index) => {
    const updatedFormData = formData.formData.filter((_, i) => i !== index);
    setFormData({ ...formData, formData: updatedFormData });
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Add New API</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded shadow">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">
            API Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="endpoint" className="block text-sm font-medium">
            Endpoint
          </label>
          <input
            type="text"
            id="endpoint"
            name="endpoint"
            value={formData.endpoint}
            onChange={handleInputChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="method" className="block text-sm font-medium">
            Method
          </label>
          <select
            id="method"
            name="method"
            value={formData.method}
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
        <div className="mb-4">
          <label htmlFor="categoryId" className="block text-sm font-medium">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
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
        <div className="mb-4">
          <label htmlFor="dataType" className="block text-sm font-medium">
            Request Body Type
          </label>
          <div className="flex space-x-4">
            {["none", "form-data", "x-www-form-urlencoded", "raw", "binary", "graphql"].map((type) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="dataType"
                  value={type}
                  checked={formData.dataType === type}
                  onChange={handleInputChange}
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Conditional request body fields */}
        {formData.dataType === "raw" && (
          <div className="mb-4">
            <label htmlFor="requestBody" className="block text-sm font-medium">
              Raw JSON
            </label>
            <textarea
              id="requestBody"
              name="requestBody"
              value={formData.requestBody}
              onChange={handleInputChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              rows="5"
            />
          </div>
        )}
        {(formData.dataType === "form-data" || formData.dataType === "x-www-form-urlencoded") && (
          <div className="mb-4">
            <label className="block text-sm font-medium">Key-Value Pairs</label>
            {formData.formData.map((field, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Key"
                  value={field.key}
                  onChange={(e) => handleFormDataChange(index, "key", e.target.value)}
                  className="p-2 border rounded dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={field.value}
                  onChange={(e) => handleFormDataChange(index, "value", e.target.value)}
                  className="p-2 border rounded dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => removeFormDataField(index)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addFormDataField} className="text-blue-500">
              Add Field
            </button>
          </div>
        )}
        {formData.dataType === "binary" && (
          <div className="mb-4">
            <label htmlFor="binaryFile" className="block text-sm font-medium">
              Binary File
            </label>
            <input type="file" id="binaryFile" className="w-full p-2 border rounded dark:bg-gray-700" />
          </div>
        )}
        {formData.dataType === "graphql" && (
          <>
            <div className="mb-4">
              <label htmlFor="graphqlQuery" className="block text-sm font-medium">
                Query
              </label>
              <textarea
                id="graphqlQuery"
                name="graphqlQuery"
                value={formData.graphqlQuery}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                rows="5"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="graphqlVariables" className="block text-sm font-medium">
                Variables
              </label>
              <textarea
                id="graphqlVariables"
                name="graphqlVariables"
                value={formData.graphqlVariables}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                rows="5"
              />
            </div>
          </>
        )}

        <div className="mb-4">
          <label htmlFor="exampleIntegration" className="block text-sm font-medium">
            Integration Code (cURL)
          </label>
          <textarea
            id="exampleIntegration"
            name="exampleIntegration"
            value={formData.exampleIntegration}
            onChange={handleInputChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            rows="5"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="responseExample" className="block text-sm font-medium">
            Response Example (JSON)
          </label>
          <textarea
            id="responseExample"
            name="responseExample"
            value={formData.responseExample}
            onChange={handleInputChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            rows="5"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            rows="3"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add API
        </button>
      </form>
    </div>
  );
};

export default AddAPI;

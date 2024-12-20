import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

// Predefined JSON templates
const defaultHeaders = JSON.stringify(
  {
    "Authorization": "Bearer YOUR_TOKEN_HERE",
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
    exampleIntegration: "",
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const categorySnapshot = await getDocs(collection(db, "categories"));
      setCategories(
        categorySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchCategories();
  }, []);

  // Validate JSON inputs
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
      alert("Headers field must contain valid JSON.");
      return;
    }
    if (!isValidJSON(formData.requestBody)) {
      alert("Request Body field must contain valid JSON.");
      return;
    }
    if (!isValidJSON(formData.responseExample)) {
      alert("Response Example field must contain valid JSON.");
      return;
    }

    const data = {
      ...formData,
      headers: JSON.parse(formData.headers),
      requestBody: JSON.parse(formData.requestBody),
      responseExample: JSON.parse(formData.responseExample),
    };

    try {
      await addDoc(collection(db, "apis"), data);
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
        exampleIntegration: "",
      });
    } catch (error) {
      console.error("Error adding API:", error);
      alert("Failed to add API.");
    }
  };

  // Reset individual fields
  const resetField = (field) => {
    switch (field) {
      case "headers":
        setFormData({ ...formData, headers: defaultHeaders });
        break;
      case "requestBody":
        setFormData({ ...formData, requestBody: defaultRequestBody });
        break;
      case "responseExample":
        setFormData({ ...formData, responseExample: defaultResponseExample });
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Add New API</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-4 rounded shadow"
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">
            API Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
            value={formData.endpoint}
            onChange={(e) =>
              setFormData({ ...formData, endpoint: e.target.value })
            }
            className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="method" className="block text-sm font-medium">
            Method
          </label>
          <select
            id="method"
            value={formData.method}
            onChange={(e) =>
              setFormData({ ...formData, method: e.target.value })
            }
            className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
            <option value="OPTIONS">OPTIONS</option>
            <option value="HEAD">HEAD</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="headers" className="block text-sm font-medium">
            Headers (JSON)
          </label>
          <textarea
            id="headers"
            value={formData.headers}
            onChange={(e) =>
              setFormData({ ...formData, headers: e.target.value })
            }
            className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows="4"
          />
          <button
            type="button"
            onClick={() => resetField("headers")}
            className="mt-1 text-sm text-blue-500 underline"
          >
            Reset to Default
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="requestBody" className="block text-sm font-medium">
            Request Body (JSON)
          </label>
          <textarea
            id="requestBody"
            value={formData.requestBody}
            onChange={(e) =>
              setFormData({ ...formData, requestBody: e.target.value })
            }
            className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows="4"
          />
          <button
            type="button"
            onClick={() => resetField("requestBody")}
            className="mt-1 text-sm text-blue-500 underline"
          >
            Reset to Default
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="responseExample" className="block text-sm font-medium">
            Response Example (JSON)
          </label>
          <textarea
            id="responseExample"
            value={formData.responseExample}
            onChange={(e) =>
              setFormData({ ...formData, responseExample: e.target.value })
            }
            className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows="4"
          />
          <button
            type="button"
            onClick={() => resetField("responseExample")}
            className="mt-1 text-sm text-blue-500 underline"
          >
            Reset to Default
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows="3"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium"
          >
            Assign to Category
          </label>
          <select
            id="categoryId"
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({ ...formData, categoryId: e.target.value })
            }
            className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add API
        </button>
      </form>
    </div>
  );
};

export default AddAPI;

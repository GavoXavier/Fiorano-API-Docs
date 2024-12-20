import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc, getDocs, collection } from "firebase/firestore";

// Default JSON templates
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

const EditAPI = () => {
  const { id } = useParams(); // Get API ID from the URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    endpoint: "",
    method: "GET",
    headers: defaultHeaders,
    requestBody: defaultRequestBody,
    responseExample: defaultResponseExample,
    description: "",
    categoryId: "",
    exampleIntegration: "",
  });

  const [categories, setCategories] = useState([]);

  // Fetch API Details and Categories
  useEffect(() => {
    const fetchAPI = async () => {
      const apiRef = doc(db, "apis", id);
      const apiDoc = await getDoc(apiRef);

      if (apiDoc.exists()) {
        const apiData = apiDoc.data();
        setFormData({
          name: apiData.name,
          endpoint: apiData.endpoint,
          method: apiData.method,
          headers: JSON.stringify(apiData.headers, null, 2),
          requestBody: JSON.stringify(apiData.requestBody, null, 2),
          responseExample: JSON.stringify(apiData.responseExample, null, 2),
          description: apiData.description,
          categoryId: apiData.categoryId,
          exampleIntegration: apiData.exampleIntegration,
        });
      }
    };

    const fetchCategories = async () => {
      const categorySnapshot = await getDocs(collection(db, "categories"));
      setCategories(
        categorySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchAPI();
    fetchCategories();
  }, [id]);

  // Validate JSON inputs
  const isValidJSON = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidJSON(formData.headers)) {
      alert("Headers must be valid JSON.");
      return;
    }
    if (!isValidJSON(formData.requestBody)) {
      alert("Request Body must be valid JSON.");
      return;
    }
    if (!isValidJSON(formData.responseExample)) {
      alert("Response Example must be valid JSON.");
      return;
    }

    const updatedData = {
      ...formData,
      headers: JSON.parse(formData.headers || "{}"),
      requestBody: JSON.parse(formData.requestBody || "{}"),
      responseExample: JSON.parse(formData.responseExample || "{}"),
    };

    const apiRef = doc(db, "apis", id);
    await updateDoc(apiRef, updatedData);

    alert("API updated successfully!");
    navigate("/admin/dashboard");
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Edit API</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md max-w-3xl mx-auto"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            API Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="endpoint">
            Endpoint
          </label>
          <input
            type="text"
            id="endpoint"
            value={formData.endpoint}
            onChange={(e) =>
              setFormData({ ...formData, endpoint: e.target.value })
            }
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="method">
            Method
          </label>
          <select
            id="method"
            value={formData.method}
            onChange={(e) =>
              setFormData({ ...formData, method: e.target.value })
            }
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="headers">
            Headers (JSON)
          </label>
          <textarea
            id="headers"
            value={formData.headers}
            onChange={(e) =>
              setFormData({ ...formData, headers: e.target.value })
            }
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            rows="5"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="requestBody"
          >
            Request Body (JSON)
          </label>
          <textarea
            id="requestBody"
            value={formData.requestBody}
            onChange={(e) =>
              setFormData({ ...formData, requestBody: e.target.value })
            }
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            rows="5"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="responseExample"
          >
            Response Example (JSON)
          </label>
          <textarea
            id="responseExample"
            value={formData.responseExample}
            onChange={(e) =>
              setFormData({ ...formData, responseExample: e.target.value })
            }
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            rows="5"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="exampleIntegration"
          >
            Example Integration
          </label>
          <textarea
            id="exampleIntegration"
            value={formData.exampleIntegration}
            onChange={(e) =>
              setFormData({
                ...formData,
                exampleIntegration: e.target.value,
              })
            }
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            rows="3"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="categoryId">
            Assign to Category
          </label>
          <select
            id="categoryId"
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({ ...formData, categoryId: e.target.value })
            }
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Select a Category</option>
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
            onClick={() => navigate("/admin/dashboard")}
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
  );
};

export default EditAPI;

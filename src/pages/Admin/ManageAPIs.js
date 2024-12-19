import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

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
    "key1": "value1",
    "key2": "value2",
  },
  null,
  2
);

const defaultResponseExample = JSON.stringify(
  {
    "status": "success",
    "data": {
      "exampleKey": "exampleValue",
    },
  },
  null,
  2
);

const ManageAPIs = () => {
  const [apis, setAPIs] = useState([]);
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
  const [editId, setEditId] = useState(null);

  // Fetch APIs and Categories
  useEffect(() => {
    const fetchData = async () => {
      const categorySnapshot = await getDocs(collection(db, "categories"));
      const apiSnapshot = await getDocs(collection(db, "apis"));

      setCategories(
        categorySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setAPIs(apiSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
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
      headers: JSON.parse(formData.headers || "{}"),
      requestBody: JSON.parse(formData.requestBody || "{}"),
      responseExample: JSON.parse(formData.responseExample || "{}"),
    };

    if (editId) {
      await updateDoc(doc(db, "apis", editId), data);
      alert("API updated successfully!");
    } else {
      await addDoc(collection(db, "apis"), data);
      alert("API added successfully!");
    }

    resetForm();
  };

  // Reset form fields
  const resetForm = () => {
    setEditId(null);
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

  // Edit API
  const handleEdit = (api) => {
    setFormData({
      name: api.name,
      endpoint: api.endpoint,
      method: api.method,
      headers: JSON.stringify(api.headers || {}, null, 2),
      requestBody: JSON.stringify(api.requestBody || {}, null, 2),
      responseExample: JSON.stringify(api.responseExample || {}, null, 2),
      description: api.description || "",
      categoryId: api.categoryId || "",
      exampleIntegration: api.exampleIntegration || "",
    });
    setEditId(api.id);
  };

  // Delete API
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this API?")) {
      await deleteDoc(doc(db, "apis", id));
      alert("API deleted successfully!");
      setAPIs(apis.filter((api) => api.id !== id));
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Manage APIs</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6"
      >
        <h2 className="text-xl mb-4">{editId ? "Edit API" : "Add New API"}</h2>
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
            rows="5"
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
            rows="5"
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
            rows="5"
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
            rows="2"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="exampleIntegration"
            className="block text-sm font-medium"
          >
            Example Integration (cURL or others)
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
            className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows="3"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="categoryId" className="block text-sm font-medium">
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
          {editId ? "Update API" : "Add API"}
        </button>
      </form>
      <table className="w-full bg-white dark:bg-gray-800 rounded shadow">
        <thead>
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Endpoint</th>
            <th className="p-2 text-left">Method</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {apis.map((api) => (
            <tr key={api.id}>
              <td className="p-2">{api.name}</td>
              <td className="p-2">{api.endpoint}</td>
              <td className="p-2">{api.method}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => handleEdit(api)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(api.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageAPIs;

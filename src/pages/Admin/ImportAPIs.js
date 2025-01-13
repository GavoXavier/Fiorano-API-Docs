import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

const defaultAPIData = {
  name: "",
  endpoint: "",
  method: "GET",
  headers: [],
  queryParams: [],
  requestBody: "",
  description: "",
  categoryId: "",
  exampleIntegration: "",
  responseExample: "",
};

const ImportAPIs = () => {
  const [categories, setCategories] = useState([]);
  const [analyzedAPIs, setAnalyzedAPIs] = useState([]);
  const [currentAPI, setCurrentAPI] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // Handle File Upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        analyzeJSON(jsonData);
      } catch (error) {
        alert("Invalid JSON file.");
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  // Analyze and Map the JSON Data
  const analyzeJSON = (jsonData) => {
    let apis = [];
    try {
      if (Array.isArray(jsonData)) {
        apis = mapPostmanCollection(jsonData);
      } else if (jsonData.item) {
        apis = mapPostmanCollection(jsonData.item);
      } else {
        alert("Unsupported JSON format.");
        return;
      }
      setAnalyzedAPIs(apis);
    } catch (error) {
      alert("Error analyzing the file.");
      console.error(error);
    }
  };

  // Map Postman Collection to Your Schema
  const mapPostmanCollection = (items) => {
    return items.map((item) => {
      const endpoint = item.request?.url?.raw || item.request?.url;
      const method = item.request?.method || "GET";
      const headers = (item.request?.header || []).map((h) => ({
        key: h.key,
        value: h.value,
      }));
      const queryParams = item.request?.url?.query || [];
      const requestBody = item.request?.body?.raw || "";
      const description = item.name || "";
      const exampleIntegration = generateCurlCommand(method, endpoint, headers, requestBody);

      return {
        ...defaultAPIData,
        name: item.name || "",
        endpoint,
        method,
        headers,
        queryParams: queryParams.map((q) => ({ key: q.key, value: q.value })),
        requestBody,
        description,
        exampleIntegration,
      };
    });
  };

  // Generate cURL Command for Integration
  const generateCurlCommand = (method, url, headers, body) => {
    const headersString = headers
      .map(({ key, value }) => `-H "${key}: ${value}"`)
      .join(" \\ \n");

    return `curl -X ${method} ${url} \\ \n${headersString} ${
      body ? `\\ \n-d '${body}'` : ""
    }`;
  };

  // Handle API Save
  const handleSaveAPI = async () => {
    if (!currentAPI) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "apiv2"), currentAPI);
      alert("API saved successfully!");
      setCurrentAPI(null);
      setAnalyzedAPIs(analyzedAPIs.filter((api) => api !== currentAPI));
    } catch (error) {
      console.error("Error saving API:", error);
      alert("Failed to save API.");
    } finally {
      setLoading(false);
    }
  };

  // Open API for Editing
  const openAPIForEditing = (api) => {
    setCurrentAPI(api);
  };

  // Handle Input Changes for Current API
  const handleInputChange = (field, value) => {
    setCurrentAPI({ ...currentAPI, [field]: value });
  };

  const handleArrayInputChange = (field, index, key, value) => {
    const updatedArray = [...currentAPI[field]];
    updatedArray[index][key] = value;
    setCurrentAPI({ ...currentAPI, [field]: updatedArray });
  };

  const addArrayField = (field) => {
    setCurrentAPI({ ...currentAPI, [field]: [...currentAPI[field], { key: "", value: "" }] });
  };

  const removeArrayField = (field, index) => {
    const updatedArray = currentAPI[field].filter((_, i) => i !== index);
    setCurrentAPI({ ...currentAPI, [field]: updatedArray });
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Import APIs</h1>
      <div className="mb-6">
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="w-full p-2 bg-gray-800 text-white rounded"
        />
      </div>

      {currentAPI ? (
        <div className="bg-gray-800 p-6 rounded mb-6">
          <h2 className="text-xl font-bold mb-4">Edit API</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={currentAPI.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Endpoint</label>
            <input
              type="text"
              value={currentAPI.endpoint || ""}
              onChange={(e) => handleInputChange("endpoint", e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Method</label>
            <select
              value={currentAPI.method || "GET"}
              onChange={(e) => handleInputChange("method", e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded"
            >
              {["GET", "POST", "PUT", "DELETE", "PATCH"].map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Category</label>
            <select
              value={currentAPI.categoryId || ""}
              onChange={(e) => handleInputChange("categoryId", e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded"
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
            <label className="block text-sm font-medium">Headers</label>
            {currentAPI.headers.map((header, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Key"
                  value={header.key}
                  onChange={(e) =>
                    handleArrayInputChange("headers", index, "key", e.target.value)
                  }
                  className="w-1/2 p-2 bg-gray-700 text-white rounded"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={header.value}
                  onChange={(e) =>
                    handleArrayInputChange("headers", index, "value", e.target.value)
                  }
                  className="w-1/2 p-2 bg-gray-700 text-white rounded"
                />
                <button
                  onClick={() => removeArrayField("headers", index)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button onClick={() => addArrayField("headers")} className="text-blue-500">
              Add Header
            </button>
          </div>
          <button
            onClick={handleSaveAPI}
            className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save API"}
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">Preview APIs</h2>
          <ul>
            {analyzedAPIs.map((api, index) => (
              <li
                key={index}
                className="p-4 bg-gray-800 mb-2 rounded cursor-pointer"
                onClick={() => openAPIForEditing(api)}
              >
                <h3 className="font-bold">{api.name || "Unnamed API"}</h3>
                <p className="text-sm text-gray-400">{api.endpoint || "No endpoint"}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ImportAPIs;

import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

const AddAPI = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    endpoint: "",
    method: "POST",
    headers: [{ key: "Content-Type", value: "application/json" }],
    queryParams: [{ key: "", value: "" }],
    requestBody: "",
    selectedCategory: "",
    dataType: "raw",
    formData: [{ key: "", value: "" }],
    graphqlQuery: "",
    graphqlVariables: "{}",
    responseExample: "{}",
    exampleIntegration: "",
    description: "",
  });
  const [activeTab, setActiveTab] = useState("headers");

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

  // Handle dynamic input changes
  const handleInputChange = (field, index, key, value) => {
    const updatedField = [...formData[field]];
    updatedField[index][key] = value;
    setFormData({ ...formData, [field]: updatedField });
  };

  const addField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], { key: "", value: "" }] });
  };

  const removeField = (field, index) => {
    const updatedField = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updatedField });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiData = {
        name: formData.name,
        endpoint: formData.endpoint,
        method: formData.method,
        headers: Object.fromEntries(formData.headers.map((h) => [h.key, h.value])),
        queryParams: formData.queryParams.filter((q) => q.key && q.value),
        requestBody: formData.dataType === "raw" ? JSON.parse(formData.requestBody) : {},
        formData: formData.dataType === "form-data" ? formData.formData : [],
        graphqlQuery: formData.dataType === "graphql" ? formData.graphqlQuery : "",
        graphqlVariables:
          formData.dataType === "graphql" ? JSON.parse(formData.graphqlVariables) : {},
        responseExample: JSON.parse(formData.responseExample),
        exampleIntegration: formData.exampleIntegration,
        description: formData.description,
        dataType: formData.dataType,
        categoryId: formData.selectedCategory,
      };
      await addDoc(collection(db, "apiv2"), apiData);
      alert("API added successfully!");
      setFormData({
        name: "",
        endpoint: "",
        method: "POST",
        headers: [{ key: "Content-Type", value: "application/json" }],
        queryParams: [{ key: "", value: "" }],
        requestBody: "",
        selectedCategory: "",
        dataType: "raw",
        formData: [{ key: "", value: "" }],
        graphqlQuery: "",
        graphqlVariables: "{}",
        responseExample: "{}",
        exampleIntegration: "",
        description: "",
      });
    } catch (error) {
      console.error("Error adding API:", error);
      alert("Failed to add API.");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Add New API</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Request Builder */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <div className="mb-4">
            <label className="block mb-2 font-medium">API Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 bg-gray-700 text-white rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Endpoint</label>
            <input
              type="text"
              value={formData.endpoint}
              onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
              className="w-full p-3 bg-gray-700 text-white rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Method</label>
            <select
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              className="w-full p-3 bg-gray-700 text-white rounded"
            >
              {"GET POST PUT DELETE PATCH".split(" ").map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Category</label>
            <select
              value={formData.selectedCategory}
              onChange={(e) => setFormData({ ...formData, selectedCategory: e.target.value })}
              className="w-full p-3 bg-gray-700 text-white rounded"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Headers, Query Params, Body Tabs */}
          <div className="mb-4">
            <div className="flex mb-2">
              {"headers queryParams body".split(" ").map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 ${
                    activeTab === tab ? "bg-blue-600" : "bg-gray-700"
                  } rounded-l text-white`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            {activeTab === "headers" && (
              <div>
                {formData.headers.map((header, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="Key"
                      value={header.key}
                      onChange={(e) => handleInputChange("headers", index, "key", e.target.value)}
                      className="w-1/2 p-3 bg-gray-700 text-white rounded"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={header.value}
                      onChange={(e) => handleInputChange("headers", index, "value", e.target.value)}
                      className="w-1/2 p-3 bg-gray-700 text-white rounded"
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
            )}
            {activeTab === "queryParams" && (
              <div>
                {formData.queryParams.map((param, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="Key"
                      value={param.key}
                      onChange={(e) => handleInputChange("queryParams", index, "key", e.target.value)}
                      className="w-1/2 p-3 bg-gray-700 text-white rounded"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={param.value}
                      onChange={(e) => handleInputChange("queryParams", index, "value", e.target.value)}
                      className="w-1/2 p-3 bg-gray-700 text-white rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeField("queryParams", index)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addField("queryParams")}
                  className="text-blue-500"
                >
                  Add Query Param
                </button>
              </div>
            )}
            {activeTab === "body" && (
              <div>
                <textarea
                  value={formData.requestBody}
                  onChange={(e) => setFormData({ ...formData, requestBody: e.target.value })}
                  placeholder="Enter Request Body (JSON)"
                  className="w-full p-3 bg-gray-700 text-white rounded"
                  rows="5"
                ></textarea>
              </div>
            )}
          </div>
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded">
            Add API
          </button>
        </div>

        {/* Response Example and Integration */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <div className="mb-4">
            <label className="block mb-2 font-medium">Response Example (JSON)</label>
            <textarea
              value={formData.responseExample}
              onChange={(e) => setFormData({ ...formData, responseExample: e.target.value })}
              placeholder="Enter Response Example"
              className="w-full p-3 bg-gray-700 text-white rounded"
              rows="5"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Integration Code (cURL)</label>
            <textarea
              value={formData.exampleIntegration}
              onChange={(e) => setFormData({ ...formData, exampleIntegration: e.target.value })}
              placeholder="Enter cURL Integration Code"
              className="w-full p-3 bg-gray-700 text-white rounded"
              rows="5"
            ></textarea>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddAPI;

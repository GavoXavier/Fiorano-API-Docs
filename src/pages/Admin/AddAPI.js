import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

const AddAPI = () => {
  const [categories, setCategories] = useState([]);
  const [schemas, setSchemas] = useState([]); // Fetch schemas from Firestore
  const [selectedSchema, setSelectedSchema] = useState(null); // Holds the selected schema
  const [formData, setFormData] = useState({
    name: "",
    endpoint: "",
    method: "POST",
    headers: [],
    queryParams: [],
    requestBody: [],
    responseBody: [],
    statusCodes: [],
    exampleRequestBody: "",
    exampleResponseBody: "",
    selectedCategory: "",
    requiresAuth: false,
    description: "",
    exampleIntegration: "",
  });

  const [activeTab, setActiveTab] = useState("headers");

  // Fetch categories and schemas from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categorySnapshot = await getDocs(collection(db, "categories"));
        const schemaSnapshot = await getDocs(collection(db, "schemas"));

        setCategories(
          categorySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );

        setSchemas(
          schemaSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle dynamic input changes
  const handleInputChange = (field, index, key, value) => {
    const updatedField = [...formData[field]];
    updatedField[index][key] = value;
    setFormData({ ...formData, [field]: updatedField });
  };

  const addField = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], { name: "", type: "", description: "" }],
    });
  };

  const removeField = (field, index) => {
    const updatedField = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updatedField });
  };

  const handleMethodChange = (method) => {
    setFormData({
      ...formData,
      method,
      requestBody: method === "GET" || method === "DELETE" ? [] : formData.requestBody,
    });
  };

  // Handle schema selection
  const handleSchemaSelect = (schemaId) => {
    const schema = schemas.find((s) => s.id === schemaId);
    if (schema) {
      setSelectedSchema(schema);
      setFormData({
        ...formData,
        headers: schema.headers || [],
        queryParams: schema.queryParams || [],
        requestBody: schema.requestBody || [],
        responseBody: schema.responseBody || [],
        statusCodes: schema.responseCodes || [],
        exampleRequestBody: JSON.stringify(schema.exampleRequestBody || {}, null, 2),
        exampleResponseBody: JSON.stringify(schema.exampleResponseBody || {}, null, 2),
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiData = {
        name: formData.name,
        endpoint: formData.endpoint,
        method: formData.method,
        headers: formData.headers,
        queryParams: formData.queryParams,
        requestBody: formData.requestBody,
        responseBody: formData.responseBody,
        statusCodes: formData.statusCodes,
        exampleRequestBody: formData.exampleRequestBody,
        exampleResponseBody: formData.exampleResponseBody,
        categoryId: formData.selectedCategory,
        requiresAuth: formData.requiresAuth,
        description: formData.description,
        exampleIntegration: formData.exampleIntegration,
      };

      await addDoc(collection(db, "apiv2"), apiData);
      alert("API added successfully!");
      // Reset form
      setFormData({
        name: "",
        endpoint: "",
        method: "POST",
        headers: [],
        queryParams: [],
        requestBody: [],
        responseBody: [],
        statusCodes: [],
        exampleRequestBody: "",
        exampleResponseBody: "",
        selectedCategory: "",
        requiresAuth: false,
        description: "",
        exampleIntegration: "",
      });
      setSelectedSchema(null);
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
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Endpoint</label>
            <input
              type="text"
              value={formData.endpoint}
              onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
              className="w-full p-3 bg-gray-700 text-white rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Method</label>
            <select
              value={formData.method}
              onChange={(e) => handleMethodChange(e.target.value)}
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
          <div className="mb-4">
            <label className="block mb-2 font-medium">Schema</label>
            <select
              value={selectedSchema?.id || ""}
              onChange={(e) => handleSchemaSelect(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded"
            >
              <option value="">Select a schema</option>
              {schemas.map((schema) => (
                <option key={schema.id} value={schema.id}>
                  {schema.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.requiresAuth}
                onChange={(e) => setFormData({ ...formData, requiresAuth: e.target.checked })}
                className="mr-2"
              />
              Requires Authentication
            </label>
          </div>

          {/* Headers, Query Params, Body Tabs */}
          <div className="mb-4">
            <div className="flex mb-2">
              {"headers queryParams body".split(" ").map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 ${activeTab === tab ? "bg-blue-600" : "bg-gray-700"} rounded-l text-white`}
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
                      value={header.name}
                      onChange={(e) => handleInputChange("headers", index, "name", e.target.value)}
                      className="w-1/2 p-3 bg-gray-700 text-white rounded"
                    />
                    <input
                      type="text"
                      placeholder="Type"
                      value={header.type}
                      onChange={(e) => handleInputChange("headers", index, "type", e.target.value)}
                      className="w-1/4 p-3 bg-gray-700 text-white rounded"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={header.description}
                      onChange={(e) => handleInputChange("headers", index, "description", e.target.value)}
                      className="w-1/4 p-3 bg-gray-700 text-white rounded"
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
                      placeholder="Name"
                      value={param.name}
                      onChange={(e) => handleInputChange("queryParams", index, "name", e.target.value)}
                      className="w-1/2 p-3 bg-gray-700 text-white rounded"
                    />
                    <input
                      type="text"
                      placeholder="Type"
                      value={param.type}
                      onChange={(e) => handleInputChange("queryParams", index, "type", e.target.value)}
                      className="w-1/4 p-3 bg-gray-700 text-white rounded"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={param.description}
                      onChange={(e) => handleInputChange("queryParams", index, "description", e.target.value)}
                      className="w-1/4 p-3 bg-gray-700 text-white rounded"
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
            {activeTab === "body" && formData.method !== "GET" && formData.method !== "DELETE" && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Request Body</h3>
                {formData.requestBody.map((field, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={field.name}
                      onChange={(e) => handleInputChange("requestBody", index, "name", e.target.value)}
                      className="w-1/3 p-3 bg-gray-700 text-white rounded"
                    />
                    <input
                      type="text"
                      placeholder="Type"
                      value={field.type}
                      onChange={(e) => handleInputChange("requestBody", index, "type", e.target.value)}
                      className="w-1/3 p-3 bg-gray-700 text-white rounded"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={field.description}
                      onChange={(e) => handleInputChange("requestBody", index, "description", e.target.value)}
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
                  Add Request Body Field
                </button>
              </div>
            )}
          </div>
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded">
            Add API
          </button>
        </div>

        {/* Response and Integration */}
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Response Body</h3>
            {formData.responseBody.map((field, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={field.name}
                  onChange={(e) => handleInputChange("responseBody", index, "name", e.target.value)}
                  className="w-1/3 p-3 bg-gray-700 text-white rounded"
                />
                <input
                  type="text"
                  placeholder="Type"
                  value={field.type}
                  onChange={(e) => handleInputChange("responseBody", index, "type", e.target.value)}
                  className="w-1/3 p-3 bg-gray-700 text-white rounded"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={field.description}
                  onChange={(e) => handleInputChange("responseBody", index, "description", e.target.value)}
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
              Add Response Body Field
            </button>
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Example Request Body (JSON)</label>
            <textarea
              value={formData.exampleRequestBody}
              onChange={(e) =>
                setFormData({ ...formData, exampleRequestBody: e.target.value })
              }
              className="w-full p-3 bg-gray-700 text-white rounded"
              rows="5"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Example Response Body (JSON)</label>
            <textarea
              value={formData.exampleResponseBody}
              onChange={(e) =>
                setFormData({ ...formData, exampleResponseBody: e.target.value })
              }
              className="w-full p-3 bg-gray-700 text-white rounded"
              rows="5"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Status Codes</label>
            {formData.statusCodes.map((code, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Code"
                  value={code.code}
                  onChange={(e) => handleInputChange("statusCodes", index, "code", e.target.value)}
                  className="w-1/3 p-3 bg-gray-700 text-white rounded"
                />
                <input
                  type="text"
                  placeholder="Message"
                  value={code.message}
                  onChange={(e) => handleInputChange("statusCodes", index, "message", e.target.value)}
                  className="w-1/3 p-3 bg-gray-700 text-white rounded"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={code.description}
                  onChange={(e) => handleInputChange("statusCodes", index, "description", e.target.value)}
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
        </div>
      </form>
    </div>
  );
};

export default AddAPI;

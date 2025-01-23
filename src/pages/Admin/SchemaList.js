import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const SchemaList = () => {
  const [schemas, setSchemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editSchema, setEditSchema] = useState(null); // Schema being edited
  const [editFormData, setEditFormData] = useState({}); // Editable form data

  // Fetch existing schemas
  useEffect(() => {
    const fetchSchemas = async () => {
      try {
        const schemaSnapshot = await getDocs(collection(db, "schemas"));
        setSchemas(schemaSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching schemas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemas();
  }, []);

  // Start editing a schema
  const handleEdit = (schema) => {
    setEditSchema(schema.id);
    setEditFormData({ ...schema });
  };

  // Handle input changes for top-level fields
  const handleInputChange = (field, value) => {
    setEditFormData({ ...editFormData, [field]: value });
  };

  // Handle input changes for array fields
  const handleArrayFieldChange = (field, index, key, value) => {
    const updatedField = [...editFormData[field]];
    updatedField[index][key] = value;
    setEditFormData({ ...editFormData, [field]: updatedField });
  };

  // Add a new field to array fields
  const addArrayField = (field) => {
    const newField =
      field === "responseCodes"
        ? { code: "", description: "" }
        : { name: "", type: "", description: "" };

    setEditFormData({ ...editFormData, [field]: [...(editFormData[field] || []), newField] });
  };

  // Remove a field from array fields
  const removeArrayField = (field, index) => {
    const updatedField = editFormData[field].filter((_, i) => i !== index);
    setEditFormData({ ...editFormData, [field]: updatedField });
  };

  // Save changes to Firestore
  const handleSave = async () => {
    if (!editSchema) return;

    try {
      await updateDoc(doc(db, "schemas", editSchema), editFormData);
      alert("Schema updated successfully!");
      setSchemas((prev) =>
        prev.map((schema) => (schema.id === editSchema ? editFormData : schema))
      );
      setEditSchema(null); // Exit edit mode
    } catch (error) {
      console.error("Error updating schema:", error);
      alert("Failed to update schema.");
    }
  };

  // Delete a schema
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this schema?")) {
      try {
        await deleteDoc(doc(db, "schemas", id));
        alert("Schema deleted successfully!");
        setSchemas((prev) => prev.filter((schema) => schema.id !== id));
      } catch (error) {
        console.error("Error deleting schema:", error);
        alert("Failed to delete schema.");
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-800 dark:text-white">
        Loading schemas...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Schema List</h1>

      {schemas.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No schemas found. Add a new schema from the <strong>Schemas</strong> page.
        </p>
      ) : (
        <ul className="space-y-4">
          {schemas.map((schema) => (
            <li
              key={schema.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col space-y-4"
            >
              {/* Edit Mode */}
              {editSchema === schema.id ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Schema Name</label>
                    <input
                      type="text"
                      value={editFormData.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="w-full p-3 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={editFormData.description || ""}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="w-full p-3 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                      rows="3"
                    ></textarea>
                  </div>

                  {/* Editable Fields for Headers, Request Body, Response Body, and Response Codes */}
                  {["headers", "queryParams", "requestBody", "responseBody", "responseCodes"].map(
                    (field) => (
                      <div key={field}>
                        <h3 className="text-lg font-semibold capitalize">{field}</h3>
                        {(editFormData[field] || []).map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 mb-2 border p-3 rounded bg-gray-100 dark:bg-gray-700"
                          >
                            {Object.keys(item).map((key) => (
                              <input
                                key={key}
                                type="text"
                                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                value={item[key]}
                                onChange={(e) =>
                                  handleArrayFieldChange(field, index, key, e.target.value)
                                }
                                className="w-1/3 p-2 border rounded dark:bg-gray-700 dark:text-white"
                              />
                            ))}
                            <button
                              type="button"
                              onClick={() => removeArrayField(field, index)}
                              className="text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addArrayField(field)}
                          className="text-blue-500"
                        >
                          Add {field.slice(0, -1).replace(/([a-z])([A-Z])/g, "$1 $2")}
                        </button>
                      </div>
                    )
                  )}

                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditSchema(null)}
                      className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* View Mode */}
                  <div>
                    <h3 className="font-semibold">{schema.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {schema.description || "No description available."}
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleEdit(schema)}
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(schema.id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SchemaList;

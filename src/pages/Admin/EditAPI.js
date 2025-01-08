import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import EditAPIOverview from "./EditAPIOverview";

const EditAPI = () => {
  const [apis, setApis] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApi, setSelectedApi] = useState(null);
  const [filteredApis, setFilteredApis] = useState([]);

  // Fetch APIs and Categories
  useEffect(() => {
    const fetchAPIsAndCategories = async () => {
      try {
        const apiSnapshot = await getDocs(collection(db, "apiv2"));
        const categorySnapshot = await getDocs(collection(db, "categories"));
        setApis(apiSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setCategories(
          categorySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error("Error fetching APIs or categories:", error);
      }
    };
    fetchAPIsAndCategories();
  }, []);

  // Filter APIs by search term
  useEffect(() => {
    const filtered = apis.filter((api) =>
      api.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredApis(filtered);
  }, [searchTerm, apis]);

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Edit API</h1>
      <input
        type="text"
        placeholder="Search APIs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApis.map((api) => (
          <div
            key={api.id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow group hover:shadow-lg cursor-pointer"
            onClick={() => setSelectedApi(api)}
          >
            <h3 className="text-lg font-bold">{api.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {api.endpoint}
            </p>
            <span
              className={`px-3 py-1 rounded-full text-xs ${
                api.method === "GET"
                  ? "bg-green-100 text-green-800"
                  : api.method === "POST"
                  ? "bg-blue-100 text-blue-800"
                  : api.method === "PUT"
                  ? "bg-yellow-100 text-yellow-800"
                  : api.method === "DELETE"
                  ? "bg-red-100 text-red-800"
                  : "bg-purple-100 text-purple-800"
              }`}
            >
              {api.method}
            </span>
          </div>
        ))}
      </div>
      {selectedApi && (
        <EditAPIOverview
          api={selectedApi}
          categories={categories}
          closeModal={() => setSelectedApi(null)}
          updateAPI={(updatedApi) => {
            setApis((prevApis) =>
              prevApis.map((api) =>
                api.id === updatedApi.id ? updatedApi : api
              )
            );
          }}
        />
      )}
    </div>
  );
};

export default EditAPI;

import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSearch } from "@fortawesome/free-solid-svg-icons";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const UserSidebar = () => {
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredApis, setFilteredApis] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Fetch categories and APIs from Firestore
  useEffect(() => {
    const fetchCategoriesWithAPIs = async () => {
      try {
        const categorySnapshot = await getDocs(collection(db, "categories"));
        const categoriesWithAPIs = await Promise.all(
          categorySnapshot.docs.map(async (doc) => {
            const categoryData = { id: doc.id, ...doc.data() };

            // Fetch APIs belonging to this category
            const apiQuery = query(
              collection(db, "apiv2"),
              where("categoryId", "==", categoryData.id)
            );
            const apiSnapshot = await getDocs(apiQuery);
            const apis = apiSnapshot.docs.map((apiDoc) => ({
              id: apiDoc.id,
              ...apiDoc.data(),
            }));

            return { ...categoryData, apis };
          })
        );

        setCategories(categoriesWithAPIs);
      } catch (error) {
        console.error("Error fetching categories and APIs:", error);
      }
    };

    fetchCategoriesWithAPIs();
  }, []);

  // Filter APIs based on the search term
  useEffect(() => {
    if (searchTerm.trim()) {
      const matchingApis = [];
      categories.forEach((category) => {
        category.apis.forEach((api) => {
          if (api.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            matchingApis.push({ ...api, categoryName: category.name });
          }
        });
      });
      setFilteredApis(matchingApis);
      setShowDropdown(true);
    } else {
      setFilteredApis([]);
      setShowDropdown(false);
    }
  }, [searchTerm, categories]);

  return (
    <aside className="w-80 bg-gray-900 text-gray-200 shadow-lg flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 text-2xl font-bold text-gray-200 border-b border-gray-700">
        Fiorano APIs
      </div>

      {/* Search Bar */}
      <div className="p-4 relative">
        <div className="flex items-center bg-gray-800 rounded px-3 py-2">
          <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search APIs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 ml-2 bg-transparent border-none outline-none text-gray-200 placeholder-gray-400"
          />
        </div>
        {showDropdown && filteredApis.length > 0 && (
          <div className="absolute top-14 left-0 right-0 bg-gray-800 shadow-lg rounded max-h-48 overflow-y-auto z-10">
            {filteredApis.map((api) => (
              <NavLink
                key={api.id}
                to={`/user/api/${api.id}`}
                className="block px-4 py-2 text-gray-200 hover:bg-gray-700"
                onClick={() => setSearchTerm("")} // Clear search on click
              >
                <span className="text-sm font-bold">{api.name}</span>
                <span className="text-xs block text-gray-400">
                  Category: {api.categoryName}
                </span>
              </NavLink>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-4 p-4">
          {/* Home Link */}
          <li>
            <NavLink
              to="/"
              className="flex items-center w-full px-3 py-2 hover:bg-gray-700 rounded"
            >
              <FontAwesomeIcon icon={faHome} className="mr-3" />
              <span>Home</span>
            </NavLink>
          </li>

          {/* Categories */}
          {categories.map((category) => (
            <li key={category.id}>
              {/* Category Button */}
              <button
                className={`flex items-center w-full px-4 py-3 rounded text-gray-200 bg-gray-800 hover:bg-gray-700`}
                onClick={() => {
                  setExpandedCategory(
                    expandedCategory === category.id ? null : category.id
                  );
                  navigate(`/user/category/${category.id}`);
                }}
              >
                <span className="flex-1 text-left text-lg font-semibold">
                  {category.name}
                </span>
              </button>

              {/* APIs in Category */}
              {expandedCategory === category.id && (
                <ul className="mt-2 space-y-1">
                  {category.apis.map((api) => (
                    <li key={api.id}>
                      <NavLink
                        to={`/user/api/${api.id}`}
                        className="flex items-center px-4 py-2 hover:bg-gray-700 rounded"
                      >
                        {/* API Method Badge */}
                        {api.method && (
                          <span
                            className={`mr-2 px-2 py-1 rounded-full text-xs ${
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
                        )}
                        {api.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default UserSidebar;

import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { AiOutlineApi } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";

const AdminDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [apis, setAPIs] = useState([]);

  // Fetch categories and APIs from Firestore
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

  // Group APIs by category
  const groupedAPIs = categories.map((category) => ({
    ...category,
    apis: apis.filter((api) => api.categoryId === category.id),
  }));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-500 text-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold flex items-center">
            <AiOutlineApi className="mr-2" />
            Total APIs
          </h2>
          <p className="text-4xl font-bold mt-4">{apis.length}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold flex items-center">
            <BiCategoryAlt className="mr-2" />
            Total Categories
          </h2>
          <p className="text-4xl font-bold mt-4">{categories.length}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">APIs by Category</h2>
      {groupedAPIs.map((category) => (
        <div key={category.id} className="mb-6">
          <h3 className="text-xl font-bold mb-2">{category.name}</h3>
          <p className="text-gray-700 mb-2">{category.introduction}</p>
          <ul className="bg-gray-100 p-4 rounded shadow">
            {category.apis.map((api) => (
              <li
                key={api.id}
                className="border-b last:border-b-0 py-2 flex justify-between items-center"
              >
                <span>{api.name}</span>
                <a
                  href={api.endpoint}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Endpoint
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;

// import React, { useState, useEffect } from "react";
// import { db } from "../../firebase";
// import {
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
// } from "firebase/firestore";

// const ManageCategories = () => {
//   const [categories, setCategories] = useState([]);
//   const [name, setName] = useState("");
//   const [introduction, setIntroduction] = useState("");
//   const [editId, setEditId] = useState(null); // ID of the category being edited

//   // Fetch categories from Firestore
//   useEffect(() => {
//     const fetchCategories = async () => {
//       const querySnapshot = await getDocs(collection(db, "categories"));
//       const fetchedCategories = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setCategories(fetchedCategories);
//     };
//     fetchCategories();
//   }, []);

//   // Add or Update Category
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (editId) {
//       // Update category
//       const categoryDoc = doc(db, "categories", editId);
//       await updateDoc(categoryDoc, { name, introduction });
//       alert("Category updated successfully!");
//     } else {
//       // Add new category
//       await addDoc(collection(db, "categories"), { name, introduction });
//       alert("Category added successfully!");
//     }
//     setName("");
//     setIntroduction("");
//     setEditId(null); // Reset edit state
//     window.location.reload(); // Refresh to show changes dynamically
//   };

//   // Delete Category
//   const handleDelete = async (id) => {
//     const confirm = window.confirm("Are you sure you want to delete this category?");
//     if (confirm) {
//       await deleteDoc(doc(db, "categories", id));
//       alert("Category deleted successfully!");
//       setCategories(categories.filter((category) => category.id !== id));
//     }
//   };

//   // Load category into form for editing
//   const handleEdit = (category) => {
//     setName(category.name);
//     setIntroduction(category.introduction);
//     setEditId(category.id);
//   };

//   return (
//     <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
//       <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6"
//       >
//         <h2 className="text-xl mb-4">{editId ? "Edit Category" : "Add New Category"}</h2>
//         <div className="mb-4">
//           <label htmlFor="name" className="block text-sm font-medium">
//             Category Name
//           </label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="introduction" className="block text-sm font-medium">
//             Introduction
//           </label>
//           <textarea
//             id="introduction"
//             value={introduction}
//             onChange={(e) => setIntroduction(e.target.value)}
//             className="mt-1 p-2 w-full border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//             rows="3"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//         >
//           {editId ? "Update Category" : "Add Category"}
//         </button>
//       </form>
//       <table className="w-full bg-white dark:bg-gray-800 rounded shadow">
//         <thead>
//           <tr>
//             <th className="p-2 text-left">Name</th>
//             <th className="p-2 text-left">Introduction</th>
//             <th className="p-2 text-left">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {categories.map((category) => (
//             <tr key={category.id}>
//               <td className="p-2">{category.name}</td>
//               <td className="p-2">{category.introduction}</td>
//               <td className="p-2 space-x-2">
//                 <button
//                   onClick={() => handleEdit(category)}
//                   className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(category.id)}
//                   className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ManageCategories;



import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/categories"; // Backend API URL

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [editId, setEditId] = useState(null); // ID of the category being edited

  // ✅ Fetch Categories from MySQL API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(API_URL);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Add or Update Category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update category
        await axios.put(`${API_URL}/${editId}`, { name, introduction });
        alert("Category updated successfully!");
      } else {
        // Add new category
        await axios.post(API_URL, { name, introduction });
        alert("Category added successfully!");
      }
      setName("");
      setIntroduction("");
      setEditId(null);
      refreshCategories(); // Refresh list without reloading
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  // ✅ Delete Category
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this category?");
    if (confirm) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        alert("Category deleted successfully!");
        setCategories(categories.filter((category) => category.id !== id)); // Remove deleted item
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  // ✅ Load category into form for editing
  const handleEdit = (category) => {
    setName(category.name);
    setIntroduction(category.introduction);
    setEditId(category.id);
  };

  // ✅ Refresh categories without reloading the page
  const refreshCategories = async () => {
    try {
      const response = await axios.get(API_URL);
      setCategories(response.data);
    } catch (error) {
      console.error("Error refreshing categories:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
        <h2 className="text-xl mb-4">{editId ? "Edit Category" : "Add New Category"}</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium">Category Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 w-full border rounded dark:bg-gray-700"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Introduction</label>
          <textarea
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            className="p-2 w-full border rounded dark:bg-gray-700"
            rows="3"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          {editId ? "Update Category" : "Add Category"}
        </button>
      </form>
      <table className="w-full bg-white dark:bg-gray-800 rounded shadow">
        <thead>
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Introduction</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="p-2">{category.name}</td>
              <td className="p-2">{category.introduction}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => handleEdit(category)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                  Edit
                </button>
                <button onClick={() => handleDelete(category.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
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

export default ManageCategories;

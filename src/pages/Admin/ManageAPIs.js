import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
//faEdit, faTrash, 


const ManageAPIs = () => {
  const [apis, setAPIs] = useState([]);
  const navigate = useNavigate();

  // Fetch APIs from Firestore
  useEffect(() => {
    const fetchAPIs = async () => {
      const apiSnapshot = await getDocs(collection(db, "apis"));
      setAPIs(apiSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchAPIs();
  }, []);

  // Delete API
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this API?")) {
      await deleteDoc(doc(db, "apis", id));
      setAPIs(apis.filter((api) => api.id !== id));
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage APIs</h1>
        <button
          onClick={() => navigate("/admin/add-api")}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center space-x-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>Add New API</span>
        </button>
      </div>
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
                  onClick={() => navigate(`/admin/edit-api/${api.id}`)}
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

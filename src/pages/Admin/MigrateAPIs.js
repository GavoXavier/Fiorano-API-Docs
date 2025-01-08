import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

const MigrateAPIs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [migrationResult, setMigrationResult] = useState("");

  const migrateAPIs = async () => {
    setIsLoading(true);
    setMigrationResult("");

    try {
      // Step 1: Fetch all APIs from the current `apis` collection
      const existingAPIsSnapshot = await getDocs(collection(db, "apis"));
      const existingAPIs = existingAPIsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Step 2: Add missing fields and write to the `apiv2` collection
      const newCollection = collection(db, "apiv2");
      let successCount = 0;

      for (const api of existingAPIs) {
        const newAPI = {
          // Existing fields
          name: api.name || null,
          endpoint: api.endpoint || null,
          method: api.method || null,
          headers: api.headers || null,
          requestBody: api.requestBody || null,
          responseExample: api.responseExample || null,
          description: api.description || null,
          exampleIntegration: api.exampleIntegration || null,
          categoryId: api.categoryId || null,

          // New fields with default values or null
          dataType: "raw", // Default to `raw`
          formData: [],
          graphqlQuery: null,
          graphqlVariables: null,
          binaryData: null,
          updatedAt: new Date().toISOString(),
          createdBy: "admin", // Adjust based on your needs
        };

        // Add the newAPI to the `apiv2` collection
        await addDoc(newCollection, newAPI);
        successCount++;
      }

      // Step 3: Display the migration result
      setMigrationResult(`Migration completed successfully. ${successCount} APIs migrated.`);
    } catch (error) {
      console.error("Error during migration:", error);
      setMigrationResult("Migration failed. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Migrate APIs to New Collection</h1>
      <p className="mb-4">
        This tool will migrate all APIs from the old collection to the new `apiv2` collection.
        Missing fields will be set to `null` or default values.
      </p>
      <button
        onClick={migrateAPIs}
        disabled={isLoading}
        className={`px-4 py-2 text-white rounded ${
          isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isLoading ? "Migrating..." : "Start Migration"}
      </button>
      {migrationResult && <p className="mt-4 text-green-500">{migrationResult}</p>}
    </div>
  );
};

export default MigrateAPIs;

// src/pages/Admin/ImportAPIs.jsx
import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import Papa from "papaparse";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

const ImportAPIs = () => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setParsedData([]);
      setError("");
    }
  };

  const parsePDF = async (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        const pdfData = new Uint8Array(e.target.result);
        try {
          const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
          const extractedData = [];

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item) => item.str)
              .join(" ");
            extractedData.push(pageText);
          }

          resolve(extractedData);
        } catch (err) {
          reject(`Failed to parse PDF: ${err.message}`);
        }
      };

      reader.onerror = (err) => {
        reject(`File reading error: ${err.message}`);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const parseCSV = async (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => resolve(results.data),
        error: (err) => reject(`Error parsing CSV: ${err.message}`),
      });
    });
  };

  const handleFileProcess = async () => {
    if (!file) {
      setError("Please upload a file to proceed.");
      return;
    }

    setLoading(true);
    try {
      let data = [];
      if (file.type === "text/csv") {
        data = await parseCSV(file);
      } else if (file.type === "application/pdf") {
        const extractedText = await parsePDF(file);
        // Implement logic to structure PDF data into API format
        data = extractedText.map((text) => ({
          name: null,
          endpoint: null,
          method: null,
          headers: null,
          requestBody: null,
          responseExample: null,
          description: null,
          categoryId: null,
          exampleIntegration: null,
          rawText: text, // Store raw text for manual processing if needed
        }));
      } else {
        setError("Unsupported file type. Please upload a CSV or PDF file.");
        setLoading(false);
        return;
      }

      setParsedData(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitToFirebase = async () => {
    try {
      const categoriesCollection = collection(db, "categories");
      const apisCollection = collection(db, "apiv2");

      for (const item of parsedData) {
        const { category, ...apiData } = item;

        const existingCategories = await getDocs(categoriesCollection);
        const matchedCategory = existingCategories.docs.find(
          (doc) => doc.data().name?.toLowerCase() === category?.toLowerCase()
        );

        let categoryId = null;
        if (matchedCategory) {
          categoryId = matchedCategory.id;
        } else if (category) {
          const newCategory = await addDoc(categoriesCollection, {
            name: category,
          });
          categoryId = newCategory.id;
        }

        await addDoc(apisCollection, { ...apiData, categoryId });
      }

      alert("APIs imported successfully!");
    } catch (err) {
      setError(`Failed to import APIs: ${err.message}`);
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Import APIs</h1>
      <div className="mb-4">
        <input
          type="file"
          accept=".csv,.pdf"
          onChange={handleFileUpload}
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
      </div>
      <button
        onClick={handleFileProcess}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Processing..." : "Process File"}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {parsedData.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Preview Data</h2>
          <pre className="p-4 bg-gray-200 dark:bg-gray-700 rounded max-h-96 overflow-auto">
            {JSON.stringify(parsedData, null, 2)}
          </pre>
          <button
            onClick={handleSubmitToFirebase}
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Submit to Firebase
          </button>
        </div>
      )}
    </div>
  );
};

export default ImportAPIs;

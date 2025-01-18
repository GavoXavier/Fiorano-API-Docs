import React from "react";

const AuthPage = () => {
  const authConfig = {
    name: "Access Token (On-Prem)",
    url: "https://10.137.164.61:2284/accesstoken/",
    method: "POST",
    headers: [
      { key: "grant_type", value: "" },
      { key: "client_id", value: "" },
      { key: "client_secret", value: "" },
    ],
  };

  const handleGenerateToken = () => {
    const requestData = authConfig.headers.reduce((acc, header) => {
      acc[header.key] = header.value || "value_placeholder"; // Placeholder if value is empty
      return acc;
    }, {});

    alert(
      `Token generation request sent to ${authConfig.url}\n\nRequest Data:\n${JSON.stringify(
        requestData,
        null,
        2
      )}`
    );
    // Add API call logic for generating token here
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Authentication Management</h1>

      {/* Authentication Details */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg">
        <h2 className="text-lg font-bold mb-4">{authConfig.name}</h2>

        {/* Request URL */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Request URL</label>
          <input
            type="text"
            readOnly
            value={authConfig.url}
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"
          />
        </div>

        {/* Method */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Method</label>
          <input
            type="text"
            readOnly
            value={authConfig.method}
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"
          />
        </div>

        {/* Headers */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Headers</label>
          <div className="space-y-2">
            {authConfig.headers.map((header, index) => (
              <div key={index} className="flex items-center space-x-4">
                <input
                  type="text"
                  readOnly
                  value={header.key}
                  className="w-1/4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"
                />
                <input
                  type="text"
                  placeholder="Enter value"
                  value={header.value}
                  onChange={(e) =>
                    (header.value = e.target.value) // Placeholder for editing headers (if required)
                  }
                  className="w-3/4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Generate Token Button */}
        <div className="mt-6">
          <button
            onClick={handleGenerateToken}
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600"
          >
            Generate Token
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

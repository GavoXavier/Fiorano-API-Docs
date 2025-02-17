require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const categoryRoutes = require("./src/routes/categories"); // Category routes
const schemaRoutes = require("./src/routes/schemas"); // Schema routes
const db = require("./config/db"); // MySQL Database Connection

const app = express();

// ✅ Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(morgan("dev")); // Log HTTP requests

// ✅ Test Database Connection with Retry Logic
const testDbConnection = async () => {
  try {
    await db.getConnection();
    console.log("✅ MySQL Database Connected Successfully!");
  } catch (err) {
    console.error("❌ Database Connection Error:", err.message);
    setTimeout(testDbConnection, 5000); // Retry after 5 seconds
  }
};
testDbConnection();

// ✅ Routes
app.use("/categories", categoryRoutes); // Category management
app.use("/schemas", schemaRoutes); // Schema management

// ✅ Default Route
app.get("/", (req, res) => {
  res.json({ message: "🚀 Fiorano API Server is running!" });
});

// ✅ Health Check Endpoint (Useful for Docker & Load Balancers)
app.get("/health", async (req, res) => {
  try {
    await db.getConnection();
    res.status(200).json({ status: "OK", database: "Connected" });
  } catch (error) {
    res.status(500).json({ status: "ERROR", database: "Not Connected" });
  }
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

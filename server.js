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

// ✅ Test Database Connection
db.getConnection()
  .then(() => console.log("✅ MySQL Database Connected Successfully!"))
  .catch((err) => {
    console.error("❌ Database Connection Error:", err.message);
    process.exit(1); // Exit process if DB connection fails
  });

// ✅ Routes
app.use("/categories", categoryRoutes); // Category management
app.use("/schemas", schemaRoutes); // Schema management

// ✅ Default Route
app.get("/", (req, res) => {
  res.json({ message: "🚀 Fiorano API Server is running!" });
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

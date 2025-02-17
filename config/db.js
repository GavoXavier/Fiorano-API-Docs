const mysql = require("mysql2");

// ✅ Load environment variables
require("dotenv").config();

// ✅ Create a connection pool with environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST || "db", // ✅ "db" for Docker, "localhost" for local
  user: process.env.DB_USER || "myuser",
  password: process.env.DB_PASSWORD || "mypassword",
  database: process.env.DB_NAME || "mydatabase",
  waitForConnections: true,
  connectionLimit: 10, // ✅ Limit concurrent connections
  queueLimit: 0, // ✅ No queue limit
});

// ✅ Function to test database connection with exponential retry logic
const testDbConnection = async (retries = 5, delay = 5000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const connection = await pool.promise().getConnection();
      console.log(`✅ MySQL Database Connected Successfully! (Attempt ${attempt})`);
      connection.release();
      return;
    } catch (err) {
      console.error(`❌ Database Connection Failed (Attempt ${attempt}/${retries}): ${err.message}`);

      if (attempt < retries) {
        console.log(`🔄 Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      } else {
        console.error("❌ All connection attempts failed. Exiting...");
        process.exit(1);
      }
    }
  }
};

// ✅ Test database connection on startup
testDbConnection();

// ✅ Graceful shutdown - Close DB connections when process exits
process.on("SIGINT", async () => {
  console.log("⚠️ Shutting down gracefully...");
  try {
    await pool.end();
    console.log("✅ Database connections closed.");
  } catch (error) {
    console.error("❌ Error closing database connections:", error.message);
  }
  process.exit(0);
});

module.exports = pool.promise();

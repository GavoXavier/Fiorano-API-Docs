const pool = require("../../config/db"); // Import database connection

// ✅ GET all schemas
exports.getAllSchemas = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM api_schemas");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET a single schema by ID
exports.getSchemaById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM api_schemas WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Schema not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ ADD a new schema
exports.addSchema = async (req, res) => {
  try {
    const { name, description, headers, queryParams, requestBody, responseBody, responseCodes } = req.body;
    const [result] = await pool.query(
      "INSERT INTO api_schemas (name, description, headers, queryParams, requestBody, responseBody, responseCodes) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, description, JSON.stringify(headers), JSON.stringify(queryParams), JSON.stringify(requestBody), JSON.stringify(responseBody), JSON.stringify(responseCodes)]
    );
    res.json({ message: "Schema added successfully!", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE an existing schema
exports.updateSchema = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, headers, queryParams, requestBody, responseBody, responseCodes } = req.body;
    const [result] = await pool.query(
      "UPDATE api_schemas SET name = ?, description = ?, headers = ?, queryParams = ?, requestBody = ?, responseBody = ?, responseCodes = ? WHERE id = ?",
      [name, description, JSON.stringify(headers), JSON.stringify(queryParams), JSON.stringify(requestBody), JSON.stringify(responseBody), JSON.stringify(responseCodes), id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Schema not found" });
    res.json({ message: "Schema updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE a schema
exports.deleteSchema = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM api_schemas WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Schema not found" });
    res.json({ message: "Schema deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

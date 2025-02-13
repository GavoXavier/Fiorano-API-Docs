const pool = require("../../config/db"); // MySQL connection from db.js

// ✅ GET all categories
exports.getAllCategories = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET a single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Category not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ ADD a new category
exports.addCategory = async (req, res) => {
  try {
    const { name, introduction } = req.body;
    const [result] = await pool.query(
      "INSERT INTO categories (name, introduction) VALUES (?, ?)",
      [name, introduction]
    );
    res.json({ message: "Category added successfully!", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE a category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, introduction } = req.body;
    const [result] = await pool.query(
      "UPDATE categories SET name = ?, introduction = ? WHERE id = ?",
      [name, introduction, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE a category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM categories WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

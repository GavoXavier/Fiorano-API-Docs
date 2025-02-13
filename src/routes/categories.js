const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController"); // Import controller

// ✅ GET all categories
router.get("/", categoryController.getAllCategories);

// ✅ GET a single category by ID
router.get("/:id", categoryController.getCategoryById);

// ✅ POST - Add a new category
router.post("/", categoryController.addCategory);

// ✅ PUT - Update an existing category
router.put("/:id", categoryController.updateCategory);

// ✅ DELETE - Remove a category
router.delete("/:id", categoryController.deleteCategory);

module.exports = router; // ✅ Export the router

const express = require("express");
const router = express.Router();
const schemaController = require("../controllers/schemaController");

// ✅ GET all schemas
router.get("/", schemaController.getAllSchemas);

// ✅ GET a single schema by ID
router.get("/:id", schemaController.getSchemaById);

// ✅ POST - Add a new schema
router.post("/", schemaController.addSchema);

// ✅ PUT - Update an existing schema
router.put("/:id", schemaController.updateSchema);

// ✅ DELETE - Remove a schema
router.delete("/:id", schemaController.deleteSchema);

module.exports = router;

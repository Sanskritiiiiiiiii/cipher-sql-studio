const express = require("express");
const { executeQuery } = require("../controllers/executeQueryController");
const { validateSqlQuery } = require("../middleware/queryValidationMiddleware");

const router = express.Router();

router.post("/", validateSqlQuery, executeQuery);

module.exports = router;
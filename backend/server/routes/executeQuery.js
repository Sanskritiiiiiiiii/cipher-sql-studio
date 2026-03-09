const express = require("express");
const { executeQuery } = require("../controllers/executeQueryController");

const router = express.Router();

router.post("/", executeQuery);

module.exports = router;

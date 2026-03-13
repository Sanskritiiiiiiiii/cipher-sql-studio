const express = require("express");
const { saveHistory, getHistoryByAssignment } = require("../controllers/historyController");

const router = express.Router();

router.post("/", saveHistory);
router.get("/:assignmentId", getHistoryByAssignment);

module.exports = router;
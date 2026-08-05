const express = require("express");
const requireAuth = require("../middleware/auth");
const { listMessages, sendMessage, clearMessages } = require("../controllers/chat.controller");

const router = express.Router();

router.use(requireAuth);

router.get("/messages", listMessages);
router.post("/messages", sendMessage);
router.delete("/messages", clearMessages);

module.exports = router;

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createSubscription
} = require("../controllers/subscriptionController");

router.post("/", authMiddleware, createSubscription);

module.exports = router;
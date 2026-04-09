const express = require("express");
const router = express.Router();

const {
    transaction
} = require("../controller/transactioncontroller");

// Routes
router.post("/transaction", transaction);

module.exports = router;
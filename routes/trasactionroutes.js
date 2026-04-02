const express = require("express");
const router = express.Router();

const {
    addTransaction,
    getTransactions,
    deleteTransaction,
    updateTransaction
} = require("../controller/transactioncontroller");

// Routes
router.post("/add", addTransaction);
router.get("/", getTransactions);
router.delete("/delete/:id", deleteTransaction);
router.put("/update/:id", updateTransaction);

module.exports = router;
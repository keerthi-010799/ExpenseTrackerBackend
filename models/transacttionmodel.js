const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    amount: Number,
    category: String,
    type: String,
    date: String,
    notes: String
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);
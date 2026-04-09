const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["income", "expense"],
    },
    date: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
        default: "",
        trim: true,
    },
    userId: {
        type: String,
        required: true,
        index: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);

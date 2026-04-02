const Transaction = require("../models/transacttionmodel");

// ➕ Add Transaction
exports.addTransaction = async (req, res) => {
    console.log("comes here", req.body);
    try {
        const newTransaction = new Transaction(req.body);
        await newTransaction.save();
        res.json(newTransaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 📥 Get All Transactions
exports.getTransactions = async (req, res) => {
    try {
        const data = await Transaction.find().sort({ createdAt: -1 });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ❌ Delete Transaction
exports.deleteTransaction = async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        const data = await Transaction.find().sort({ createdAt: -1 });
        res.json({ message: "Deleted successfully", row: data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✏️ Update Transaction
exports.updateTransaction = async (req, res) => {
    try {
        const updated = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        console.log("updateddata", updated)
        const data = await Transaction.find().sort({ createdAt: -1 });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
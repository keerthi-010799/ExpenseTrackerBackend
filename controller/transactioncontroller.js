const Transaction = require("../models/transacttionmodel");

const fetchTransactionsByUser = async (userId) => {
    const query = userId ? { userId: String(userId) } : {};
    return Transaction.find(query).sort({ createdAt: -1 }).lean();
};

exports.transaction = async (req, res) => {
    const { apitype, id, data, userId } = req.body;

    try {
        switch (apitype) {
            case "addTransaction": {
                if (!data?.userId || !data?.amount || !data?.category || !data?.date || !data?.type) {
                    return res.status(400).json({ message: "Missing required transaction fields" });
                }

                const newTransaction = await Transaction.create(data);
                return res.status(201).json(newTransaction);
            }

            case "getTransaction": {
                const transactions = await fetchTransactionsByUser(userId);
                return res.json(transactions);
            }

            case "deleteTransaction": {
                if (!id) {
                    return res.status(400).json({ message: "Transaction id is required" });
                }

                const deletedTransaction = await Transaction.findByIdAndDelete(id);

                if (!deletedTransaction) {
                    return res.status(404).json({ message: "Transaction not found" });
                }

                const transactions = await fetchTransactionsByUser(userId || deletedTransaction.userId);
                return res.json({ message: "Deleted successfully", rows: transactions });
            }
            case "updateTransaction": {
                if (!id || !data) {
                    return res.status(400).json({ message: "Transaction id and update data are required" });
                }

                const updatedTransaction = await Transaction.findByIdAndUpdate(
                    id,
                    data,
                    { new: true, runValidators: true }
                );

                if (!updatedTransaction) {
                    return res.status(404).json({ message: "Transaction not found" });
                }

                const transactions = await fetchTransactionsByUser(userId || updatedTransaction.userId);
                return res.json({ message: "Updated successfully", rows: transactions });
            }

            default:
                return res.status(400).json({ message: "Invalid apitype" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

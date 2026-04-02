const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const transactionRoutes = require("./routes/trasactionroutes");
const userRoutes = require("./routes/userroutes");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/expenseDB")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Use Routes
app.use("/api/transactions", transactionRoutes);
app.use("/api/user", userRoutes);

// Server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
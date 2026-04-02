const User = require("../models/usermodel");

// ➕ Add User
exports.addUser = async (req, res) => {
    console.log("comes here", req.body);
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 📥 Get All User
exports.getUser = async (req, res) => {
    try {
        const data = await User.find().sort({ createdAt: -1 });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//login
exports.loginUser = async (req, res) => {
    try {
        const { user, password } = req.body;
        const data = await User.findOne({ user, password });
        if (!data) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ❌ Delete User
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✏️ Update User
exports.updateUser = async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");

const JWT_SECRET = process.env.JWT_SECRET || "expense-tracker-secret";
const DEFAULT_TOKEN_EXPIRY = "1d";
const REMEMBER_ME_TOKEN_EXPIRY = "30d";
const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$/;

const buildAuthPayload = (userDoc, rememberMe = false) => {
    const user = {
        id: userDoc._id,
        user: userDoc.user,
    };

    const token = jwt.sign(
        { id: userDoc._id, user: userDoc.user },
        JWT_SECRET,
        { expiresIn: rememberMe ? REMEMBER_ME_TOKEN_EXPIRY : DEFAULT_TOKEN_EXPIRY }
    );

    return {
        message: "Success",
        user,
        token,
    };
};

exports.userHandle = async (req, res) => {
    const { apitype, user, password, rememberMe, id, data } = req.body;

    try {
        switch (apitype) {
            case "addUser": {
                if (!user || !password) {
                    return res.status(400).json({ message: "Username and password are required" });
                }

                const normalizedUser = user.trim();
                const existingUser = await User.findOne({ user: normalizedUser }).lean();

                if (existingUser) {
                    return res.status(409).json({ message: "Username already exists" });
                }

                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = await User.create({
                    user: normalizedUser,
                    password: hashedPassword,
                });

                return res.status(201).json(buildAuthPayload(newUser, Boolean(rememberMe)));
            }

            case "loginUser": {
                if (!user || !password) {
                    return res.status(400).json({ message: "Username and password are required" });
                }

                const normalizedUser = user.trim();
                const existingUser = await User.findOne({ user: normalizedUser });

                if (!existingUser) {
                    return res.status(401).json({ message: "Invalid credentials" });
                }

                const isPasswordHashed = BCRYPT_HASH_PATTERN.test(existingUser.password);
                const isPasswordValid = isPasswordHashed
                    ? await bcrypt.compare(password, existingUser.password)
                    : existingUser.password === password;

                if (!isPasswordValid) {
                    return res.status(401).json({ message: "Invalid credentials" });
                }

                if (!isPasswordHashed) {
                    existingUser.password = await bcrypt.hash(password, 10);
                    await existingUser.save();
                }

                return res.json(buildAuthPayload(existingUser, Boolean(rememberMe)));
            }

            case "deleteUser": {
                const userId = id || req.params.id;

                if (!userId) {
                    return res.status(400).json({ message: "User id is required" });
                }

                const deletedUser = await User.findByIdAndDelete(userId);

                if (!deletedUser) {
                    return res.status(404).json({ message: "User not found" });
                }

                return res.json({ message: "Deleted successfully" });
            }

            case "updateUser": {
                const userId = id || req.params.id;

                if (!userId) {
                    return res.status(400).json({ message: "User id is required" });
                }

                const updatePayload = { ...(data || {}) };

                if (updatePayload.user) {
                    updatePayload.user = updatePayload.user.trim();
                }

                if (updatePayload.password) {
                    updatePayload.password = await bcrypt.hash(updatePayload.password, 10);
                }

                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    updatePayload,
                    { new: true, runValidators: true, projection: { password: 0 } }
                );

                if (!updatedUser) {
                    return res.status(404).json({ message: "User not found" });
                }

                return res.json(updatedUser);
            }

            default:
                return res.status(400).json({ message: "Invalid apitype" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const express = require("express");
const router = express.Router();

const {
    addUser,
    getUser,
    loginUser,
    deleteUser,
    updateUser
} = require("../controller/usercontroller");

// Routes
router.post("/adduser", addUser);
router.get("/users", getUser);
router.post("/loginuser", loginUser);
router.delete("/deleteuser/:id", deleteUser);
router.put("/updateuser/:id", updateUser);

module.exports = router;
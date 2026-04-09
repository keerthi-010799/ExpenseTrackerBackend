const express = require("express");
const router = express.Router();

const {
    userHandle
} = require("../controller/usercontroller");

// Routes
router.post("/user", userHandle);

module.exports = router;
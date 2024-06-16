const express = require("express");
const { getAllUser, register, login } = require("../Controller/userController");
const router = express.Router();

router.get("/allUsers", getAllUser);
router.post("/register", register);
router.post("/login", login);

module.exports = router;

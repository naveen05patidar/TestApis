const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const userSecretKey = "adsdsadsadasdhujaskdl121212asdnasdtusa121212udysai";

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  const { FirstName, LastName, MobileNumber, Email, Password } = req.body;

  try {
    let user = await User.findOne({ Email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, msg: "User already exists" });
    }

    // Create a new user
    user = new User({
      FirstName,
      LastName,
      MobileNumber,
      Email,
      Password,
    });

    // Save the user
    await user.save();

    // Generate a JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, userSecretKey, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ success: true, token: token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: err.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { EmailOrMobile, Password } = req.body;

  try {
    // Find user by email or mobile number
    let user = await User.findOne({
      $or: [{ Email: EmailOrMobile }, { MobileNumber: EmailOrMobile }],
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid Email or Mobile Number" });
    }

    // Check password
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: "Invalid Password " });
    }

    // Generate a JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, userSecretKey, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res
        .status(200)
        .json({ token: token, success: true, msg: "Login Successfully" });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: err.message });
  }
});

module.exports = router;

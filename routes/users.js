const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// User registration route
router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      username: req.body.username,
      password: hashedPassword
    });
    res.status(201).json(user);
  } catch {
    res.status(500).send();
  }
});

// Create a new user
//User.create('username', 'password');

// Find a user by username
//User.findByUsername('username');

// User login route
router.post('/login', async (req, res) => {
  try {
    const user = await User.findByUsername(req.body.username);
    if (user == null) {
      return res.status(400).send('Cannot find user');
    }

    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.json({ accessToken: accessToken });
    } else {
      res.send('Not Allowed');
    }
  } catch {
    res.status(500).send();
  }
});

module.exports = router;
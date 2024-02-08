/**
 * This Express.js router file manages sign-up and sign-in
 * routes for user authentication. It securely handles user registration
 * by hashing passwords using bcrypt, and facilitates user authentication by
 * comparing stored hashed passwords with the provided credentials.
 * @author Caleb Chiang
 * @version 1.0.0
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Sign-up route
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering new user.' });
    }
});

// Sign-in route
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful!' });
    } catch (error) {
        res.status(500).json({ message: 'Error signing in.' });
    }
});

module.exports = router;

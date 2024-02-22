/**
 * This Express.js router file manages sign-up and sign-in
 * routes for user authentication. It securely handles user registration
 *  and facilitates user authentication by comparing stored hashed passwords
 *  with the provided credentials.
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
        console.log("Signup request body:", req.body); // Log incoming data
        const { username, email, password } = req.body;

        // The password will be hashed automatically by the pre-save middleware in the User model
        const user = new User({ username, email, password });
        await user.save();
        console.log("User created successfully"); // Confirm user creation
        res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
        console.error("Signup error:", error); // Log any errors
        res.status(500).json({ message: 'Error registering new user.' });
    }
});


// Sign-in route
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful!' });
    } catch (error) {
        res.status(500).json({ message: 'Error signing in.' });
    }
});

module.exports = router;

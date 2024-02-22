const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Add a stock to the watchlist
router.post('/watchlist/add', async (req, res) => {
    const { userId, stockSymbol } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { watchlist: stockSymbol } }, // $addToSet avoids duplicates
            { new: true }
        );
        res.status(200).json(user.watchlist);
    } catch (error) {
        res.status(500).json({ message: 'Error adding stock to watchlist.' });
    }
});

// Remove a stock from the watchlist
router.post('/watchlist/remove', async (req, res) => {
    const { userId, stockSymbol } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { watchlist: stockSymbol } },
            { new: true }
        );
        res.status(200).json(user.watchlist);
    } catch (error) {
        res.status(500).json({ message: 'Error removing stock from watchlist.' });
    }
});

module.exports = router;

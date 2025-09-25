const express = require('express');
const protect = require('../middleware/authMiddleware');
const { getWatchlist, addToWatchlist, removeFromWatchlist } = require('../controllers/userController');
const router = express.Router();

router.get('/watchlist', protect, getWatchlist);
router.post('/watchlist', protect, addToWatchlist);
router.delete('/watchlist/:tmdbId', protect, removeFromWatchlist);

module.exports = router;

// Add these routes
router.get('/:id', protect, getUserProfile);
router.put('/:id', protect, updateUserProfile);
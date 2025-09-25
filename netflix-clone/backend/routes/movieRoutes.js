const express = require('express');
const { getMovies, searchMovies } = require('../controllers/movieController');
const router = express.Router();

router.get('/:category', getMovies);
router.get('/search', searchMovies);

module.exports = router;
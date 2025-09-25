const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movies: [{ tmdbId: Number, title: String, poster: String }],
});

module.exports = mongoose.model('Watchlist', watchlistSchema);
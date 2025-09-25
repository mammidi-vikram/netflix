const Watchlist = require('../models/Watchlist');

exports.getWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ userId: req.user.id });
    res.json(watchlist ? watchlist.movies : []);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.addToWatchlist = async (req, res) => {
  const { tmdbId, title, poster } = req.body;
  try {
    let watchlist = await Watchlist.findOne({ userId: req.user.id });
    if (!watchlist) watchlist = new Watchlist({ userId: req.user.id, movies: [] });

    if (!watchlist.movies.some(movie => movie.tmdbId === tmdbId)) {
      watchlist.movies.push({ tmdbId, title, poster });
      await watchlist.save();
    }
    res.json(watchlist.movies);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.removeFromWatchlist = async (req, res) => {
  const { tmdbId } = req.params;
  try {
    const watchlist = await Watchlist.findOne({ userId: req.user.id });
    if (watchlist) {
      watchlist.movies = watchlist.movies.filter(movie => movie.tmdbId !== parseInt(tmdbId));
      await watchlist.save();
    }
    res.json(watchlist ? watchlist.movies : []);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
// Add these to the existing userController.js
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    
    // Check if email is already taken by another user
    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: req.params.id } 
    });
    
    if (existingUser) {
      return res.status(400).json({ msg: 'Email already in use' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
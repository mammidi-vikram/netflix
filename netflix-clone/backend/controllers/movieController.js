const axios = require('axios');

exports.getMovies = async (req, res) => {
  const { category } = req.params;  // e.g., 'popular', 'top_rated'
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${category}?api_key=${process.env.TMDB_API_KEY}`);
    res.json(response.data.results);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching movies' });
  }
};

exports.searchMovies = async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${query}`);
    res.json(response.data.results);
  } catch (err) {
    res.status(500).json({ msg: 'Error searching movies' });
  }
};
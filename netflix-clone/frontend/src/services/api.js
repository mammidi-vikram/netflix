import axios from 'axios';

const API = axios.create({ 
  baseURL: process.env.REACT_APP_API_URL
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// TMDB direct calls (for details, since backend proxies categories/search)
export const getMovieDetails = (id) => 
  axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&append_to_response=videos,credits,recommendations`);

export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const getMovies = (category) => API.get(`/movies/${category}`);
export const searchMovies = (query) => API.get(`/movies/search?query=${query}`);
export const getWatchlist = () => API.get('/user/watchlist');
export const addToWatchlist = (movie) => API.post('/user/watchlist', movie);
export const removeFromWatchlist = (tmdbId) => API.delete(`/user/watchlist/${tmdbId}`);
export const getUserProfile = (id) => API.get(`/user/${id}`);
export const updateUserProfile = (id, data) => API.put(`/user/${id}`, data);
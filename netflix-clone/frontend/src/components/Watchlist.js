import React, { useEffect, useState } from 'react';
import { getWatchlist, removeFromWatchlist } from '../services/api';

const Watchlist = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      const data = await getWatchlist();
      setMovies(data);
    };
    fetchWatchlist();
  }, []);

  const handleRemove = async (tmdbId) => {
    await removeFromWatchlist(tmdbId);
    setMovies(movies.filter(movie => movie.tmdbId !== tmdbId));
  };

  return (
    <div>
      <h2>My Watchlist</h2>
      <div style={{ display: 'flex', overflowX: 'scroll' }}>
        {movies.map((movie) => (
          <div key={movie.tmdbId} style={{ margin: '10px' }}>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster}`} alt={movie.title} width="200" />
            <p>{movie.title}</p>
            <button onClick={() => handleRemove(movie.tmdbId)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
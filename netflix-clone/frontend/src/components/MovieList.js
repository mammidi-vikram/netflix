import React, { useEffect, useState } from 'react';
import { getMovies } from '../services/api';
import { addToWatchlist } from '../services/api';

const MovieList = ({ category }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getMovies(category);
      setMovies(data);
    };
    fetchMovies();
  }, [category]);

  const handleAdd = async (movie) => {
    await addToWatchlist({ tmdbId: movie.id, title: movie.title, poster: movie.poster_path });
    alert('Added to watchlist!');
  };

  return (
    <div>
      <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
      <div style={{ display: 'flex', overflowX: 'scroll' }}>
        {movies.map((movie) => (
          <div key={movie.id} style={{ margin: '10px' }}>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} width="200" />
            <p>{movie.title}</p>
            <button onClick={() => handleAdd(movie)}>Add to Watchlist</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
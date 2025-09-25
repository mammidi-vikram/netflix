import React from 'react';
import MovieList from '../components/MovieList';

const Home = () => (
  <div>
    <MovieList category="popular" />
    <MovieList category="top_rated" />
    {/* Add more categories like 'upcoming', 'now_playing' */}
  </div>
);

export default Home;
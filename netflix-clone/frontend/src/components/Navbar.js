import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { searchMovies } from '../services/api';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery) {
      const results = await searchMovies(searchQuery);
      // Handle results, e.g., navigate to a search page with results as state
      navigate('/search', { state: { results } });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{ background: 'black', color: 'white', padding: '10px' }}>
      <Link to="/">Home</Link>
      {token ? (
        <>
          <Link to="/profile">Profile</Link>
          <Link to="/watchlist">Watchlist</Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      )}
      <form onSubmit={handleSearch}>
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search movies..." />
        <button type="submit">Search</button>
      </form>
    </nav>
  );
};

export default Navbar;
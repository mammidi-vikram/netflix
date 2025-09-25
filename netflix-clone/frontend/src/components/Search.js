import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { searchMovies } from '../services/api';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [noResults, setNoResults] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get initial search results from navigation state or query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    } else if (location.state?.results) {
      // Handle search from navbar with state
      setSearchResults(location.state.results);
    }
  }, [location]);

  const performSearch = async (query) => {
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      setError('');
      setNoResults(false);
      
      const { data } = await searchMovies(query);
      setSearchResults(data);
      
      if (data.length === 0) {
        setNoResults(true);
      }
      
      // Update URL
      navigate(`/search?q=${encodeURIComponent(query)}`, { replace: true });
      
    } catch (err) {
      setError('Failed to search movies. Please try again.');
      setSearchResults([]);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim());
    }
  };

  const handleAddToWatchlist = async (movie) => {
    try {
      await addToWatchlist({ 
        tmdbId: movie.id, 
        title: movie.title, 
        poster: movie.poster_path 
      });
      alert('Added to watchlist!');
    } catch (err) {
      alert('Failed to add to watchlist. Please log in.');
    }
  };

  const formatReleaseDate = (dateString) => {
    if (!dateString) return 'No release date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getGenres = (genreIds) => {
    const genreMap = {
      28: 'Action', 12: 'Adventure', 16: 'Animation',
      35: 'Comedy', 80: 'Crime', 99: 'Documentary',
      18: 'Drama', 10751: 'Family', 14: 'Fantasy',
      36: 'History', 27: 'Horror', 10402: 'Music',
      9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
      10770: 'TV Movie', 53: 'Thriller', 10752: 'War',
      37: 'Western'
    };
    
    return genreIds?.map(id => genreMap[id]).filter(Boolean).join(', ') || 'N/A';
  };

  return (
    <div className="search-container">
      {/* Search Header */}
      <div className="search-header">
        <div className="search-nav">
          <Link to="/" className="logo-link">
            <i className="fas fa-play-circle"></i>
            <span>Netflix Clone</span>
          </Link>
          <form onSubmit={handleSubmit} className="search-form">
            <div className="search-input-wrapper">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for movies..."
                className="search-input"
                disabled={loading}
              />
              <button type="submit" className="search-btn" disabled={loading}>
                <i className={loading ? 'fas fa-spinner fa-spin' : 'fas fa-search'}></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Search Results */}
      <div className="search-results-container">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Searching for "{searchQuery}"...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
            <button onClick={() => performSearch(searchQuery)} className="retry-btn">
              Try Again
            </button>
          </div>
        ) : noResults ? (
          <div className="no-results-container">
            <i className="fas fa-search"></i>
            <h2>No results found</h2>
            <p>We couldn't find any movies matching "{searchQuery}"</p>
            <div className="search-suggestions">
              <p>Try searching for:</p>
              <ul>
                <li><Link to="/search?q=avengers">Avengers</Link></li>
                <li><Link to="/search?q=star+wars">Star Wars</Link></li>
                <li><Link to="/search?q=harry+potter">Harry Potter</Link></li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            <div className="results-header">
              <h1>Search Results for "{searchQuery}"</h1>
              <p>{searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found</p>
            </div>

            {searchResults.length > 0 && (
              <div className="results-grid">
                {searchResults.map((movie) => (
                  <div key={movie.id} className="movie-card">
                    <div className="movie-poster">
                      <img 
                        src={movie.poster_path 
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : '/placeholder-poster.jpg'
                        } 
                        alt={movie.title}
                        loading="lazy"
                      />
                      <div className="movie-overlay">
                        <button 
                          onClick={() => handleAddToWatchlist(movie)}
                          className="add-to-watchlist-btn"
                          title="Add to Watchlist"
                        >
                          <i className="far fa-plus-circle"></i>
                        </button>
                      </div>
                    </div>
                    
                    <div className="movie-info">
                      <h3 className="movie-title">{movie.title}</h3>
                      <div className="movie-meta">
                        <span className="release-date">
                          <i className="far fa-calendar"></i>
                          {formatReleaseDate(movie.release_date)}
                        </span>
                        <span className="rating">
                          <i className="fas fa-star"></i>
                          {movie.vote_average?.toFixed(1)}/10
                        </span>
                      </div>
                      <p className="movie-genres">{getGenres(movie.genre_ids)}</p>
                      <p className="movie-overview">
                        {movie.overview 
                          ? `${movie.overview.substring(0, 150)}...` 
                          : 'No description available.'
                        }
                      </p>
                      <div className="movie-actions">
                        <Link 
                          to={`/movie/${movie.id}`}
                          className="details-btn"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .search-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #141414 0%, #000 100%);
          color: white;
          font-family: 'Netflix Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .search-header {
          position: sticky;
          top: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
          z-index: 100;
          border-bottom: 1px solid #333;
        }

        .search-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 15px 20px;
        }

        .logo-link {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #e50914;
          font-size: 24px;
          font-weight: 300;
          gap: 10px;
        }

        .logo-link i {
          font-size: 32px;
        }

        .logo-link span {
          font-family: 'Netflix Sans', sans-serif;
        }

        .search-form {
          flex: 1;
          max-width: 600px;
          margin: 0 20px;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input {
          width: 100%;
          padding: 12px 50px 12px 16px;
          border: 1px solid #333;
          border-radius: 4px;
          background: #232f3e;
          color: white;
          font-size: 16px;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #e50914;
        }

        .search-input::placeholder {
          color: #999;
        }

        .search-btn {
          position: absolute;
          right: 5px;
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 5px;
          border-radius: 50%;
          transition: color 0.2s;
        }

        .search-btn:hover:not(:disabled) {
          color: #e50914;
        }

        .search-btn:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .search-results-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .loading-container, .error-container, .no-results-container {
          text-align: center;
          padding: 60px 20px;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid #333;
          border-top: 3px solid #e50914;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-container i {
          font-size: 48px;
          color: #e50914;
          margin-bottom: 20px;
        }

        .retry-btn {
          background: #e50914;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          margin-top: 20px;
          transition: background 0.2s;
        }

        .retry-btn:hover {
          background: #f40612;
        }

        .no-results-container i {
          font-size: 64px;
          color: #666;
          margin-bottom: 20px;
        }

        .no-results-container h2 {
          color: #e50914;
          margin-bottom: 10px;
        }

        .search-suggestions {
          margin-top: 30px;
          padding: 20px;
          background: #232f3e;
          border-radius: 8px;
        }

        .search-suggestions ul {
          list-style: none;
          padding: 0;
          margin: 15px 0 0 0;
        }

        .search-suggestions li {
          margin: 8px 0;
        }

        .search-suggestions a {
          color: #b3b3b3;
          text-decoration: none;
          transition: color 0.2s;
        }

        .search-suggestions a:hover {
          color: #e50914;
        }

        .results-header {
          margin-bottom: 30px;
        }

        .results-header h1 {
          color: #e50914;
          margin: 0 0 5px 0;
          font-size: 32px;
          font-weight: 300;
        }

        .results-header p {
          color: #b3b3b3;
          margin: 0;
          font-size: 16px;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 25px;
        }

        .movie-card {
          background: #232f3e;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }

        .movie-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(229, 9, 20, 0.3);
        }

        .movie-poster {
          position: relative;
          height: 450px;
          overflow: hidden;
        }

        .movie-poster img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .movie-card:hover .movie-poster img {
          transform: scale(1.05);
        }

        .movie-overlay {
          position: absolute;
          top: 10px;
          right: 10px;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .movie-card:hover .movie-overlay {
          opacity: 1;
        }

        .add-to-watchlist-btn {
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: background 0.2s;
        }

        .add-to-watchlist-btn:hover {
          background: rgba(229, 9, 20, 0.8);
        }

        .movie-info {
          padding: 20px;
        }

        .movie-title {
          color: white;
          margin: 0 0 10px 0;
          font-size: 18px;
          font-weight: 500;
          line-height: 1.3;
        }

        .movie-meta {
          display: flex;
          gap: 15px;
          margin-bottom: 10px;
          color: #b3b3b3;
          font-size: 14px;
        }

        .movie-meta i {
          margin-right: 5px;
          width: 12px;
        }

        .movie-genres {
          color: #999;
          font-size: 13px;
          margin: 8px 0;
          font-style: italic;
        }

        .movie-overview {
          color: #ccc;
          line-height: 1.5;
          margin: 12px 0 15px 0;
          font-size: 14px;
        }

        .movie-actions {
          margin-top: 15px;
        }

        .details-btn {
          display: inline-block;
          background: #e50914;
          color: white;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          transition: background 0.2s;
        }

        .details-btn:hover {
          background: #f40612;
        }

        @media (max-width: 768px) {
          .search-nav {
            flex-direction: column;
            gap: 15px;
            padding: 10px;
          }

          .search-form {
            margin: 0;
            width: 100%;
          }

          .results-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .movie-poster {
            height: 300px;
          }

          .results-header h1 {
            font-size: 24px;
          }
        }

        @media (max-width: 480px) {
          .search-results-container {
            padding: 10px;
          }

          .movie-info {
            padding: 15px;
          }

          .movie-title {
            font-size: 16px;
          }

          .movie-overview {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

// Add this import at the top of the file for the watchlist functionality
import { addToWatchlist } from '../services/api';

export default Search;
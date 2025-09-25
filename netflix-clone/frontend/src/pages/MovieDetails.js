import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, addToWatchlist } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getMovieDetails(id);
        setMovie(data);
        setRecommendations(data.recommendations?.results.slice(0, 10) || []);
      } catch (err) {
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAdd = async () => {
    if (!isAuthenticated) return navigate('/login');
    try {
      await addToWatchlist({ tmdbId: movie.id, title: movie.title, poster: movie.poster_path });
      alert('Added to watchlist!');
    } catch (err) {
      setError('Failed to add to watchlist');
    }
  };

  const getTrailer = () => {
    const trailer = movie.videos?.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
    return trailer ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1` : null;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;
  if (!movie) return <div>Movie not found</div>;

  return (
    <div>
      {/* Hero section with backdrop */}
      <div style={{
        backgroundImage: `ur[](https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        backgroundSize: 'cover',
        height: '70vh',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          color: 'white'
        }}>
          <h1>{movie.title}</h1>
          <p>{movie.overview}</p>
          <button onClick={() => setShowTrailer(true)}>Watch Trailer</button>
          <button onClick={handleAdd}>Add to Watchlist</button>
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h2>Recommendations</h2>
        <div style={{ display: 'flex', overflowX: 'scroll' }}>
          {recommendations.map(rec => (
            <div key={rec.id} onClick={() => navigate(`/movie/${rec.id}`)}>
              <img src={`https://image.tmdb.org/t/p/w200${rec.poster_path}`} alt={rec.title} />
              <p>{rec.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && getTrailer() && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <iframe src={getTrailer()} width="800" height="450" title="Trailer"></iframe>
          <button onClick={() => setShowTrailer(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
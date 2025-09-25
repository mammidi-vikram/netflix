import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getWatchlist } from '../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    username: '',
    email: ''
  });
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Get user info from token
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const userId = decoded.id;
        
        // Fetch user data
        const userResponse = await axios.get(`http://localhost:5000/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUser(userResponse.data);
        setEditData({
          username: userResponse.data.username,
          email: userResponse.data.email
        });

        // Fetch watchlist
        const watchlistData = await getWatchlist();
        setWatchlist(watchlistData);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile data');
        setLoading(false);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/user/${user._id}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser(response.data);
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="profile-error">Error: {error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-info">
          <h2>Account Information</h2>
          {editMode ? (
            <div className="edit-form">
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  name="username"
                  value={editData.username}
                  onChange={handleEditChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleEditChange}
                  className="form-input"
                />
              </div>
              <div className="form-actions">
                <button onClick={handleSave} className="save-btn">Save Changes</button>
                <button onClick={handleEditToggle} className="cancel-btn">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="display-info">
              <p><strong>Username:</strong> {user?.username}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Member Since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
              <button onClick={handleEditToggle} className="edit-btn">Edit Profile</button>
            </div>
          )}
        </div>

        <div className="watchlist-section">
          <h2>My Watchlist ({watchlist.length})</h2>
          {watchlist.length === 0 ? (
            <div className="empty-watchlist">
              <p>Your watchlist is empty. Start adding movies!</p>
              <button onClick={() => navigate('/')} className="browse-btn">
                Browse Movies
              </button>
            </div>
          ) : (
            <div className="watchlist-grid">
              {watchlist.map((movie) => (
                <div key={movie.tmdbId} className="watchlist-item">
                  <img 
                    src={`https://image.tmdb.org/t/p/w200${movie.poster}`} 
                    alt={movie.title}
                    className="watchlist-poster"
                  />
                  <div className="watchlist-info">
                    <h3>{movie.title}</h3>
                    <button 
                      onClick={() => navigate(`/movie/${movie.tmdbId}`)}
                      className="details-btn"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background: #141414;
          color: white;
          min-height: 100vh;
        }

        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #333;
        }

        .profile-header h1 {
          margin: 0;
          color: #e50914;
        }

        .logout-btn {
          background: #e50914;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .profile-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 30px;
        }

        .profile-info, .watchlist-section {
          background: #232f3e;
          padding: 20px;
          border-radius: 8px;
        }

        .profile-info h2, .watchlist-section h2 {
          margin-top: 0;
          color: #e50914;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
        }

        .display-info p {
          margin: 10px 0;
          padding: 8px 0;
          border-bottom: 1px solid #444;
        }

        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .form-input {
          padding: 10px;
          border: 1px solid #444;
          border-radius: 4px;
          background: #333;
          color: white;
          font-size: 16px;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        .save-btn, .cancel-btn, .edit-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .save-btn {
          background: #e50914;
          color: white;
        }

        .cancel-btn, .edit-btn {
          background: #333;
          color: white;
        }

        .empty-watchlist {
          text-align: center;
          padding: 40px;
          color: #999;
        }

        .browse-btn {
          background: #e50914;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 15px;
          font-size: 16px;
        }

        .watchlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        .watchlist-item {
          background: #333;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.2s;
        }

        .watchlist-item:hover {
          transform: translateY(-2px);
        }

        .watchlist-poster {
          width: 100%;
          height: 280px;
          object-fit: cover;
        }

        .watchlist-info {
          padding: 15px;
        }

        .watchlist-info h3 {
          margin: 0 0 10px 0;
          font-size: 16px;
        }

        .details-btn {
          background: #e50914;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          width: 100%;
        }

        .profile-loading, .profile-error {
          text-align: center;
          padding: 50px;
          color: #999;
        }

        @media (max-width: 768px) {
          .profile-content {
            grid-template-columns: 1fr;
          }
          
          .profile-header {
            flex-direction: column;
            gap: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      setSuccess('');

      const { data } = await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('token', data.token);
      setSuccess('Account created successfully! Redirecting...');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (err) {
      const errorMessage = err.response?.data?.msg || 'Signup failed. Please try again.';
      
      if (errorMessage.includes('already exists')) {
        setErrors({ email: 'An account with this email already exists' });
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Create Account</h1>
          <p>Join Netflix and start watching today!</p>
        </div>

        {success && (
          <div className="success-message">
            <span>{success}</span>
          </div>
        )}

        {errors.general && (
          <div className="error-message">
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className={errors.username ? 'input-error' : ''}
              disabled={loading}
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? 'input-error' : ''}
              disabled={loading}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className={errors.password ? 'input-error' : ''}
              disabled={loading}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={errors.confirmPassword ? 'input-error' : ''}
              disabled={loading}
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <button 
            type="submit" 
            className="signup-btn"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="signup-footer">
          <p>Already have an account? <Link to="/login">Sign in here</Link></p>
        </div>
      </div>

      <style jsx>{`
        .signup-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #141414 0%, #000 100%);
          padding: 20px;
          box-sizing: border-box;
        }

        .signup-card {
          background: #141414;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
          border: 1px solid #333;
          width: 100%;
          max-width: 400px;
        }

        .signup-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .signup-header h1 {
          color: #e50914;
          margin: 0 0 10px 0;
          font-size: 32px;
          font-weight: 300;
        }

        .signup-header p {
          color: #b3b3b3;
          margin: 0;
          font-size: 16px;
        }

        .success-message, .error-message {
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
          text-align: center;
          font-weight: 500;
        }

        .success-message {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid #22c55e;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid #ef4444;
        }

        .signup-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          color: #fff;
          font-size: 14px;
          font-weight: 500;
        }

        .form-group input {
          padding: 12px 16px;
          border: 1px solid #333;
          border-radius: 4px;
          background: #232f3e;
          color: #fff;
          font-size: 16px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #e50914;
          box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.2);
        }

        .input-error {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .error-text {
          color: #ef4444;
          font-size: 12px;
          margin-top: 4px;
        }

        .signup-btn {
          background: #e50914;
          color: white;
          border: none;
          padding: 16px;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 10px;
        }

        .signup-btn:hover:not(:disabled) {
          background: #f40612;
        }

        .signup-btn:disabled {
          background: #666;
          cursor: not-allowed;
        }

        .signup-footer {
          text-align: center;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #333;
        }

        .signup-footer p {
          color: #b3b3b3;
          margin: 0;
          font-size: 14px;
        }

        .signup-footer a {
          color: #e50914;
          text-decoration: none;
          font-weight: 500;
        }

        .signup-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .signup-card {
            padding: 24px;
            margin: 10px;
          }

          .signup-header h1 {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default Signup;
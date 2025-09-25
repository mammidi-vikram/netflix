import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    color: '#999'
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      border: '4px solid #333',
      borderTop: '4px solid #e50914',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <p style={{ marginTop: '20px' }}>{message}</p>
  </div>
);

export default LoadingSpinner;
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  var usernameState = useState('');
  var username = usernameState[0];
  var setUsername = usernameState[1];
  var passwordState = useState('');
  var password = passwordState[0];
  var setPassword = passwordState[1];
  var errorState = useState('');
  var error = errorState[0];
  var setError = errorState[1];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios.post('http://localhost:3001/api/auth/login', {
      username: username,
      password: password
    })
    .then(function() {
      localStorage.setItem('username', username);
      window.location.href = '/dashboard';
    })
    .catch(function() {
      setError('Login failed');
    });
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-header">
          <h1 className="page-title">Sign In</h1>
          <p className="form-description">Access your Google Forms Clone account</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your username"
              value={username}
              onChange={function(e) { setUsername(e.target.value); }}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={function(e) { setPassword(e.target.value); }}
              required
            />
          </div>
          
          {error ? <div className="error-message">{error}</div> : null}
          
          <div className="submit-section">
            <button type="submit" className="btn btn-primary">
              Sign In
            </button>
          </div>
        </form>
        
        <div className="nav-links">
          <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login; 
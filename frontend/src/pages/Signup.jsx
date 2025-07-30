import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
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

    axios.post('http://localhost:3001/api/auth/signup', {
      username: username,
      password: password
    })
    .then(function() {
      window.location.href = '/login';
    })
    .catch(function() {
      setError('Signup failed');
    });
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-header">
          <h1 className="page-title">Create Account</h1>
          <p className="form-description">Join Google Forms Clone to start creating forms</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="Choose a username"
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
              placeholder="Create a password"
              value={password}
              onChange={function(e) { setPassword(e.target.value); }}
              required
            />
          </div>
          
          {error ? <div className="error-message">{error}</div> : null}
          
          <div className="submit-section">
            <button type="submit" className="btn btn-primary">
              Create Account
            </button>
          </div>
        </form>
        
        <div className="nav-links">
          <p>Already have an account? <a href="/login">Sign in</a></p>
        </div>
      </div>
    </div>
  );
};

export default Signup; 
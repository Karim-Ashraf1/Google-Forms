import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  var formsState = useState([]);
  var forms = formsState[0];
  var setForms = formsState[1];
  var errorState = useState('');
  var error = errorState[0];
  var setError = errorState[1];

  useEffect(function() {
    var username = localStorage.getItem('username');
    if (!username) {
      window.location.href = '/login';
      return;
    }

    axios.get('http://localhost:3001/api/forms', {
      headers: { username: username }
    })
    .then(function(res) {
      setForms(res.data.forms);
    })
    .catch(function() {
      setError('Could not load forms');
    });
  }, []);

  const handleCreate = () => {
    window.location.href = '/create';
  };

  const handleView = (id) => {
    window.location.href = '/form/' + id;
  };

  const handleResponses = (id) => {
    window.location.href = '/form/' + id + '/responses';
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-header">
          <h1 className="page-title">My Forms</h1>
          <p className="form-description">Create and manage your forms</p>
        </div>

        <div className="submit-section">
          <button onClick={handleCreate} className="btn btn-primary">
            + Create New Form
          </button>
        </div>

        {error ? <div className="error-message">{error}</div> : null}

        {forms.length === 0 ? (
          <div className="form-card">
            <div className="form-header">
              <h2 className="form-title">No forms yet</h2>
              <p className="form-description">Create your first form to get started</p>
            </div>
          </div>
        ) : (
          <div className="questions-container">
            {forms.map(function(form) {
              return (
                <div key={form._id} className="form-card">
                  <h3 className="form-title">{form.title}</h3>
                  <p className="form-description">
                    {form.questions ? form.questions.length : 0} questions
                  </p>
                  <div className="form-actions">
                    <button
                      onClick={function() { handleView(form._id); }}
                      className="btn btn-secondary"
                    >
                      View Form
                    </button>
                    <button
                      onClick={function() { handleResponses(form._id); }}
                      className="btn btn-secondary"
                    >
                      View Responses
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
 
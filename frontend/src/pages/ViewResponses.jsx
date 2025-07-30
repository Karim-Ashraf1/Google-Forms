import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ViewResponses = () => {
  var params = useParams();
  var id = params.id;
  
  var responsesState = useState([]);
  var responses = responsesState[0];
  var setResponses = responsesState[1];
  var formState = useState(null);
  var form = formState[0];
  var setForm = formState[1];
  var errorState = useState('');
  var error = errorState[0];
  var setError = errorState[1];

  useEffect(function() {
    if (!id) return;
    
    var username = localStorage.getItem('username');
    if (!username) {
      window.location.href = '/login';
      return;
    }
    
    axios.get('http://localhost:3001/api/forms/' + id)
      .then(function(res) {
        setForm(res.data.form);
      })
      .catch(function() {
        setError('Could not load form');
      });
    
    axios.get('http://localhost:3001/api/forms/' + id + '/responses', {
      headers: { username: username }
    })
      .then(function(res) {
        setResponses(res.data.responses);
      })
      .catch(function() {
        setError('Could not load responses');
      });
  }, [id]);

  if (!form) {
    return (
      <div className="container">
        <div className="loading">Loading responses...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-header">
          <h1 className="page-title">Form Responses</h1>
          <p className="form-description">{form.title}</p>
        </div>

        {error ? <div className="error-message">{error}</div> : null}

        {responses.length === 0 ? (
          <div className="form-card">
            <div className="form-header">
              <h2 className="form-title">No responses yet</h2>
              <p className="form-description">Share your form to start collecting responses</p>
            </div>
          </div>
        ) : (
          <div className="questions-container">
            {responses.map(function(r, index) {
              return (
                <div key={index} className="response-item">
                  <div className="response-header">
                    Response {index + 1} - {r.responder || 'Anonymous'}
                  </div>
                  <div className="response-answers">
                    {r.answers.map(function(answer, j) {
                      return (
                        <div key={j}>
                          <b>Q{j + 1}:</b> {form.questions[j] ? form.questions[j].text : 'Question'}<br />
                          <b>A:</b> {answer}
                        </div>
                      );
                    })}
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

export default ViewResponses; 
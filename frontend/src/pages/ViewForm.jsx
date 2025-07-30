import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ViewForm = () => {
  var params = useParams();
  var id = params.id;
  
  var [form, setForm] = useState(null);
  var [answers, setAnswers] = useState([]);
  var [error, setError] = useState('');
  var [success, setSuccess] = useState('');

  useEffect(function() {
    if (!id) return;
    axios.get('http://localhost:3001/api/forms/' + id)
      .then(function(res) {
        setForm(res.data.form);
        
        var emptyAnswers = [];
        for (var i = 0; i < res.data.form.questions.length; i++) {
          emptyAnswers.push('');
        }
        setAnswers(emptyAnswers);
      })
      .catch(function() {
        setError('Could not load form');
      });
  }, [id]);

  const updateAnswer = (index, value) => {
    var newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/api/forms/' + id + '/response', {
      answers: answers
    })
    .then(function() {
      setSuccess('Response submitted!');
      setError('');
      setTimeout(function() {
        window.location.href = '/dashboard';
      }, 1000);
    })
    .catch(function() {
      setError('Could not submit response');
      setSuccess('');
    });
  };

  if (!form) {
    return (
      <div className="container">
        <div className="loading">Loading form...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-header">
          <h1 className="page-title">{form.title}</h1>
          <p className="form-description">Please fill out this form</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="questions-container">
            {form.questions.map(function(question, index) {
              var inputElement;
              
              if (question.type === 'multiple' && question.choices && question.choices.length > 0) {
                inputElement = (
                  <div className="radio-group">
                    {question.choices.map(function(choice, i) {
                      return (
                        <div key={i} className="radio-item">
                          <input
                            type="radio"
                            name={'question-' + index}
                            value={choice}
                            checked={answers[index] === choice}
                            onChange={function(e) {
                              updateAnswer(index, e.target.value);
                            }}
                            required
                          />
                          <label>{choice}</label>
                        </div>
                      );
                    })}
                  </div>
                );
              } else {
                inputElement = (
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your answer"
                    value={answers[index] || ''}
                    onChange={function(e) {
                      updateAnswer(index, e.target.value);
                    }}
                    required
                  />
                );
              }
              
              return (
                <div key={index} className="question-item">
                  <div className="question-text">
                    Question {index + 1}: {question.text}
                  </div>
                  {inputElement}
                </div>
              );
            })}
          </div>

          {error ? <div className="error-message">{error}</div> : null}
          {success ? <div className="success-message">{success}</div> : null}

          <div className="submit-section">
            <button type="submit" className="btn btn-primary">
              Submit Response
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViewForm; 
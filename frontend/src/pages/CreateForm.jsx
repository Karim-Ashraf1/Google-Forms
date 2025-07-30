import React, { useState } from 'react';
import axios from 'axios';

const CreateForm = () => {
  var titleState = useState('');
  var title = titleState[0];
  var setTitle = titleState[1];
  var questionsState = useState([]);
  var questions = questionsState[0];
  var setQuestions = questionsState[1];
  var questionTextState = useState('');
  var questionText = questionTextState[0];
  var setQuestionText = questionTextState[1];
  var questionTypeState = useState('text');
  var questionType = questionTypeState[0];
  var setQuestionType = questionTypeState[1];
  var questionChoicesState = useState([]);
  var questionChoices = questionChoicesState[0];
  var setQuestionChoices = questionChoicesState[1];
  var choiceTextState = useState('');
  var choiceText = choiceTextState[0];
  var setChoiceText = choiceTextState[1];
  var errorState = useState('');
  var error = errorState[0];
  var setError = errorState[1];
  var successState = useState('');
  var success = successState[0];
  var setSuccess = successState[1];

  const addChoice = () => {
    if (!choiceText) return;
    var newChoices = [];
    for (var i = 0; i < questionChoices.length; i++) {
      newChoices.push(questionChoices[i]);
    }
    newChoices.push(choiceText);
    setQuestionChoices(newChoices);
    setChoiceText('');
  };

  const addQuestion = () => {
    if (!questionText) return;
    var newQuestions = [];
    for (var i = 0; i < questions.length; i++) {
      newQuestions.push(questions[i]);
    }
    var question = { text: questionText, type: questionType };
    if (questionType === 'multiple') {
      question.choices = questionChoices;
    }
    newQuestions.push(question);
    setQuestions(newQuestions);
    setQuestionText('');
    setQuestionType('text');
    setQuestionChoices([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    var username = localStorage.getItem('username');
    axios.post('http://localhost:3001/api/forms', {
      title: title,
      questions: questions
    }, {
      headers: { username: username }
    })
    .then(function() {
      setSuccess('Form created!');
      setError('');
      setTitle('');
      setQuestions([]);
      setTimeout(function() {
        window.location.href = '/dashboard';
      }, 1000);
    })
    .catch(function() {
      setError('Could not create form');
      setSuccess('');
    });
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-header">
          <h1 className="page-title">Create New Form</h1>
          <p className="form-description">Build your form by adding questions</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Form Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter form title"
              value={title}
              onChange={function(e) { setTitle(e.target.value); }}
              required
            />
          </div>

          <div className="questions-container">
            {questions.map(function(q, index) {
              return (
                <div key={index} className="question-item">
                  <div className="question-text">Question {index + 1}: {q.text}</div>
                  <div className="question-type">Type: {q.type}</div>
                  {q.choices && q.choices.length > 0 && (
                    <ul className="choices-list">
                      {q.choices.map(function(choice, j) {
                        return <li key={j}>• {choice}</li>;
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          <div className="add-question-section">
            <div className="form-group">
              <label className="form-label">Question Text</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your question"
                value={questionText}
                onChange={function(e) { setQuestionText(e.target.value); }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Question Type</label>
              <select 
                className="form-select" 
                value={questionType} 
                onChange={function(e) { setQuestionType(e.target.value); }}
              >
                <option value="text">Text</option>
                <option value="multiple">Multiple Choice</option>
              </select>
            </div>

            {questionType === 'multiple' && (
              <div className="choices-input-section">
                <label className="form-label">Choices</label>
                {questionChoices.map(function(choice, i) {
                  return (
                    <div key={i} className="choice-input-group">
                      <input
                        type="text"
                        className="form-input"
                        value={choice}
                        readOnly
                      />
                      <button 
                        type="button" 
                        onClick={function() {
                          var newChoices = questionChoices.filter(function(_, index) { return index !== i; });
                          setQuestionChoices(newChoices);
                        }}
                        className="btn btn-danger"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
                <div className="choice-input-group">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Add a choice"
                    value={choiceText}
                    onChange={function(e) { setChoiceText(e.target.value); }}
                  />
                  <button type="button" onClick={addChoice} className="btn btn-secondary">
                    Add
                  </button>
                </div>
              </div>
            )}

            <button type="button" onClick={addQuestion} className="btn btn-secondary">
              Add Question
            </button>
          </div>

          {error ? <div className="error-message">{error}</div> : null}
          {success ? <div className="success-message">{success}</div> : null}

          <div className="submit-section">
            <button type="submit" className="btn btn-primary" disabled={questions.length === 0}>
              Create Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateForm; 
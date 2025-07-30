import Form from '../models/Form.js';
import Response from '../models/Response.js';
import User from '../models/User.js';

const createForm = async (req, res) => {
  var title = req.body.title;
  var questions = req.body.questions;
  var owner = req.user ? req.user.username : null;

  console.log('Form creation request:', { title, questions, owner });

  if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
    console.error('Missing or invalid title/questions');
    return res.status(400).json({ message: 'Title and questions are required and questions must be a non-empty array.' });
  }
  if (!owner) {
    console.error('No user found in request');
    return res.status(401).json({ message: 'User not authenticated.' });
  }

  try {
    var user = await User.findOne({ username: owner });
    if (!user) {
      console.error('User not found:', owner);
      return res.status(400).json({ message: 'User not found' });
    }
    var form = await Form.create({ title: title, questions: questions, owner: owner, responses: [] });
    user.forms.push(form._id);
    await user.save();
    res.json({ message: 'Form created', form: form });
  } catch (err) {
    console.error('Error creating form:', err);
    res.status(500).json({ message: 'Error creating form', error: err.message });
  }
};

const listForms = async (req, res) => {
  var owner = req.user ? req.user.username : null;
  console.log('List forms request:', { user: req.user, owner: owner });
  
  if (!owner) {
    console.error('No user found in request');
    return res.status(401).json({ message: 'User not authenticated.' });
  }
  try {
    var forms = await Form.find({ owner: owner });
    console.log('Found forms for user:', owner, 'Count:', forms.length);
    res.json({ forms: forms });
  } catch (err) {
    console.error('Error getting forms:', err);
    res.status(500).json({ message: 'Error getting forms', error: err.message });
  }
};

const getForm = async (req, res) => {
  var id = req.params.id;
  try {
    var form = await Form.findById(id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json({ form: form });
  } catch (err) {
    res.status(500).json({ message: 'Error getting form', error: err.message });
  }
};


const submitResponse = async (req, res) => {
  var id = req.params.id;
  var answers = req.body.answers;
  
  try {
    var form = await Form.findById(id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    var response = await Response.create({ formId: form._id, answers: answers });
    form.responses.push(response._id);
    await form.save();
    res.json({ message: 'Response submitted' });
  } catch (err) {
    console.error('Error saving response:', err);
    res.status(500).json({ message: 'Error saving response', error: err.message });
  }
};


const viewResponses = async (req, res) => {
  var id = req.params.id;
  var owner = req.user ? req.user.username : null;
  
  console.log('View responses request:', { id: id, owner: owner });
  
  try {
    var form = await Form.findById(id);
    if (!form) {
      console.error('Form not found:', id);
      return res.status(404).json({ message: 'Form not found' });
    }
    
    if (form.owner !== owner) {
      console.error('User does not own this form:', { owner: owner, formOwner: form.owner });
      return res.status(403).json({ message: 'You can only view responses for your own forms' });
    }
    
    var responses = await Response.find({ formId: form._id });
    console.log('Found responses for form:', id, 'Count:', responses.length);
    res.json({ responses: responses });
  } catch (err) {
    console.error('Error getting responses:', err);
    res.status(500).json({ message: 'Error getting responses', error: err.message });
  }
};

export { createForm, listForms, getForm, submitResponse, viewResponses };


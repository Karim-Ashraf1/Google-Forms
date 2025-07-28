// Global variables to store data
var currentUser = null;
var users = [];
var forms = [];
var responses = [];
var currentForm = null;
var currentFormId = 0;

// Load data from localStorage when page loads
function loadData() {
    var savedUsers = localStorage.getItem('formsUsers');
    var savedForms = localStorage.getItem('formsForms');
    var savedResponses = localStorage.getItem('formsResponses');
    
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }
    if (savedForms) {
        forms = JSON.parse(savedForms);
    }
    if (savedResponses) {
        responses = JSON.parse(savedResponses);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('formsUsers', JSON.stringify(users));
    localStorage.setItem('formsForms', JSON.stringify(forms));
    localStorage.setItem('formsResponses', JSON.stringify(responses));
}

// Authentication functions
function showSignup() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('signupSection').style.display = 'block';
}

function showLogin() {
    document.getElementById('signupSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
}

function signup() {
    var username = document.getElementById('newUsername').value;
    var password = document.getElementById('newPassword').value;
    
    if (!username || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Check if user already exists
    for (var i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            alert('Username already exists');
            return;
        }
    }
    
    // Create new user
    users.push({
        username: username,
        password: password
    });
    
    saveData();
    alert('Account created successfully! Please login.');
    showLogin();
    
    // Clear fields
    document.getElementById('newUsername').value = '';
    document.getElementById('newPassword').value = '';
}

function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Find user
    for (var i = 0; i < users.length; i++) {
        if (users[i].username === username && users[i].password === password) {
            currentUser = username;
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('userSection').style.display = 'block';
            document.getElementById('welcomeText').textContent = 'Welcome, ' + username;
            showDashboard();
            return;
        }
    }
    
    alert('Invalid username or password');
}

function logout() {
    currentUser = null;
    document.getElementById('userSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    hideAllSections();
}

// Navigation functions
function hideAllSections() {
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('formBuilder').style.display = 'none';
    document.getElementById('formResponse').style.display = 'none';
    document.getElementById('viewResponses').style.display = 'none';
}

function showDashboard() {
    hideAllSections();
    document.getElementById('dashboard').style.display = 'block';
    loadForms();
}

function showCreateForm() {
    hideAllSections();
    document.getElementById('formBuilder').style.display = 'block';
    currentForm = {
        id: Date.now(),
        title: '',
        questions: [],
        owner: currentUser,
        created: new Date().toISOString()
    };
    document.getElementById('formTitle').value = '';
    document.getElementById('questionsContainer').innerHTML = '';
}

// Form management functions
function loadForms() {
    var formsList = document.getElementById('formsList');
    formsList.innerHTML = '';
    
    var userForms = [];
    for (var i = 0; i < forms.length; i++) {
        if (forms[i].owner === currentUser) {
            userForms.push(forms[i]);
        }
    }
    
    if (userForms.length === 0) {
        formsList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No forms created yet. Click "Create New Form" to get started!</p>';
        return;
    }
    
    for (var i = 0; i < userForms.length; i++) {
        var form = userForms[i];
        var formCard = document.createElement('div');
        formCard.className = 'form-card';
        
        var responseCount = 0;
        for (var j = 0; j < responses.length; j++) {
            if (responses[j].formId === form.id) {
                responseCount++;
            }
        }
        
        formCard.innerHTML = 
            '<h3>' + (form.title || 'Untitled Form') + '</h3>' +
            '<p>Questions: ' + form.questions.length + '</p>' +
            '<p>Responses: ' + responseCount + '</p>' +
            '<div class="form-actions-card">' +
                '<button class="view-btn" onclick="viewForm(' + form.id + ')">View</button>' +
                '<button class="edit-btn" onclick="editForm(' + form.id + ')">Edit</button>' +
                '<button class="responses-btn" onclick="viewFormResponses(' + form.id + ')">Responses</button>' +
                '<button class="view-btn" onclick="shareForm(' + form.id + ')">Share</button>' +
                '<button class="delete-btn" onclick="deleteForm(' + form.id + ')">Delete</button>' +
            '</div>';
        
        formsList.appendChild(formCard);
    }
}

function saveForm() {
    var title = document.getElementById('formTitle').value;
    if (!title) {
        alert('Please enter a form title');
        return;
    }
    
    currentForm.title = title;
    
    // Get all questions
    var questionItems = document.querySelectorAll('.question-item');
    currentForm.questions = [];
    
    for (var i = 0; i < questionItems.length; i++) {
        var questionInput = questionItems[i].querySelector('.question-input');
        var questionType = questionItems[i].querySelector('.question-type');
        
        if (questionInput.value) {
            currentForm.questions.push({
                question: questionInput.value,
                type: questionType.value,
                required: true
            });
        }
    }
    
    if (currentForm.questions.length === 0) {
        alert('Please add at least one question');
        return;
    }
    
    // Check if editing existing form
    var existingFormIndex = -1;
    for (var i = 0; i < forms.length; i++) {
        if (forms[i].id === currentForm.id) {
            existingFormIndex = i;
            break;
        }
    }
    
    if (existingFormIndex !== -1) {
        forms[existingFormIndex] = currentForm;
    } else {
        forms.push(currentForm);
    }
    
    saveData();
    alert('Form saved successfully!');
    showDashboard();
}

function editForm(formId) {
    for (var i = 0; i < forms.length; i++) {
        if (forms[i].id === formId) {
            currentForm = forms[i];
            break;
        }
    }
    
    hideAllSections();
    document.getElementById('formBuilder').style.display = 'block';
    document.getElementById('formTitle').value = currentForm.title;
    
    var questionsContainer = document.getElementById('questionsContainer');
    questionsContainer.innerHTML = '';
    
    for (var i = 0; i < currentForm.questions.length; i++) {
        addQuestion(currentForm.questions[i]);
    }
}

function deleteForm(formId) {
    if (confirm('Are you sure you want to delete this form? This will also delete all responses.')) {
        // Remove form
        for (var i = forms.length - 1; i >= 0; i--) {
            if (forms[i].id === formId) {
                forms.splice(i, 1);
                break;
            }
        }
        
        // Remove responses
        for (var i = responses.length - 1; i >= 0; i--) {
            if (responses[i].formId === formId) {
                responses.splice(i, 1);
            }
        }
        
        saveData();
        loadForms();
    }
}

// Question management functions
function addQuestion(existingQuestion) {
    var questionsContainer = document.getElementById('questionsContainer');
    var questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    
    var questionText = existingQuestion ? existingQuestion.question : '';
    var questionType = existingQuestion ? existingQuestion.type : 'text';
    
    questionDiv.innerHTML = 
        '<div class="question-header">' +
            '<input type="text" class="question-input" placeholder="Enter your question" value="' + questionText + '">' +
            '<select class="question-type">' +
                '<option value="text"' + (questionType === 'text' ? ' selected' : '') + '>Short Answer</option>' +
                '<option value="textarea"' + (questionType === 'textarea' ? ' selected' : '') + '>Long Answer</option>' +
                '<option value="radio"' + (questionType === 'radio' ? ' selected' : '') + '>Multiple Choice</option>' +
                '<option value="checkbox"' + (questionType === 'checkbox' ? ' selected' : '') + '>Checkboxes</option>' +
                '<option value="select"' + (questionType === 'select' ? ' selected' : '') + '>Dropdown</option>' +
            '</select>' +
            '<button class="delete-question-btn" onclick="deleteQuestion(this)">Delete</button>' +
        '</div>';
    
    questionsContainer.appendChild(questionDiv);
}

function deleteQuestion(button) {
    var questionItem = button.closest('.question-item');
    questionItem.remove();
}

// Form viewing and response functions
function viewForm(formId) {
    for (var i = 0; i < forms.length; i++) {
        if (forms[i].id === formId) {
            currentForm = forms[i];
            break;
        }
    }
    
    hideAllSections();
    document.getElementById('formResponse').style.display = 'block';
    document.getElementById('responseFormTitle').textContent = currentForm.title;
    
    var responseForm = document.getElementById('responseForm');
    responseForm.innerHTML = '';
    
    for (var i = 0; i < currentForm.questions.length; i++) {
        var question = currentForm.questions[i];
        var questionDiv = document.createElement('div');
        questionDiv.className = 'response-question';
        
        var label = document.createElement('label');
        label.textContent = question.question;
        questionDiv.appendChild(label);
        
        var input;
        if (question.type === 'text') {
            input = document.createElement('input');
            input.type = 'text';
        } else if (question.type === 'textarea') {
            input = document.createElement('textarea');
        } else if (question.type === 'radio') {
            input = document.createElement('div');
            input.innerHTML = 
                '<label><input type="radio" name="q' + i + '" value="Option 1"> Option 1</label><br>' +
                '<label><input type="radio" name="q' + i + '" value="Option 2"> Option 2</label><br>' +
                '<label><input type="radio" name="q' + i + '" value="Option 3"> Option 3</label>';
        } else if (question.type === 'checkbox') {
            input = document.createElement('div');
            input.innerHTML = 
                '<label><input type="checkbox" name="q' + i + '" value="Option 1"> Option 1</label><br>' +
                '<label><input type="checkbox" name="q' + i + '" value="Option 2"> Option 2</label><br>' +
                '<label><input type="checkbox" name="q' + i + '" value="Option 3"> Option 3</label>';
        } else if (question.type === 'select') {
            input = document.createElement('select');
            input.innerHTML = 
                '<option value="">Choose an option</option>' +
                '<option value="Option 1">Option 1</option>' +
                '<option value="Option 2">Option 2</option>' +
                '<option value="Option 3">Option 3</option>';
        }
        
        input.setAttribute('data-question-index', i);
        questionDiv.appendChild(input);
        responseForm.appendChild(questionDiv);
    }
}

function submitResponse() {
    var responseForm = document.getElementById('responseForm');
    var questions = responseForm.querySelectorAll('.response-question');
    var answers = [];
    
    for (var i = 0; i < questions.length; i++) {
        var question = currentForm.questions[i];
        var answer = '';
        
        if (question.type === 'text' || question.type === 'textarea' || question.type === 'select') {
            var input = questions[i].querySelector('input, textarea, select');
            answer = input.value;
        } else if (question.type === 'radio') {
            var radioInputs = questions[i].querySelectorAll('input[type="radio"]');
            for (var j = 0; j < radioInputs.length; j++) {
                if (radioInputs[j].checked) {
                    answer = radioInputs[j].value;
                    break;
                }
            }
        } else if (question.type === 'checkbox') {
            var checkboxInputs = questions[i].querySelectorAll('input[type="checkbox"]');
            var checkedValues = [];
            for (var j = 0; j < checkboxInputs.length; j++) {
                if (checkboxInputs[j].checked) {
                    checkedValues.push(checkboxInputs[j].value);
                }
            }
            answer = checkedValues.join(', ');
        }
        
        answers.push({
            question: question.question,
            answer: answer
        });
    }
    
    // Save response
    responses.push({
        formId: currentForm.id,
        answers: answers,
        submitted: new Date().toISOString(),
        submittedBy: 'Anonymous'
    });
    
    saveData();
    alert('Response submitted successfully!');
    showDashboard();
}

function viewFormResponses(formId) {
    for (var i = 0; i < forms.length; i++) {
        if (forms[i].id === formId) {
            currentForm = forms[i];
            break;
        }
    }
    
    hideAllSections();
    document.getElementById('viewResponses').style.display = 'block';
    document.getElementById('responsesTitle').textContent = currentForm.title + ' - Responses';
    
    var responsesList = document.getElementById('responsesList');
    responsesList.innerHTML = '';
    
    var formResponses = [];
    for (var i = 0; i < responses.length; i++) {
        if (responses[i].formId === formId) {
            formResponses.push(responses[i]);
        }
    }
    
    if (formResponses.length === 0) {
        responsesList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No responses yet.</p>';
        return;
    }
    
    for (var i = 0; i < formResponses.length; i++) {
        var response = formResponses[i];
        var responseDiv = document.createElement('div');
        responseDiv.className = 'response-item';
        
        var metaDiv = document.createElement('div');
        metaDiv.className = 'response-meta';
        metaDiv.textContent = 'Submitted on ' + new Date(response.submitted).toLocaleString();
        responseDiv.appendChild(metaDiv);
        
        var answersDiv = document.createElement('div');
        answersDiv.className = 'response-answers';
        
        for (var j = 0; j < response.answers.length; j++) {
            var answer = response.answers[j];
            var answerDiv = document.createElement('div');
            answerDiv.className = 'response-answer';
            answerDiv.innerHTML = '<strong>' + answer.question + '</strong>' + (answer.answer || 'No answer');
            answersDiv.appendChild(answerDiv);
        }
        
        responseDiv.appendChild(answersDiv);
        responsesList.appendChild(responseDiv);
    }
}

// Share form function
function shareForm(formId) {
    var shareUrl = window.location.origin + window.location.pathname.replace('index.html', '') + 'share.html?id=' + formId;
    
    // Try to copy to clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).then(function() {
            alert('Share link copied to clipboard!\n\n' + shareUrl);
        }).catch(function() {
            prompt('Copy this link to share your form:', shareUrl);
        });
    } else {
        prompt('Copy this link to share your form:', shareUrl);
    }
}

// Initialize the app when page loads
window.onload = function() {
    loadData();
};
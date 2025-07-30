import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateForm from './pages/CreateForm';
import ViewForm from './pages/ViewForm';
import ViewResponses from './pages/ViewResponses';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateForm />} />
        <Route path="/form/:id/responses" element={<ViewResponses />} />
        <Route path="/form/:id" element={<ViewForm />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;

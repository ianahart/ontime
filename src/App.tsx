import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Footer from './components/Mixed/Footer';
import Dashboard from './pages/Dashboard';
import RequireAuth from './components/Mixed/RequireAuth';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/sign-up" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;

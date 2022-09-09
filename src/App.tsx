import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Footer from './components/Mixed/Footer';
import Dashboard from './pages/Dashboard';
import RequireAuth from './components/Mixed/RequireAuth';
import RequireGuest from './components/Mixed/RequireGuest';
import Settings from './pages/Settings';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/sign-up"
            element={
              <RequireGuest>
                <Register />
              </RequireGuest>
            }
          />
          <Route
            path="/"
            element={
              <RequireGuest>
                <Login />
              </RequireGuest>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <Settings />
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

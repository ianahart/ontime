import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Footer from './components/Mixed/Footer';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Mixed/Navbar';
import RequireAuth from './components/Mixed/RequireAuth';
import RequireGuest from './components/Mixed/RequireGuest';
import Settings from './pages/Settings';
import Bills from './components/Dashboard/Bills';
import Home from './components/Dashboard/Home';
import Notes from './components/Dashboard/Notes';
function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
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
          >
            <Route
              path="home"
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route
              path="notes"
              element={
                <RequireAuth>
                  <Notes />
                </RequireAuth>
              }
            />

            <Route
              path="bills"
              element={
                <RequireAuth>
                  <Bills />
                </RequireAuth>
              }
            />
          </Route>
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

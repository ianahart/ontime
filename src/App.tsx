import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Footer from './components/Mixed/Footer';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/sign-up" element={<Register />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;

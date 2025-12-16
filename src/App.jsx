import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './routes/PrivateRoute';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import CreateArticle from './components/CreateArticle';
import Profile from './components/Profile';
import Notifications from './components/Notification';

function App() {
  return (
    <Router>
      <div className="min-h-screen font-sans text-gray-900 overflow-x-hidden">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/create-article" element={<CreateArticle />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />
          </Route>

          {/* Redirect unknown to home or login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

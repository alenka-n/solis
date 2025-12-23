import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PlayerProvider } from './contexts/PlayerContext';
import Navbar from './components/Navbar';
import GlobalPlayer from './components/GlobalPlayer';
import AuthPage from './pages/AuthPage';
import MoodSelectionPage from './pages/MoodSelectionPage';
import MusicPlayerPage from './pages/MusicPlayerPage';
import DiaryPage from './pages/DiaryPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  return (
    <PlayerProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/mood" element={<MoodSelectionPage />} />
            <Route path="/music" element={<MusicPlayerPage />} />
            <Route path="/diary" element={<DiaryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
          <GlobalPlayer />
        </div>
      </Router>
    </PlayerProvider>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import EmergencyButton from './components/EmergencyButton';
import Home from './pages/Home';
import RescueGuide from './pages/RescueGuide';
import Articles from './pages/Articles';
import Classroom from './pages/Classroom';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/rescue" element={<RescueGuide />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/classroom" element={<Classroom />} />
            </Routes>
          </main>
          <EmergencyButton />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
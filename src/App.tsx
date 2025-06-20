import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import { CourseProvider } from './contexts/CourseContext';
import Navbar from './components/Navbar';
import EmergencyButton from './components/EmergencyButton';
import Home from './pages/Home';
import RescueGuide from './pages/RescueGuide';
import Articles from './pages/Articles';
import Classroom from './pages/Classroom';
import CourseDetail from './pages/CourseDetail';
import AdminPanel from './pages/AdminPanel';
import AuthModal from './components/AuthModal';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AdminProvider>
          <CourseProvider>
            <Router>
              <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/rescue" element={<RescueGuide />} />
                    <Route path="/articles" element={<Articles />} />
                    <Route path="/classroom" element={<Classroom />} />
                    <Route path="/course/:courseId" element={<CourseDetail />} />
                    <Route path="/admin-panel-secret-access" element={<AdminPanel />} />
                  </Routes>
                </main>
                <EmergencyButton />
                <AuthModal />
              </div>
            </Router>
          </CourseProvider>
        </AdminProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
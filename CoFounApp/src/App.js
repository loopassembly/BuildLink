import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import FounderDashboard from './pages/FounderDashboard';
import CreateIdea from './pages/CreateIdea';
import ViewApplications from './pages/ViewApplications';
import DeveloperDashboard from './pages/DeveloperDashboard';
import ApplyToIdea from './pages/ApplyToIdea';
import ProfilePage from './pages/ProfilePage';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/founder/dashboard" element={<FounderDashboard />} />
            <Route path="/founder/create-idea" element={<CreateIdea />} />
            <Route path="/founder/applications/:ideaId" element={<ViewApplications />} />
            <Route path="/developer/dashboard" element={<DeveloperDashboard />} />
            <Route path="/developer/apply/:ideaId" element={<ApplyToIdea />} />
            <Route path="/profile/:role" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
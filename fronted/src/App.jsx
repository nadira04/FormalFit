
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LatestCollections from './components/LatestCollections';
import Features from './components/Features';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';

function App() {
  const [authMode, setAuthMode] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem('token')
  );

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setShowDashboard(false);
    setAuthMode(null);
    showToast('Login successful');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setIsLoggedIn(false);
    setUser(null);
    setShowDashboard(false);

    showToast('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Navbar
        onLoginClick={() => setAuthMode('login')}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
        onDashboardClick={() => setShowDashboard(true)}
      />

      {showDashboard && isLoggedIn ? (
        <Dashboard
          user={user}
          onBack={() => setShowDashboard(false)}
        />
      ) : (
        <>
          <main>
            <Hero />
            <LatestCollections />
            <Features />
          </main>
          <Footer />
        </>
      )}

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSwitchMode={(newMode) => setAuthMode(newMode)}
          onSuccess={handleLoginSuccess}
          showToast={showToast}
        />
      )}

      {toast && (
        <div className={`toast-message ${toast.type}`}>
          <span>{toast.type === 'success' ? '✓' : '✕'}</span>
          <p>{toast.message}</p>
        </div>
      )}
    </div>
  );
}

export default App;

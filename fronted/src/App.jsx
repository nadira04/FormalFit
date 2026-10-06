import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LatestCollections from './components/LatestCollections';
import Features from './components/Features';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

function App() {
  const [authMode, setAuthMode] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem('token')
  );

  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem('user')) || null
  );

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setAuthMode(null);

    showToast('Login successful', 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setIsLoggedIn(false);
    setUser(null);

    showToast('Logged out successfully', 'success');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      <Navbar
        onLoginClick={() => setAuthMode('login')}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
      />

      <main>
        <Hero />
        <LatestCollections />
        <Features />
      </main>

      <Footer />

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
          <span>
            {toast.type === 'success' ? '✓' : '✕'}
          </span>

          <p>{toast.message}</p>
        </div>
      )}

    </div>
  );
}

export default App;

import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import LatestCollections from "./components/LatestCollections";
import Features from "./components/Features";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import Dashboard from "./components/Dashboard";
import Collection from "./components/Collection";
import About from "./components/About";
import Contact from "./components/Contact";

function App() {
  const [authMode, setAuthMode] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("token")
  );

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    setShowDashboard(false);

    if (page !== "collection") {
      setShowSearch(false);
      setSearchTerm("");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchClick = () => {
    setCurrentPage("collection");
    setShowDashboard(false);
    setShowSearch(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setShowDashboard(false);
    setAuthMode(null);
    localStorage.setItem("user", JSON.stringify(userData));
    showToast("Login successful");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setUser(null);
    setShowDashboard(false);
    setCurrentPage("home");

    showToast("Logged out successfully");
  };

  const renderPage = () => {
    if (showDashboard && isLoggedIn) {
      return (
        <Dashboard
          user={user}
          onBack={() => setShowDashboard(false)}
        />
      );
    }

    switch (currentPage) {
      case "collection":
        return (
          <Collection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            showSearch={showSearch}
            showToast={showToast}
          />
        );

      case "about":
        return <About />;

      case "contact":
        return <Contact showToast={showToast} />;

      default:
        return (
          <>
            <Hero />
            <LatestCollections />
            <Features />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Navbar
        onNavigate={navigateTo}
        currentPage={currentPage}
        onLoginClick={() => setAuthMode("login")}
        onSignupClick={() => setAuthMode("signup")}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
        onDashboardClick={() => {
          setShowDashboard(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onSearchClick={handleSearchClick}
        onCartClick={() => showToast("Cart feature is not implemented yet", "error")}
      />

      <main>{renderPage()}</main>

      {!showDashboard && <Footer />}

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
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          <p>{toast.message}</p>
        </div>
      )}
    </div>
  );
}

export default App;

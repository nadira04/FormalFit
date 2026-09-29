import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LatestCollections from './components/LatestCollections';
import Features from './components/Features';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Navbar />
      <main>
        <Hero />
        <LatestCollections />
        <Features />
      </main>
      <Footer />
    </div>
  );
}

export default App;
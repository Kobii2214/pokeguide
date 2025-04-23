import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Compare from './pages/compare';
import Pokemon from './pages/pokemon';
import Favorites from './pages/favorite';
import './App.css';

function Home() {
  const [showSearch, setShowSearch] = useState(false);

  const toggleSearch = (e) => {
    e.preventDefault();
    setShowSearch((prev) => !prev);
  };

  return (
    <>
      <Header/>
      <div className="main-content">
        <h1>Welcome to the PokéGuide</h1>
        <p>Your ultimate companion for all things Pokémon</p>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/pokemon" element={<Pokemon />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </Router>
  );
}

export default App;

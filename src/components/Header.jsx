import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header = ({ onSearchChange }) => {
  const location = useLocation();
  const isPokemonPage = location.pathname === "/pokemon";

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">PokéGuide</Link>
      </div>

      <div className="nav-center">
        <ul className="nav-list">
          <li><Link to="/compare">Battle</Link></li>
          <li><Link to="/pokemon">Pokemon</Link></li>
          <li><Link to="/favorites">Favorites</Link></li>
        </ul>
      </div>

      {isPokemonPage && (
        <input
          type="text"
          className="header-search"
          placeholder="Search Pokémon..."
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      )}
    </header>
  );
};

export default Header;

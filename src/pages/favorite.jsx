import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import "./favorite.css";

const Favorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch("http://localhost:3001/favorites");
        if (!response.ok) throw new Error("Failed to fetch favorites");
        const data = await response.json();
        setFavorites(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleUnfavorite = async (pokemonId) => {
    try {
      const response = await fetch(`http://localhost:3001/favorites/${pokemonId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete favorite");

      setFavorites((prev) => prev.filter((fav) => fav.id !== pokemonId));
    } catch (err) {
      console.error(err);
      alert("Something went wrong while removing this favorite.");
    }
  };


  return (
    <>
      <Header/>
      
      <div className="favorite-grid">
        {loading ? (
          <div className="loading-message">Loading favorites...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : favorites.length > 0 ? (
          favorites.map((pokemon) => (
            <div key={pokemon.id} className="pokemon-card">
              <div className="pokemon-card-inner">
                <div className="pokemon-card-front">
                  <img
                    src={pokemon.sprites.front_default}
                    alt={pokemon.name}
                    className="pokemon-image"
                  />
                  <h3>
                    {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                  </h3>
                  <button
                    onClick={() => handleUnfavorite(pokemon.id)}
                    className="unfavorite-button"
                  >
                    Remove from Favorites
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-favorites-found">No favorites yet!</div>
        )}
      </div>
    </>
  );
};

export default Favorite;

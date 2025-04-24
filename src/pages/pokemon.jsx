import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import "./pokemon.css";

import bugIcon from "../assets/icons/bug.png";
import darkIcon from "../assets/icons/dark.png";
import dragonIcon from "../assets/icons/dragon.png";
import electricIcon from "../assets/icons/electric.png";
import fairyIcon from "../assets/icons/fairy.png";
import fightingIcon from "../assets/icons/fighting.png";
import fireIcon from "../assets/icons/fire.png";
import flyingIcon from "../assets/icons/flying.png";
import ghostIcon from "../assets/icons/ghost.png";
import grassIcon from "../assets/icons/grass.png";
import groundIcon from "../assets/icons/ground.png";
import iceIcon from "../assets/icons/ice.png";
import normalIcon from "../assets/icons/normal.png";
import poisonIcon from "../assets/icons/poison.png";
import psychicIcon from "../assets/icons/psychic.png";
import rockIcon from "../assets/icons/rock.png";
import steelIcon from "../assets/icons/steel.png";
import waterIcon from "../assets/icons/water.png";

const getTypeIcon = (type) => {
  switch (type) {
    case "bug": return bugIcon;
    case "dark": return darkIcon;
    case "dragon": return dragonIcon;
    case "electric": return electricIcon;
    case "fairy": return fairyIcon;
    case "fighting": return fightingIcon;
    case "fire": return fireIcon;
    case "flying": return flyingIcon;
    case "ghost": return ghostIcon;
    case "grass": return grassIcon;
    case "ground": return groundIcon;
    case "ice": return iceIcon;
    case "normal": return normalIcon;
    case "poison": return poisonIcon;
    case "psychic": return psychicIcon;
    case "rock": return rockIcon;
    case "steel": return steelIcon;
    case "water": return waterIcon;
    default: return null;
  }
};

const Pokemon = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flippedCard, setFlippedCard] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [team, setTeam] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPokemon = async () => {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100");
      const data = await response.json();
      const details = await Promise.all(
        data.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          return await res.json();
        })
      );
      setPokemonList(details);
      setLoading(false);
    } catch (err) {
      setError("Failed to load Pokémon.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
    fetchFavorites();
    fetchTeam();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch("https://pokeguide.onrender.com/favorites");
      const data = await response.json();
      setFavorites(data);
    } catch (err) {
      console.error("Failed to fetch favorites", err);
    }
  };

  const fetchTeam = async () => {
    try {
      const response = await fetch("https://pokeguide.onrender.com/team");
      const data = await response.json();
      setTeam(data);
    } catch (err) {
      console.error("Failed to fetch team", err);
    }
  };

  const handleCardClick = (id) => {
    setFlippedCard((prev) => (prev === id ? null : id));
  };

  const handleFavoriteToggle = async (pokemon) => {
    const isFavorited = favorites.some((fav) => fav.pokeId === pokemon.id);

    if (isFavorited) {
      const favoriteToRemove = favorites.find((fav) => fav.pokeId === pokemon.id);

      try {
        const response = await fetch(`https://pokeguide.onrender.com/favorites/${favoriteToRemove.id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete favorite");

        setFavorites((prev) => prev.filter((fav) => fav.id !== favoriteToRemove.id));
      } catch (err) {
        console.error("Error removing favorite:", err);
        alert("Failed to remove from favorites.");
      }
    } else {
      const simplifiedPokemon = {
        pokeId: pokemon.id,
        name: pokemon.name,
        sprites: {
          front_default: pokemon.sprites.front_default,
        },
        types: pokemon.types,
        stats: pokemon.stats,
      };

      try {
        const response = await fetch("https://pokeguide.onrender.com/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(simplifiedPokemon),
        });

        if (!response.ok) throw new Error("Failed to add favorite");

        const data = await response.json();
        setFavorites((prev) => [...prev, data]);
      } catch (err) {
        console.error("Error adding favorite:", err);
        alert("Failed to add to favorites.");
      }
    }
  };

  const handleTeamToggle = async (pokemon) => {
    const isInTeam = team?.some((poke) => poke.pokeId === pokemon.id);
  
    if (isInTeam) {
      const teamToRemove = team.find((poke) => poke.pokeId === pokemon.id);
  
      try {
        const response = await fetch(`https://pokeguide.onrender.com/team/${teamToRemove.id}`, {
          method: "DELETE",
        });
  
        if (!response.ok) throw new Error("Failed to remove from team");
  
        setTeam((prev) => prev.filter((poke) => poke.id !== teamToRemove.id));
      } catch (err) {
        console.error("Error removing from team:", err);
        alert("Failed to remove from team.");
      }
    } else {
      if (team.length < 6) {
        const simplifiedPokemon = {
          pokeId: pokemon.id,
          name: pokemon.name,
          types: pokemon.types,
        };
  
        try {
          const response = await fetch("https://pokeguide.onrender.com/team", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(simplifiedPokemon),
          });
  
          if (!response.ok) throw new Error("Failed to add to team");
  
          const data = await response.json();
          setTeam((prev) => [...prev, data]);
        } catch (err) {
          console.error("Error adding to team:", err);
          alert("Failed to add to team.");
        }
      } else {
        alert("You can only have a maximum of 6 Pokémon in your team.");
      }
    }
  };

  const filteredPokemon = pokemonList.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header onSearchChange={setSearchQuery} />
      
      {loading && (
        <div className="loading-message">
          Loading
          <div className="dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      )}
      {error && <div className="error-message">{error}</div>}

      <div className="pokemon-grid">
        {filteredPokemon.length > 0 ? (
          filteredPokemon.map((pokemon) => {
            const isFavorited = favorites.some((fav) => fav.pokeId === pokemon.id);
            const isInTeam = team.some((poke) => poke.pokeId === pokemon.id);

            return (
              <div
                key={pokemon.id}
                className={`pokemon-card ${flippedCard === pokemon.id ? "flipped" : ""}`}
                onClick={() => handleCardClick(pokemon.id)}
              >
                <div className="pokemon-card-inner">
                  <div className="pokemon-card-front">
                    <img
                      src={pokemon.sprites.front_default}
                      alt={pokemon.name}
                      className="pokemon-image"
                    />
                    <h3>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
                    <div className="pokemon-types">
                      {pokemon.types.map((typeObj) => (
                        getTypeIcon(typeObj.type.name) && (
                          <div key={typeObj.type.name} className="pokemon-type-icon-container">
                            <img
                              src={getTypeIcon(typeObj.type.name)}
                              alt={typeObj.type.name}
                              className="pokemon-type-icon"
                            />
                            <span className="pokemon-type-label">
                              {typeObj.type.name}
                            </span>
                          </div>
                        )
                      ))}
                    </div>
                    <button
                      className={`team-btn ${isInTeam ? 'added' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTeamToggle(pokemon);
                      }}
                    >
                      {isInTeam ? '➖' : '➕'}
                    </button>

                    <button
                      className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavoriteToggle(pokemon);
                      }}
                    >
                      {isFavorited ? '💔' : '❤️'}
                    </button>
                  </div>

                  <div className="pokemon-card-back">
                    <h3>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} Stats</h3>
                    <div className="pokemon-stats">
                      {pokemon.stats.map((stat) => (
                        <div key={stat.stat.name} className="stat">
                          <span className="stat-name">{stat.stat.name}</span>
                          <span className="stat-value">{stat.base_stat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          !loading && <div className="no-pokemon-found">No Pokémon Found</div>
        )}
      </div>
    </>
  );
};

export default Pokemon;

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import "../App.css";
import "./compare.css";

function Compare() {
  const [showSearch, setShowSearch] = useState(false);
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemon1, setPokemon1] = useState(null);
  const [pokemon2, setPokemon2] = useState(null);
  const [winner, setWinner] = useState(null);
  const [battleResults, setBattleResults] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupSearch, setPopupSearch] = useState("");
  const [activeSlot, setActiveSlot] = useState(null);

  const toggleSearch = (e) => {
    e.preventDefault();
    setShowSearch((prev) => !prev);
  };

  useEffect(() => {
    fetchPokemonList();
  }, []);

  const fetchPokemonList = async () => {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100");
      const data = await response.json();
      setPokemonList(data.results);
    } catch (err) {
      console.error("Error fetching Pokémon:", err);
    }
  };

  const selectPokemon = async (id) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    if (activeSlot === 1) setPokemon1(data);
    if (activeSlot === 2) setPokemon2(data);
    setShowPopup(false);
    setPopupSearch("");
    setActiveSlot(null);
  };

  const deselectPokemon = (slot) => {
    if (slot === 1) setPokemon1(null);
    if (slot === 2) setPokemon2(null);
  };

  const battle = () => {
    if (!pokemon1 || !pokemon2) return;

    const stats1 = pokemon1.stats.reduce((acc, stat) => {
      acc[stat.stat.name] = stat.base_stat;
      return acc;
    }, {});

    const stats2 = pokemon2.stats.reduce((acc, stat) => {
      acc[stat.stat.name] = stat.base_stat;
      return acc;
    }, {});

    const results = {
      HP: stats1.hp > stats2.hp ? pokemon1.name : pokemon2.name,
      Attack: stats1.attack > stats2.attack ? pokemon1.name : pokemon2.name,
      Speed: stats1.speed > stats2.speed ? pokemon1.name : pokemon2.name,
    };

    const winCount = {
      [pokemon1.name]: 0,
      [pokemon2.name]: 0,
    };

    Object.values(results).forEach((winner) => {
      winCount[winner]++;
    });

    const battleWinner = winCount[pokemon1.name] >= 2 ? pokemon1.name : pokemon2.name;
    setBattleResults(results);
    setWinner(battleWinner);

    const now = new Date().toISOString();
    fetch("https://pokeguide.onrender.com/battles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pokemon1: pokemon1.name,
        pokemon2: pokemon2.name,
        winner: battleWinner,
        date: now,
      }),
   });
  };
  
  const MiniPokemonCard = ({ pokemon, onClick }) => {
    if (!pokemon) return null;

    return (
      <div className="mini-card" onClick={() => onClick?.(pokemon)}>
        <div className="mini-card-image">
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        </div>
        <div className="mini-card-name" title={pokemon.name}>
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </div>
      </div>
    );
  };

  const MiniPokemonCardLoader = ({ name, onClick }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
      const fetchPokemon = async () => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const json = await res.json();
        setData(json);
      };
      fetchPokemon();
    }, [name]);

    return data ? <MiniPokemonCard pokemon={data} onClick={() => onClick(name)} /> : null;
  };

  const filteredPokemonList = pokemonList.filter((p) =>
    p.name.toLowerCase().includes(popupSearch.toLowerCase())
  );

  return (
    <>
      <Header/>

      <div className="pokemon-selection">
        <div className="left-selection">
          <button
            onClick={() =>
              !battleResults && (pokemon1 ? deselectPokemon(1) : (setShowPopup(true), setActiveSlot(1)))
            }
            className="select-pokemon-button"
            disabled={!!battleResults}
          >
            {pokemon1 ? <img src={pokemon1.sprites.front_default} alt={pokemon1.name} /> : "+"}
          </button>
        </div>

        <div className="center-controls">
          <button className="start-battle-btn" onClick={battle}>Start Battle</button>
          {battleResults && (
            <button
              className="restart-battle-btn"
              onClick={() => {
                setPokemon1(null);
                setPokemon2(null);
                setWinner(null);
                setBattleResults(null);
              }}
            >
              Restart Battle
            </button>
          )}
        </div>

        <div className="right-selection">
          <button
            onClick={() =>
              !battleResults && (pokemon2 ? deselectPokemon(2) : (setShowPopup(true), setActiveSlot(2)))
            }
            className="select-pokemon-button"
            disabled={!!battleResults}
          >
            {pokemon2 ? <img src={pokemon2.sprites.front_default} alt={pokemon2.name} /> : "+"}
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <button className="close-popup" onClick={() => setShowPopup(false)}>X</button>
            <div className="popup-header">
              <h2>Select Pokémon</h2>
              <input
                type="text"
                className="popup-search-bar"
                placeholder="Search Pokémon..."
                value={popupSearch}
                onChange={(e) => setPopupSearch(e.target.value)}
              />
            </div>
            <div className="pokemon-cards">
              {filteredPokemonList.map((poke) => (
                <MiniPokemonCardLoader key={poke.name} name={poke.name} onClick={selectPokemon} />
              ))}
            </div>
          </div>
        </div>
      )}

      {battleResults && (
        <div className="battle-results-container">
          <div className="battle-results-header">Battle Results</div>

          <div className="battle-result-item">
            <span>HP Round: </span>
            <span className={battleResults.HP === pokemon1.name ? "winner" : "loser"}>
              {battleResults.HP}
            </span>
          </div>

          <div className="battle-result-item">
            <span>Attack Round: </span>
            <span className={battleResults.Attack === pokemon1.name ? "winner" : "loser"}>
              {battleResults.Attack}
            </span>
          </div>

          <div className="battle-result-item">
            <span>Speed Round: </span>
            <span className={battleResults.Speed === pokemon1.name ? "winner" : "loser"}>
              {battleResults.Speed}
            </span>
          </div>

          <div className="battle-result-item">
            <h2 className={winner === pokemon1.name ? "winner" : "loser"}>
              {`Winner: ${winner}`}
            </h2>
          </div>
        </div>
      )}
    </>
  );
}

export default Compare;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "./logo.png";

// Define a type for "player" objects
interface Player {
  name: string;
  wins: number;
  losses: number;
  pct: string;
  faction?: string;
}

// Define available factions with their corresponding colors
const factions = [
  { name: "Marquise de Cat", color: "orange" },
  { name: "Eyrie Dynasties", color: "royalblue" },
  { name: "Woodland Alliance", color: "#4CAF50" },
  { name: "Vagabond", color: "gray" },
];

export const Setup = () => {

  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  
  // Define player's state as an array of "player" objects
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]); // State to track selected players
  const [playerFactions, setPlayerFactions] = useState<{ [key: string]: string }>({}); // Track player factions

  // Load players from localStorage on component mount
  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem("players") || "[]");
    setPlayers(storedPlayers);
  }, []);

  // Function to add a new player to localStorage
  const addPlayer = () => {
    if (playerName.trim() !== "") {
      const updatedPlayers = [
        ...players,
        {
          name: playerName,
          wins: 0,
          losses: 0,
          pct: ".000",
        },
      ];

      // Save updated players list back to localStorage
      localStorage.setItem("players", JSON.stringify(updatedPlayers));

      // Update state
      setPlayers(updatedPlayers);
      setPlayerName("");
    }
  };

  // Function to delete a player from localStorage
  const deletePlayer = (name: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${name}?`);

    if (confirmDelete) {
      const updatedPlayers = players.filter((player) => player.name !== name);

      // Save updated players list back to localStorage
      localStorage.setItem("players", JSON.stringify(updatedPlayers));

      // Update state
      setPlayers(updatedPlayers);
    }
  };

  // Function to handle selecting/deselecting a player
  const togglePlayerSelection = (playerName: string) => {
  // Check if the player is already selected
  if (selectedPlayers.includes(playerName)) {
    // Deselect if already selected
    setSelectedPlayers((prev) => prev.filter((name) => name !== playerName));
  } else {
    // Allow selection only if less than four players are selected
    if (selectedPlayers.length < 4) {
      setSelectedPlayers((prev) => [...prev, playerName]);
    } else {
      alert("You can only select up to 4 players."); // Alert message if trying to select more than four players
    }
  }
  };


  // Handle setting a faction for a player
  const setFactionForPlayer = (playerName: string, faction: string) => {
    setPlayerFactions((prev) => ({ ...prev, [playerName]: faction }));
  };

   // Function to choose random factions for selected players
   const chooseRandomFactions = () => {
      const shuffledFactions = [...factions].sort(() => Math.random() - 0.5);
      const newPlayerFactions = { ...playerFactions };
      selectedPlayers.forEach((player, index) => {
        newPlayerFactions[player] = shuffledFactions[index % shuffledFactions.length].name;
      });
      setPlayerFactions(newPlayerFactions);
   };

  // Function to check if there are duplicate factions
  const hasDuplicateFactions = () => {
    const selectedFactions = selectedPlayers.map((player) => playerFactions[player]);
    const uniqueFactions = new Set(selectedFactions);
    return selectedFactions.length !== uniqueFactions.size;
  };


  return (
    <div className="App min-h-screen"  data-theme={darkMode ? "dark" : "light"}>

       {/*Light/Dark mode swap*/}
       <div className="absolute top-0 right-0 m-4">
          <label className="swap swap-rotate">
          {/* this hidden checkbox controls the state */}
          <input type="checkbox" checked={darkMode} onChange={ () => setDarkMode(!darkMode)} className="theme-controller" value="synthwave"/>

          {/* sun icon */}
          <svg
          className="swap-on h-8 w-8 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24">
          <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>

          {/* moon icon */}
          <svg
          className="swap-off h-8 w-8 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24">
          <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
          </label>
       </div>
 
      <br/><br/>
      
      {/* Navbar with Centered Logo */}
      <nav className="navbar bg-base-100 justify-center">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-12" />
        </Link>
      </nav>

      <h1 className="text-3xl font-bold mb-3 mt-3">Setup</h1>

      {/* Input field for adding a new player */}
      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Enter player name"
        className="input input-bordered mb-3 mr-2"
      />

      {/* Add Player Button */}
      <button className="btn btn-primary text-white mb-3" onClick={addPlayer}>
        Add Player
      </button>

      <br />
      <br />

      {/* List of Active Players */}
      <h2 className="text-2xl font-bold mb-2">Active Players:</h2>
      {players.length === 0 ? (
        <p>No players added yet.</p>
      ) : (
        <ul>
          {players.map((player, index) => (
            <li key={index} className="mb-2">
              {/* Checkbox to select player */}
              <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedPlayers.includes(player.name)}
                  onChange={() => togglePlayerSelection(player.name)}
                />
              <span className="text-lg mr-2">{player.name}</span>
              <button
                className="btn btn-outline btn-error btn-sm ml-2"
                onClick={() => deletePlayer(player.name)}
              >
                Delete
              </button>

              {/* Show faction choices if player is selected */}
              {selectedPlayers.includes(player.name) && (
                <div className="ml-6 mt-2">
                  <h4 className="text-lg">choose faction:</h4>
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2 pb-4">
                    {factions.map((faction) => (
                      <button
                        key={faction.name}
                        className={`btn btn-sm ${playerFactions[player.name] === faction.name ? "btn-secondary text-white font-bold" : "btn-outline hover:btn-accent hover:text-white"}`}
                        onClick={() => setFactionForPlayer(player.name, faction.name)}
                        style={{
                          color: playerFactions[player.name] === faction.name ? "white" : faction.color,
                          borderWidth: "2px",
                          minWidth: "100px",
                        }}
                        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.currentTarget.style.color = playerFactions[player.name] === faction.name ? "white" : faction.color;
                        }}
                      >
                        {faction.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </li>
          ))}
        </ul>
      )}

      {/* Choose Random Button */}
      {selectedPlayers.length > 0 && (
      <div className="flex justify-center my-5">
      <button
        className="btn btn-accent font-bold text-white"
        onClick={chooseRandomFactions}
      >
        Choose Random
      </button>
      </div>
      )}

      <div className="my-10"></div>

      {/* Start Playing Button */}
      <button
        className="btn btn-secondary font-bold"
        onClick={() => {
        // Pass selected players and their factions when navigating to the PlayGame page
            const selectedPlayersWithFactions = selectedPlayers.map((name) => ({
              name,
              faction: playerFactions[name],
            }));
            navigate("/play", { state: { selectedPlayers: selectedPlayersWithFactions } });
          }}
          disabled={selectedPlayers.some((name) => !playerFactions[name]) || hasDuplicateFactions()} // Disable until all players have factions or if there's duplicates
      >
        Play Game
      </button>

      <div className="my-10"></div>

      {/* Back to Home Button */}
      <button
        className="btn btn-info text-white mb-3 font-bold"
        onClick={() => navigate("/")}
      >
        Back to Home
      </button>
    </div>
  );
};

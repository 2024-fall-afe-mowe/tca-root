import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  // Define player's state as an array of "player" objects
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]); // State to track selected players
  const [playerFactions, setPlayerFactions] = useState<{ [key: string]: string }>({}); // Track player factions
  const navigate = useNavigate();

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
    setSelectedPlayers((prev) =>
      prev.includes(playerName)
        ? prev.filter((name) => name !== playerName) // Deselect if already selected
        : [...prev, playerName] // Select if not selected
    );
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

  return (
    <div>
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
                  <h4 className="text-lg">Choose Faction:</h4>
                  <div className="flex justify-center space-x-4 mt-2 pb-4">
                    {factions.map((faction) => (
                      <button
                        key={faction.name}
                        className={`btn btn-sm ${playerFactions[player.name] === faction.name ? "btn-secondary text-white font-bold" : "btn-outline hover:btn-accent hover:text-white"}`}
                        onClick={() => setFactionForPlayer(player.name, faction.name)}
                        style={{
                          color: playerFactions[player.name] === faction.name ? "white" : faction.color,
                          borderWidth: "2px",
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
        // Pass selected players and their factions when navigating to the play game page
            const selectedPlayersWithFactions = selectedPlayers.map((name) => ({
              name,
              faction: playerFactions[name],
            }));
            navigate("/play", { state: { selectedPlayers: selectedPlayersWithFactions } });
          }}
          disabled={selectedPlayers.some((name) => !playerFactions[name])} // Disable until all players have factions
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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Define a type for "player" objects
interface Player {
  name: string;
  wins: number;
  losses: number;
  pct: string;
}

export const Setup = () => {
  // Define player's state as an array of "player" objects
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]); // State to track selected players
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
            </li>
          ))}
        </ul>
      )}

      <div className="my-10"></div>

      {/* Start Playing Button */}
      <button
        className="btn btn-secondary font-bold"
        onClick={() => {
          // Pass selected players when navigating to the play game page
          navigate("/play", { state: { selectedPlayers } });
        }}
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

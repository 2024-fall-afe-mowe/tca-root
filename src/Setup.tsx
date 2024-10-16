import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Setup = () => {
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  // Function to add a new player to localStorage
  const addPlayer = () => {
    if (playerName.trim() !== "") {
      const players = JSON.parse(localStorage.getItem("players") || "[]");

      // Add new player with default stats
      players.push({
        name: playerName,
        wins: 0,
        losses: 0,
        pct: ".000",
      });

      // Save updated players list back to localStorage
      localStorage.setItem("players", JSON.stringify(players));

      // Clear input field
      setPlayerName("");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-3">Setup</h1>

      {/* Input field for adding a new player */}
      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Enter player name"
        className="input input-bordered mb-3 mr-2"
      />

      {/* Add Player Button */}
      <button className="btn btn-primary text-white font-bold mb-3" onClick={addPlayer}>
        Add Player
      </button>
  
      <br />

      {/* Start Playing Button */}
      <button className="btn btn-secondary font-bold" onClick={() => navigate("/play")}>
        Play Game
      </button>

      <div className="my-10"></div>

      {/* Back to Home Button */}
      <button className="btn btn-info text-white mb-3 font-bold" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
};

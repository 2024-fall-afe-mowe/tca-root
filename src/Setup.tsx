import { useState, FC } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "./logo.png";

interface Player {
  name: string;
  checked: boolean;
  faction?: string;
}

const factions = [
  { name: "Marquise de Cat", color: "orange" },
  { name: "Eyrie Dynasties", color: "royalblue" },
  { name: "Woodland Alliance", color: "#4CAF50" },
  { name: "Vagabond", color: "gray" },
];

interface SetupProps {
  previousPlayers: string[];
  setCurrentPlayers: (players: string[]) => void;
}

export const Setup: FC<SetupProps> = ({
  previousPlayers,
  setCurrentPlayers,
}) => {
  const navigate = useNavigate();

  const [availablePlayers, setAvailablePlayers] = useState<Player[]>(
    previousPlayers.map((name) => ({ name, checked: false }))
  );
  const [playerName, setPlayerName] = useState("");

  const addPlayer = () => {
    if (playerName.trim()) {
      setAvailablePlayers((prev) => [
        ...prev,
        { name: playerName, checked: false },
      ]);
      setPlayerName("");
    }
  };

  const deletePlayer = (name: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${name}?`);
    if (confirmDelete) {
      setAvailablePlayers((prev) => prev.filter((player) => player.name !== name));
    }
  };

  const togglePlayerSelection = (name: string) => {
    setAvailablePlayers((prev) =>
      prev.map((player) =>
        player.name === name
          ? { ...player, checked: !player.checked }
          : player
      )
    );
  };

  const setFactionForPlayer = (name: string, faction: string) => {
    setAvailablePlayers((prev) =>
      prev.map((player) =>
        player.name === name ? { ...player, faction } : player
      )
    );
  };

  const chooseRandomFactions = () => {
    const shuffledFactions = [...factions].sort(() => Math.random() - 0.5);
    const selectedPlayers = availablePlayers.filter((p) => p.checked);

    setAvailablePlayers((prev) =>
      prev.map((player, index) =>
        player.checked
          ? { ...player, faction: shuffledFactions[index % shuffledFactions.length].name }
          : player
      )
    );
  };

  const hasDuplicateFactions = () => {
    const selectedFactions = availablePlayers
      .filter((p) => p.checked)
      .map((p) => p.faction);
    return new Set(selectedFactions).size !== selectedFactions.length;
  };

  return (
   <div>

   <br/><br/>

      <nav className="navbar bg-base-100 justify-center">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-12" />
        </Link>
      </nav>

      <h1 className="text-3xl font-bold mb-3 mt-3 luminari-font">Setup</h1>

      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Enter player name"
        className="input input-bordered mb-3 mr-2"
      />
      <button className="btn btn-primary text-white mb-3 font-bold" onClick={addPlayer}>
        Add Player
      </button>

      <div className="my-7"></div>

      <h2 className="text-2xl font-bold mb-2 text-center luminari-font">Active Players:</h2>
      <div className="flex flex-col items-center">
        {availablePlayers.map((player) => (
          <div key={player.name} className="form-control w-full max-w-md">
            <div
              className={`flex items-center justify-center ${
                player.checked ? "flex-col" : "flex-row"
              } mt-3`}
            >
              <label className="flex items-center justify-center baskerville">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={player.checked}
                  onChange={() => togglePlayerSelection(player.name)}
                />
                <span className="label-text ml-3 text-2xl text-center">{player.name}</span>
              </label>
              <button
                className={`btn btn-outline btn-error btn-sm ${player.checked ? "mt-2" : "ml-2"}`}
                onClick={() => deletePlayer(player.name)}
              >
                Delete
              </button>
            </div>

            {player.checked && (
              <div className="mt-2 text-center">
                <h4 className="text-lg">selected faction:</h4>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2 pb-4">
                  {factions.map((faction) => (
                    <button
                      key={faction.name}
                      className={`btn btn-sm text-lg baskerville ${
                        player.faction === faction.name
                          ? "btn-secondary text-white font-bold"
                          : "btn-outline hover:btn-accent hover:text-white"
                      }`}
                      onClick={() => setFactionForPlayer(player.name, faction.name)}
                      style={{
                        color: player.faction === faction.name ? "white" : faction.color,
                        borderWidth: "2px",
                        minWidth: "200px",
                      }}
                    >
                      {faction.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>


      {availablePlayers.some((p) => p.checked) && (
        <div className="flex justify-center my-5">
          <button className="btn btn-accent font-bold text-white" onClick={chooseRandomFactions}>
            Choose Random
          </button>
        </div>
      )}

    <div className="my-10"></div>



      <button
        className="btn btn-secondary font-bold"
        onClick={() => {
          const selectedPlayers = availablePlayers
            .filter((p) => p.checked)
            .map(({ name, faction }) => ({ name, faction }));
          setCurrentPlayers(selectedPlayers.map((p) => p.name));
          navigate("/play", { state: { selectedPlayers } });
        }}
        disabled={availablePlayers.some((p) => p.checked && !p.faction) || hasDuplicateFactions()}
      >
        Play Game
      </button>

      <div className="my-10"></div>

      <button className="btn btn-info text-white mb-3 font-bold" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
};

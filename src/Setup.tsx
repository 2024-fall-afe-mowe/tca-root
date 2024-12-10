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
  const [darkMode, setDarkMode] = useState(false);

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

      <nav className="navbar bg-base-100 justify-center">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-12" />
        </Link>
      </nav>

      <h1 className="text-3xl font-bold mb-3 mt-3">Setup</h1>

      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Enter player name"
        className="input input-bordered mb-3 mr-2"
      />
      <button className="btn btn-primary text-white mb-3" onClick={addPlayer}>
        Add Player
      </button>

      <div className="my-7"></div>

      <h2 className="text-2xl font-bold mb-2 text-center">Active Players:</h2>
      <div className="flex flex-col items-center">
        {availablePlayers.map((player) => (
          <div key={player.name} className="form-control w-full max-w-md">
            <div
              className={`flex items-center justify-center ${
                player.checked ? "flex-col" : "flex-row"
              } mt-3`}
            >
              <label className="flex items-center justify-center">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={player.checked}
                  onChange={() => togglePlayerSelection(player.name)}
                />
                <span className="label-text ml-3 text-lg text-center">{player.name}</span>
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
                <h4 className="text-lg">Choose Faction:</h4>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2 pb-4">
                  {factions.map((faction) => (
                    <button
                      key={faction.name}
                      className={`btn btn-sm ${
                        player.faction === faction.name
                          ? "btn-secondary text-white font-bold"
                          : "btn-outline hover:btn-accent hover:text-white"
                      }`}
                      onClick={() => setFactionForPlayer(player.name, faction.name)}
                      style={{
                        color: player.faction === faction.name ? "white" : faction.color,
                        borderWidth: "2px",
                        minWidth: "100px",
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

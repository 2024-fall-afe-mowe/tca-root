import { FC, useState } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "./logo.png";
import { GameResult } from './game-results';

interface PlayGameProps {
  currentPlayers: string[];
  addNewGameResult: (gr: GameResult) => void;
}

export const PlayGame: FC<PlayGameProps> = ({
  currentPlayers
  , addNewGameResult
}) => {

    const [startTimeState] = useState(new Date().toISOString());

    const [winner, setWinner] = useState<string | null>(null); 

    const nav = useNavigate();

    // States to store the initial dice rolls and final hits
    const [initialDice1, setInitialDice1] = useState(0); // store initial dice roll for attacker
    const [initialDice2, setInitialDice2] = useState(0); // store initial dice rool for defender
    const [attacker, setAttacker] = useState(''); // store faction selection values
    const [defender, setDefender] = useState(''); // store faction selection values
    const [attackerHits, setAttackerHits] = useState<null | number>(null); // Store hits for attacker
    const [defenderHits, setDefenderHits] = useState<null | number>(null); // Store hits for defender

    // States for tracking victory points for each faction
    const [marquisePoints, setMarquisePoints] = useState(0);
    const [eyriePoints, setEyriePoints] = useState(0);
    const [woodlandPoints, setWoodlandPoints] = useState(0);
    const [vagabondPoints, setVagabondPoints] = useState(0);
    const [actionsCounter, setActionsCounter] = useState(0);

    // Function to handle increment and decrement of victory points for each faction
    const incrementPoints = (setPoints: React.Dispatch<React.SetStateAction<number>>, points: number) =>
      setPoints(points + 1);
    const decrementPoints = (setPoints: React.Dispatch<React.SetStateAction<number>>, points: number) =>  // Ensure points do not go below zero
      setPoints(points > 0 ? points - 1 : 0);

    // Function to generate random numbers between 0 and 3 for each dice
    const rollDice = () => {
      let newDice1 = Math.floor(Math.random() * 4); // Random number between 0 and 3
      let newDice2 = Math.floor(Math.random() * 4); // Random number between 0 and 3

      // Save initial rolls before any swapping
      setInitialDice1(newDice1);
      setInitialDice2(newDice2);

      // Check if the defender is Woodland Alliance; if so, they get the higher roll
      if (defender === 'Woodland Alliance') {
        if (newDice1 > newDice2) {
          [newDice1, newDice2] = [newDice2, newDice1]; // Swap so Woodland Alliance (defender) gets higher roll
        }
        } else {
          // Otherwise, ensure the attacker gets the higher roll
          if (newDice2 > newDice1) {
            [newDice1, newDice2] = [newDice2, newDice1]; // Swap dice values so attacker gets higher roll
          }
        }

        // Set the number of hits for each faction
        setAttackerHits(newDice1); // Attacker gets the higher roll
        setDefenderHits(newDice2); // Defender gets the lower roll
    };


    // Function to get the color based on the faction name
    const getFactionColor = (faction: string): string => {
      switch (faction) {
        case 'Marquise de Cat':
          return 'orange';
        case 'Eyrie Dynasties':
          return 'royalblue';
        case 'Woodland Alliance':
          return '#4CAF50'; 
        case 'Vagabond':
          return 'gray';
        default:
          return 'black'; // Default color if no faction is selected
      }
    };

  type Player = {
    name: string;
    faction: string;
  };
  
  {/*Code added to track winner in Game Over section*/}
  const location = useLocation();
  const { selectedPlayers }: { selectedPlayers: Player[] } = location.state || { selectedPlayers: [] };
  
  // Faction colors mapping
  const factionColors: { [key: string]: string } = {
    "Marquise de Cat": "orange",
    "Eyrie Dynasties": "royalblue",
    "Woodland Alliance": "#4CAF50",
    "Vagabond": "gray",
  };

  {/*Function to retrieve VP for the winner based on faction */}
  const getWinnerVP = (winnerFaction: string): number => {
    switch (winnerFaction) {
      case "Marquise de Cat":
        return marquisePoints;
      case "Eyrie Dynasties":
        return eyriePoints;
      case "Woodland Alliance":
        return woodlandPoints;
      case "Vagabond":
        return vagabondPoints;
      default:
        return 0; // Default to 0 if faction is unrecognized
    }
  };

  return (

    <div>
      
      <br/>
      <br/>

      {/* Navbar with Centered Logo */}
      <nav className="navbar bg-base-100 justify-center">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-12" />
        </Link>
      </nav>

      <h1 className="text-3xl font-bold mb-3 mt-3 luminari-font">Play Game</h1>

          {/* Dice Roller Simulator */}
          <div className="card bg-base-100 shadow-xl card-bordered my-6 p-3 overflow-hidden">
            <div className="card-body">
              <h2 className="text-2xl font-bold text-center luminari-font">Battle Roller</h2>

                {/* Attacker and Defender Labels */}
                <div className="dice-label-container">
                  <div className="dice-label-left">
                    <p className="label text-2xl baskerville">Attacker</p>
                  </div>
                  <div className="dice-label-right">
                    <p className="label text-2xl baskerville">Defender</p>
                  </div>
                </div>

                {/* Dice Display: initial rolls */}
                <div className="dice-container">
                  <div className="dice">
                    <p className="dice-value">{initialDice1}</p> {/* Show initial roll for dice1 */}
                  </div>
                  <div className="dice">
                    <p className="dice-value">{initialDice2}</p> {/* Show initial roll for dice2 */}
                  </div>
                </div>

                {/* Faction Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                    <div>
                      <label htmlFor="attacker" className="block font-medium mb-1 baskerville">Select Attacker Faction:</label>
                      <select
                        id="attacker"
                        value={attacker}
                        onChange={(e) => setAttacker(e.target.value)}
                        className="select select-bordered w-fit baskerville"
                      >
                        <option value="">-- Select Faction --</option>
                        <option value="Marquise de Cat">Marquise de Cat</option>
                        <option value="Eyrie Dynasties">Eyrie Dynasties</option>
                        <option value="Woodland Alliance">Woodland Alliance</option>
                        <option value="Vagabond">Vagabond</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="defender" className="block font-medium mb-1 baskerville">Select Defender Faction:</label>
                      <select
                        id="defender"
                        value={defender}
                        onChange={(e) => setDefender(e.target.value)}
                        className="select select-bordered w-fit baskerville"
                      >
                        <option value="">-- Select Faction --</option>
                        <option value="Marquise de Cat">Marquise de Cat</option>
                        <option value="Eyrie Dynasties">Eyrie Dynasties</option>
                        <option value="Woodland Alliance">Woodland Alliance</option>
                        <option value="Vagabond">Vagabond</option>
                      </select>
                    </div>
                </div>

                {/* Display the number of hits */}
                <div className="hits-display text-center text-xl mb-4">
                  {attackerHits !== null && defenderHits !== null && (
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                      <span>
                        <strong>
                          <span style={{ color: getFactionColor(attacker) }}>{attacker}</span>
                        </strong>{" "}
                        gets <strong>{attackerHits}</strong> hits
                      </span>
                      <span>
                        <strong>
                          <span style={{ color: getFactionColor(defender) }}>{defender}</span>
                        </strong>{" "}
                        gets <strong>{defenderHits}</strong> hits
                      </span>
                    </div>
                  )}
                </div>

                {/* Roll Dice Button */}
                <div className="text-center">
                  <button
                    className="btn btn-primary text-white font-bold w-full md:w-auto"
                    onClick={rollDice}
                  >
                    Roll Dice
                  </button>
                </div>

             </div>
          </div>

      {/* Resettable actions taken counter */}
      <div className="card bg-base-100 shadow-xl flex justify-center my-6 p-3">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold mb-4 luminari-font">Actions Taken</h2>

          <div className="flex items-center justify-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <button
                className="btn btn-circle text-white text-3xl"
                style={{ backgroundColor: '#ff7f7f' }}
                onClick={() => decrementPoints(setActionsCounter, actionsCounter)}
              >
                -
              </button>
              <span className="text-2xl font-bold">{actionsCounter}</span>
              <button
                className="btn btn-circle text-white text-2xl"
                style={{ backgroundColor: '#90ee90' }}
                onClick={() => incrementPoints(setActionsCounter, actionsCounter)}
              >
                +
              </button>
            </div>
          </div>

            {/* Reset button */}
            <div className="flex justify-center mt-4">
                <button className="btn btn-primary text-white w-full md:w-auto" 
                        onClick={() => setActionsCounter(0)}>
                  Reset
                </button>
            </div>

        </div>
      </div>


      {/* Total Victory Points and counter for every faction */}
      <div className="card bg-base-100 shadow-xl flex justify-center my-6 p-3">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold mb-4 luminari-font">Total Victory Points</h2>

          {/* Marquise VP */}
          <div className="flex items-center justify-center space-x-4 mt-2">
            <h2 className="text-2xl font-bold baskerville" style={{ color: 'orange' }}>Marquise de Cat</h2>
            <div className="flex items-center space-x-2">
            <button
              className="btn btn-circle text-white text-3xl"
              style={{ backgroundColor: '#ff7f7f' }}
              onClick={() => decrementPoints(setMarquisePoints, marquisePoints)}
            >
              -
            </button>
            <span className="text-2xl font-bold">{marquisePoints}</span>
            <button
              className="btn btn-circle text-white text-2xl"
              style={{ backgroundColor: '#90ee90' }}
              onClick={() => incrementPoints(setMarquisePoints, marquisePoints)}
            >
              +
            </button>
          </div>
          </div>

          {/* Eyrie VP */}
          <div className="flex items-center justify-center space-x-4 mt-2">
            <h2 className="text-2xl font-bold baskerville" style={{ color: 'royalblue' }}>Eyrie Dynasty</h2>
            <div className="flex items-center space-x-2">
            <button
              className="btn btn-circle text-white text-3xl ml-3"
              style={{ backgroundColor: '#ff7f7f' }}
              onClick={() => decrementPoints(setEyriePoints, eyriePoints)}
            >
              -
            </button>
            <span className="text-2xl font-bold">{eyriePoints}</span>
            <button
              className="btn btn-circle text-white text-2xl"
              style={{ backgroundColor: '#90ee90' }}
              onClick={() => incrementPoints(setEyriePoints, eyriePoints)}
            >
              +
            </button>
          </div>
          </div>

          {/* Woodland Alliance VP */}
          <div className="flex items-center justify-center space-x-4 mt-2">
            <h2 className="text-2xl font-bold baskerville" style={{ color: '#4CAF50' }}>&nbsp;&nbsp;Woodland Alliance</h2>
            <div className="flex items-center space-x-2">
            <button
              className="btn btn-circle text-white text-3xl"
              style={{ backgroundColor: '#ff7f7f' }}
              onClick={() => decrementPoints(setWoodlandPoints, woodlandPoints)}
            >
              -
            </button>
            <span className="text-2xl font-bold">{woodlandPoints}</span>
            <button
              className="btn btn-circle text-white text-2xl"
              style={{ backgroundColor: '#90ee90' }}
              onClick={() => incrementPoints(setWoodlandPoints, woodlandPoints)}
            >
              +
            </button>
          </div>
          </div>

          {/* Vagabond VP */}
          <div className="flex items-center justify-center space-x-4 mt-2">
            <h2 className="text-2xl font-bold baskerville" style={{ color: 'gray' }}>&nbsp;&nbsp;Vagabond</h2>
            <div className="flex items-center space-x-2">
            <button
              className="btn btn-circle text-white text-3xl"
              style={{ backgroundColor: '#ff7f7f' }}
              onClick={() => decrementPoints(setVagabondPoints, vagabondPoints)}
            >
              -
            </button>
            <span className="text-2xl font-bold">{vagabondPoints}</span>
            <button
              className="btn btn-circle text-white text-2xl"
              style={{ backgroundColor: '#90ee90' }}
              onClick={() => incrementPoints(setVagabondPoints, vagabondPoints)}
            >
              +
            </button>
          </div>
        </div>
      </div>
      </div>

      <div className="card bg-base-100 shadow-xl my-6 p-3">
                <div className="card-body">
                    <h2 className="text-center text-2xl font-bold mb-2 luminari-font">End Game</h2>
                    <div className="flex flex-col items-center space-y-3">
                        {selectedPlayers.map((player1) => {
                            const player1Data = selectedPlayers.find((p) => p.name === player1.name);

                            // Buttons for single winners
                            return (
                                <button
                                    key={player1.name}
                                    className="btn text-lg font-bold min-h-[5rem] pb-2 md:pb-1 lg:pb-0"
                                    style={{
                                        backgroundColor: "white",
                                        color: player1Data ? factionColors[player1Data.faction] : "black",
                                        borderColor: player1Data ? factionColors[player1Data.faction] : "black",
                                    }}
                                    onClick={() => {
                                        if (player1Data) {
                                            setWinner(player1Data.name);
                                        }
                                        addNewGameResult({
                                            startTime: startTimeState,
                                            endTime: new Date().toISOString(),
                                            winner: player1.name,
                                            players: currentPlayers,
                                            faction: player1Data?.faction || "Unknown",
                                            victoryPoints: player1Data ? getWinnerVP(player1Data.faction) : 0,
                                        });
                                        nav(-2);
                                    }}
                                >
                                    <span className="text-xl baskerville">{player1.name} won</span>
                                    {player1Data && (
                                        <span
                                            className="ml-2 text-xl baskerville"
                                            style={{
                                                color: factionColors[player1Data.faction],
                                                border: `2px solid ${factionColors[player1Data.faction]}`,
                                                padding: "2px 5px",
                                                borderRadius: "5px",
                                            }}
                                        >
                                            {player1Data.faction}
                                        </span>
                                    )}
                                </button>
                            );
                        })}

      {/* Buttons for shared wins if Vagabond is selected */}
      {selectedPlayers.map((player1) => {
          const player1Data = selectedPlayers.find((p) => p.name === player1.name);

          return selectedPlayers.map((player2) => {
              if (player1.name !== player2.name && player1Data?.faction === "Vagabond") {
                  const player2Data = selectedPlayers.find((p) => p.name === player2.name); // Find player2's data here

                  return (
                      <button
                          key={`${player1.name}-${player2.name}`}
                          className="btn text-lg font-bold min-h-[5rem] pb-2 md:pb-1 lg:pb-0"
                          style={{
                              backgroundColor: "white", // Soft light purple background
                              color: "#5e5e9a", // Soft purple text color
                              borderColor: "#5e5e9a", // Soft purple border
                          }}
                          onClick={() => {
                              // Set the joint winner text
                              setWinner(`${player1.name} and ${player2.name}`);
                              
                              // Add game result with both players as winners
                              addNewGameResult({
                                  startTime: startTimeState,
                                  endTime: new Date().toISOString(),
                                  winner: `${player1.name} and ${player2.name}`, // Joint winners
                                  players: currentPlayers,
                                  faction: player1Data?.faction || "Unknown",
                                  victoryPoints: getWinnerVP(player1Data.faction),
                              });

                              // Log the game result for player1
                              if (player1Data) {
                                  addNewGameResult({
                                      startTime: startTimeState,
                                      endTime: new Date().toISOString(),
                                      winner: player1.name,
                                      players: currentPlayers,
                                      faction: player1Data?.faction || "Unknown",
                                      victoryPoints: getWinnerVP(player1Data.faction),
                                  });
                              }

                              // Log the game result for player2 (only if player2Data is valid)
                              if (player2Data) {
                                  addNewGameResult({
                                      startTime: startTimeState,
                                      endTime: new Date().toISOString(),
                                      winner: player2.name,
                                      players: currentPlayers,
                                      faction: player2Data?.faction || "Unknown",
                                      victoryPoints: getWinnerVP(player2Data.faction),
                                  });
                              }

                              nav(-2); // Navigate after the result is saved
                          }}
                      >
                          <span className="text-xl baskerville">
                              {player1.name}
                              <span
                                  className="ml-2 px-2 py-1 rounded-full border"
                                  style={{
                                      color: "#5e5e9a", // Soft purple color for player1's faction
                                      border: "2px solid #5e5e9a", // Soft purple border
                                      padding: "2px 5px",
                                      borderRadius: "5px",
                                  }}
                              >
                                  {player1Data?.faction}
                              </span>
                          </span>
                          <span className="text-xl baskerville">
                              and {player2.name}
                              <span
                                  className="ml-2 px-2 py-1 rounded-full border"
                                  style={{
                                      color: "#5e5e9a", // Soft purple color for player2's faction
                                      border: "2px solid #5e5e9a", // Soft purple border
                                      padding: "2px 5px",
                                      borderRadius: "5px",
                                  }}
                              >
                                  {player2Data?.faction || "Unknown"} {/* Default to "Unknown" if faction is undefined */}
                              </span>
                              <span className="ml-2">both won</span>
                          </span>
                      </button>
                  );
              }
              return null;
          });
      })}
              </div>
          </div>
      </div>


      {/* Back to Home Button */}
      <button className="btn btn-info text-white mb-3 font-bold" onClick={() => nav("/")}>
        Back to Home
      </button>
      <br/>
    </div>
  );
};

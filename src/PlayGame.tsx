import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import logo from "./logo.png";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { GameResult } from './game-results';


export const PlayGame = () => {
    const [winner, setWinner] = useState<string | null>(null); // For tracking the winner (temporary)

    const nav = useNavigate();
    const [darkMode, setDarkMode] = useState(false);

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

 // Define types
type Player = {
  name: string;
  faction: string;
  wins: number;
  losses: number;
  pct: string;
};

type GameResult = {
  players: { name: string; faction: string; result: "Win" | "Loss" }[];
  winner: string;
  winningFaction: string;
  losingFaction: string;
  startTime: string;
  endTime: string;
  date: string;
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

  // Function to send the winner's data to backend
  const recordWin = async (winnerName: string) => {
    try {
      const response = await axios.post('https://32wop75hhc.execute-api.us-east-1.amazonaws.com/prod/data/record-win', {
        playerName: winnerName,
      });
      console.log('Win recorded successfully:', response.data);
    } catch (error) {
      console.error('Error recording win:', error);
    }
  };

  const calculateWinPercentage = (wins: number, losses: number): string => {
    const totalGames = wins + losses;
    return totalGames === 0 ? ".000" : (wins / totalGames).toFixed(3);
  };
  

  const endGame = async () => {
    const timestamp = new Date().toISOString();
  
    // Construct game result object
    const gameResult: GameResult = {
      players: selectedPlayers.map((player) => ({
        name: player.name,
        faction: player.faction,
        result: player.name === winner ? "Win" : "Loss",
      })),
      winner: winner || "No Winner", // Default to "No Winner" if `winner` is null
      winningFaction: winner
        ? selectedPlayers.find((player) => player.name === winner)?.faction || "Unknown"
        : "No Winner",
      losingFaction: winner
        ? selectedPlayers
            .filter((player) => player.name !== winner)
            .map((player) => player.faction)
            .join(", ") || "Unknown"
        : "No Loser",
      startTime: "2024-01-01T00:00:00Z", // Replace with actual start time if available
      endTime: timestamp, // Use the current time as the end time
      date: timestamp, // Optional, already included
    };
  
    try {
      // Save to backend (if necessary)
      // await saveGameToCloud(email, "YourGameApp", timestamp, gameResult);
  
      // Update local leaderboard stats
      const updatedPlayers = selectedPlayers.map((player) => {
        if (player.name === winner) {
          return { ...player, wins: player.wins + 1, pct: calculateWinPercentage(player.wins + 1, player.losses) };
        }
        return { ...player, losses: player.losses + 1, pct: calculateWinPercentage(player.wins, player.losses + 1) };
      });
  
      console.log("Updated players: ", updatedPlayers);
      setWinner(null); // Reset winner for the next game
      nav("/"); // Navigate back to the home page
    } catch (error) {
      console.error("Error saving game result:", error);
    }
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
      
      <br/>
      <br/>

      {/* Navbar with Centered Logo */}
      <nav className="navbar bg-base-100 justify-center">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-12" />
        </Link>
      </nav>

      <h1 className="text-2xl font-bold mb-3 mt-3">Play Game</h1>

          {/* Dice Roller Simulator */}
          <div className="card bg-base-100 shadow-xl card-bordered my-6 p-3 overflow-hidden">
            <div className="card-body">
              <h2 className="text-2xl font-bold text-center">Battle Roller</h2>

                {/* Attacker and Defender Labels */}
                <div className="dice-label-container">
                  <div className="dice-label-left">
                    <p className="label">Attacker</p>
                  </div>
                  <div className="dice-label-right">
                    <p className="label">Defender</p>
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
                      <label htmlFor="attacker" className="block text-sm font-medium mb-1">Select Attacker Faction:</label>
                      <select
                        id="attacker"
                        value={attacker}
                        onChange={(e) => setAttacker(e.target.value)}
                        className="select select-bordered w-fit"
                      >
                        <option value="">-- Select Faction --</option>
                        <option value="Marquise de Cat">Marquise de Cat</option>
                        <option value="Eyrie Dynasties">Eyrie Dynasties</option>
                        <option value="Woodland Alliance">Woodland Alliance</option>
                        <option value="Vagabond">Vagabond</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="defender" className="block text-sm font-medium mb-1">Select Defender Faction:</label>
                      <select
                        id="defender"
                        value={defender}
                        onChange={(e) => setDefender(e.target.value)}
                        className="select select-bordered w-fit"
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
          <h2 className="text-center text-2xl font-bold mb-4">Actions Taken</h2>

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
          <h2 className="text-center text-2xl font-bold mb-4">Total Victory Points</h2>

          {/* Marquise VP */}
          <div className="flex items-center justify-center space-x-4 mt-2">
            <h2 className="text-xl font-bold" style={{ color: 'orange' }}>Marquise de Cat</h2>
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
            <h2 className="text-xl font-bold" style={{ color: 'royalblue' }}>&nbsp;&nbsp;&nbsp;Eyrie Dynasty</h2>
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
            <h2 className="text-xl font-bold" style={{ color: '#4CAF50' }}>&nbsp;&nbsp;Woodland Alliance</h2>
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
            <h2 className="text-xl font-bold" style={{ color: 'gray' }}>&nbsp;Vagabond</h2>
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

{/* Game Over */}
<div className="card bg-base-100 shadow-xl card-bordered my-6 p-3 overflow-hidden">
  <div className="card-body">
    <h2 className="text-center text-3xl font-bold">Game Results</h2>
    <br/>

    <div className="flex flex-wrap justify-center gap-4">
      {selectedPlayers.map((player) => (
        <button
          key={player.name}
          className="btn border-2 text-lg font-bold"
          style={{
            backgroundColor: "white",
            color: factionColors[player.faction],
            borderColor: factionColors[player.faction],
          }}
          onClick={async () => {
            setWinner(player.name); // Set winner state
            await recordWin(player.name); // Record the win
            endGame(); // Trigger endGame logic
          }}
        >
          <span>{player.name} won</span>
          <span
            className="ml-2"
            style={{
              color: factionColors[player.faction],
              border: `2px solid ${factionColors[player.faction]}`,
              padding: "2px 5px",
              borderRadius: "5px",
            }}
          >
            {player.faction}
          </span>
        </button>
      ))}
    </div>
  </div>
        
        {/* If a winner is clicked, display who won below all players */}
        {winner && (
        <div className="text-center text-xl font-semibold mb-2">
          <p>{winner} is the winner of the game!</p>
        </div>
      )}
      </div>


      {/* Back to Home Button */}
      <button className="btn btn-info text-white mb-3 font-bold" onClick={() => nav("/")}>
        Back to Home
      </button>
    </div>
  );
};

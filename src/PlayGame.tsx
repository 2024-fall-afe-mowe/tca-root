import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const PlayGame = () => {

    const nav = useNavigate();

    // States to store the initial dice rolls and the final hits
    const [initialDice1, setInitialDice1] = useState(0);
    const [initialDice2, setInitialDice2] = useState(0);
    const [dice1, setDice1] = useState(0);
    const [dice2, setDice2] = useState(0);
    const [attacker, setAttacker] = useState('');
    const [defender, setDefender] = useState('');
    const [attackerHits, setAttackerHits] = useState<null | number>(null); // Store hits for attacker
    const [defenderHits, setDefenderHits] = useState<null | number>(null); // Store hits for defender

    // State for tracking victory points
    const [victoryPoints, setVictoryPoints] = useState(0);

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

      setDice1(newDice1);
      setDice2(newDice2);

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

  // Handlers to increment and decrement victory points
  const incrementPoints = () => setVictoryPoints(victoryPoints + 1);
  const decrementPoints = () => setVictoryPoints(victoryPoints > 0 ? victoryPoints - 1 : 0); // Prevent points from going negative

  return (
    <div className="App">
      <h1 className="text-2xl font-bold mb-3">Play Game</h1>

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
      <div className="dropdown-container">
        <div className="dropdown-left">
          <label htmlFor="attacker">Select Attacker Faction:</label>
          <select
            id="attacker"
            value={attacker}
            onChange={(e) => setAttacker(e.target.value)}
            className="faction-select"
          >
            <option value="">-- Select Faction --</option>
            <option value="Marquise de Cat">Marquise de Cat</option>
            <option value="Eyrie Dynasties">Eyrie Dynasties</option>
            <option value="Woodland Alliance">Woodland Alliance</option>
            <option value="Vagabond">Vagabond</option>
          </select>
        </div>

        <div className="dropdown-right">
          <label htmlFor="defender">Select Defender Faction:</label>
          <select
            id="defender"
            value={defender}
            onChange={(e) => setDefender(e.target.value)}
            className="faction-select"
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
      <div className="hits-display text-2xl mb-3">
        {attackerHits !== null && defenderHits !== null && (
          <>
            <p>
              <strong><span style={{ color: getFactionColor(attacker) }}>{attacker}</span></strong> gets <strong>{attackerHits}</strong> hits
            </p>
            <p>
              <strong><span style={{ color: getFactionColor(defender) }}>{defender}</span></strong> gets <strong>{defenderHits}</strong> hits
            </p>
          </>
        )}
      </div>


      {/* Roll Dice Button */}
      <button className="btn btn-primary mb-3 font-bold" onClick={rollDice}>
        Roll Dice
      </button>

      <br/>
      <br/>

      {/* Total Victory Points and Counter */}
      <div className="victory-points-container text-center mb-3">
        <h2 className="text-2xl font-bold">Total Victory Points:</h2>
        <div className="flex items-center justify-center space-x-4 mt-2">
          {/* Minus Button*/}
          <button
            className="btn btn-circle bg-red-500 text-white text-3xl"
            onClick={decrementPoints}
          >
            -
          </button>

          {/* Victory Points Display */}
          <span className="text-2xl font-bold">{victoryPoints}</span>

          {/* Plus Button*/}
          <button
            className="btn btn-circle bg-green-500 text-white text-3xl"
            onClick={incrementPoints}
          >
            +
          </button>
        </div>
      </div>

      <br/>

      {/* Back to Home Button */}
      <button className="btn btn-secondary mb-3 font-bold" onClick={() => nav("/")}>
        Back to Home
      </button>
    </div>
  );
};

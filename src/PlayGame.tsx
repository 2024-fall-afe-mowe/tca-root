import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const PlayGame = () => {

    const nav = useNavigate();

    // States to store the values of both dice
    const [dice1, setDice1] = useState(0);
    const [dice2, setDice2] = useState(0);
    const [attacker, setAttacker] = useState('');
    const [defender, setDefender] = useState('');
    const [attackerHits, setAttackerHits] = useState<null | number>(null); // Store hits for attacker
    const [defenderHits, setDefenderHits] = useState<null | number>(null); // Store hits for defender

    // Function to generate random numbers between 0 and 3 for each dice
    const rollDice = () => {
    let newDice1 = Math.floor(Math.random() * 4); // Random number between 0 and 3
    let newDice2 = Math.floor(Math.random() * 4); // Random number between 0 and 3

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

      {/* Dice Display */}
      <div className="dice-container">
        <div className="dice">
          <p className="dice-value">{dice1}</p>
        </div>
        <div className="dice">
          <p className="dice-value">{dice2}</p>
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
      <div className="hits-display">
        {attackerHits !== null && defenderHits !== null && (
          <>
          <p>
             {attacker} gets <strong>{attackerHits}</strong> hits
          </p>
          <p>
             {defender} gets <strong>{defenderHits}</strong> hits
          </p>
          </>
      )}
      </div>


      {/* Roll Dice Button */}
      <button className="btn btn-primary mb-3" onClick={rollDice}>
        Roll Dice
      </button>

      {/* Back to Home Button */}
      <button className="btn btn-secondary mb-3" onClick={() => nav("/")}>
        Back to Home
      </button>
    </div>
  );
};

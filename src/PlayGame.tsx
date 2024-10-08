import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const PlayGame = () => {

    const nav = useNavigate();

    // States to store the values of both dice
    const [dice1, setDice1] = useState(0);
    const [dice2, setDice2] = useState(0);
    const [attacker, setAttacker] = useState('');
    const [defender, setDefender] = useState('');

    // Function to generate random numbers between 0 and 3 for each dice
    const rollDice = () => {
      const newDice1 = Math.floor(Math.random() * 4); // Random number between 0 and 3
      const newDice2 = Math.floor(Math.random() * 4); // Random number between 0 and 3
      setDice1(newDice1);
      setDice2(newDice2);
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

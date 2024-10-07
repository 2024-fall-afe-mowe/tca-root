import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const PlayGame = () => {

    const nav = useNavigate();

    // States to store the values of both dice
    const [dice1, setDice1] = useState(0);
    const [dice2, setDice2] = useState(0);

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

        {/* Dice Display */}
        <div className="dice-container">
          <div className="dice">
            <p className="dice-value">{dice1}</p>
          </div>
          <div className="dice">
            <p className="dice-value">{dice2}</p>
          </div>
        </div>

        {/* Roll Dice Button */}
        <button className="btn btn-primary mb-3" onClick={rollDice}>
          Roll Dice
        </button>


        <button className = "btn btn-secondary mb-3"
        // Return to Home
        onClick={() => nav("/")}>Back to Home</button>
      </div>
    );
};

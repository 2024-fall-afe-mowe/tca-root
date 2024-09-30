import React from 'react';
import { Link } from 'react-router-dom';

const PlayGame: React.FC = () => {
  return (
    <div className="App">
      <h1 className="text-3xl font-bold">Play Game</h1>
      <br />
      <Link to="/" className="btn btn-secondary">
        Back to Home
      </Link>
    </div>
  );
};

export default PlayGame;

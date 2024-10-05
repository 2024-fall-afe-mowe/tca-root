import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const PlayGame = () => {

    const nav = useNavigate();

    return (
      <div>
        <h1 className="text-2xl font-bold mb-3">Play Game</h1>
        <button className = "btn btn-secondary mb-3"
        // Navigate back two pages
        onClick={() => nav("/")}>Back to Home</button>
      </div>
    );
};

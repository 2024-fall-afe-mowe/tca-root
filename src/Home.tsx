import React from 'react';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="App">
      <h1 className="text-3xl font-bold underline">ROOT</h1>
      <h2 className="text-2xl">a companion app by TSA Games</h2>
      <br />
      <Link to="/play" className="btn btn-secondary font-bold">
        Play Game
      </Link>
      <br />
      <br />

      {/* Leaderboard Section */}
      <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-left font-bold">Player</div>
            <div className="text-center font-bold">W</div>
            <div className="text-center font-bold">L</div>
            <div className="text-center font-bold">Pct</div>
          </div>

          {/* Player Row Example */}
          <div className="grid grid-cols-4 gap-4 mt-2 border-b border-gray-300 pb-2">
            <div className="text-left">Harry</div>
            <div className="text-center">10</div>
            <div className="text-center">5</div>
            <div className="text-center">.667</div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-2 border-b border-gray-300 pb-2">
            <div className="text-left">Hermione</div>
            <div className="text-center">8</div>
            <div className="text-center">7</div>
            <div className="text-center">.553</div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-2 border-b border-gray-300 pb-2">
            <div className="text-left">Ron</div>
            <div className="text-center">5</div>
            <div className="text-center">10</div>
            <div className="text-center">.333</div>
          </div>
        </div>
      </div>

      <br />
      <br />

      {/* Fun-Fact Stats Section */}
      <h1 className="text-3xl font-bold mb-4">Fun-Fact Stats</h1>
      <div className="stats stats-vertical lg:stats-horizontal shadow">
        <div className="stat">
          <div className="stat-title">Longest Game Played</div>
          <div className="stat-value">1hr 20mins</div>
          <div className="stat-desc">4-player game</div>
          <div className="stat-desc">Sept 28, 2024</div>
        </div>
        <div className="stat">
          <div className="stat-title">Shortest Game Played</div>
          <div className="stat-value">22 mins</div>
          <div className="stat-desc">2-Player game</div>
          <div className="stat-desc">Sept 29, 2024</div>
        </div>
        <div className="stat">
          <div className="stat-title">Most Winning Faction</div>
          <div className="stat-value">Marquise de Cat</div>
          <div className="stat-desc">15 victories</div>
        </div>
        <div className="stat">
          <div className="stat-title">Highest Points Achieved</div>
          <div className="stat-value">Woodland Alliance</div>
          <div className="stat-desc">34 VP</div>
        </div>
      </div>
    </div>
  );
};

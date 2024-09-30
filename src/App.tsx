import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PlayGame from './PlayGame'; // Make sure the path is correct
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home route */}
        <Route
          path="/"
          element={
            <div className="App">
              <h1 className="text-3xl font-bold underline">ROOT</h1>
              <h2 className="text-2xl">a companion app by TSA Games</h2>
              <br />
              <Link to="/play" className="btn btn-secondary">
                Play Game
              </Link>
              <br />
              <br />
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
                  <div className="stat-desc">34</div>
                </div>
              </div>
            </div>
          }
        />
        {/* Play Game route */}
        <Route path="/play" element={<PlayGame />} />
      </Routes>
    </Router>
  );
}

export default App;

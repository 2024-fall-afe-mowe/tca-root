import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Define the structure of a "player" object
interface Player {
  name: string;
  wins: number;
  losses: number;
  pct: string;
}

export const Home = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  // Fetch players from localStorage on component mount
  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem("players") || "[]");
    setPlayers(storedPlayers);
  }, []);

  return (
    <div className="App">
      <h1 className="text-3xl font-bold underline mt-3">ROOT</h1>
      <h2 className="text-2xl">a companion app by TSA Games</h2>
      <br />
      <Link to="/setup" className="btn btn-secondary font-bold">
        Go to Setup
      </Link>
      <br />
      <br />

      {/* Leaderboard Section */}
      <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {players.length === 0 ? (
            // Display this message if no players are added
            <p className="text-center">(Please add new players to view Leaderboard)</p>
          ) : (
            <>
              {/* Show the leaderboard table only if players exist */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-left font-bold">Player</div>
                <div className="text-center font-bold">W</div>
                <div className="text-center font-bold">L</div>
                <div className="text-center font-bold">Pct</div>
              </div>

              {players.map((player, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-4 mt-2 border-b border-gray-300 pb-2"
                >
                  <div className="text-left">{player.name}</div>
                  <div className="text-center">{player.wins}</div>
                  <div className="text-center">{player.losses}</div>
                  <div className="text-center">{player.pct}</div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="my-10"></div>

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

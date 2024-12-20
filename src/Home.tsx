import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "./logo.png";
import { LeaderboardEntry } from "./game-results";

export const AppTitle = "Root Companion App";

// Define the structure of a "player" object
export interface Player {
  name: string;
  wins: number;
  losses: number;
  pct: string;
};

interface GeneralFactsDisplay {
  totalGames: number;
  lastPlayed: string;
  shortestGame: string;
  longestGame: string;
  averageGame: string;
}

interface HomeProps {
  leaderboardData: LeaderboardEntry[];
  gameResults: {timestamp: string, winner: string, loser: string}[];
  generalFactsData: GeneralFactsDisplay;
  setTitle: (t: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  leaderboardData,
  generalFactsData,
  setTitle
}) => {

  useEffect(
    () => setTitle(AppTitle)
    , []
  );

  const [players, setPlayers] = useState<Player[]>([]);

  return (
    <div>
      <br/><br/>

      {/* Navbar with Centered Logo */}
      <nav className="navbar bg-base-100 justify-center">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-12" />
        </Link>
      </nav>

      <h2 className="text-2xl luminari-font">a companion app by TSA Games</h2>
      <br />
      
      <Link to="/setup" className="btn btn-secondary font-bold arial">
        Go to Setup
      </Link>
      <br />
      <br />

      {/* Leaderboard Section */}
      <h1 className="text-2xl font-bold luminari-font">Leaderboard</h1>
      <div className="card bg-base-100 shadow-xl baskerville">
        <div className="card-body">
          {leaderboardData.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              <div className="text-left font-bold">Player</div>
              <div className="text-center font-bold">W</div>
              <div className="text-center font-bold">L</div>
              <div className="text-center font-bold">Pct</div>
            </div>
          ) : (
            <p className="text-center">(Please add new players to view Leaderboard)</p>
          )}

          {leaderboardData.map((player, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 mt-2 border-b border-gray-300 pb-2">
              <div className="text-left">{player.name}</div>
              <div className="text-center">{player.wins}</div>
              <div className="text-center">{player.losses}</div>
              <div className="text-center">{player.avg}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="my-10"></div>
      
      {/* General Stats Section */}
      <h1 className="text-2xl font-bold luminari-font">Fun Fact Stats</h1>
      <div
                className="card bg-base-100 shadow-xl mb-3 baskerville"
            >
                <div
                    className="card-body p-3 overflow-x-hidden"
                >
                    <table
                        className="table"
                    >
                        <tbody>
                            <tr>
                                <td>
                                    Total Games
                                </td>
                                <th>
                                    {generalFactsData.totalGames}
                                </th>
                            </tr>
                            <tr>
                                <td>
                                    Last Played
                                </td>
                                <th>
                                    {generalFactsData.lastPlayed}
                                </th>
                            </tr>
                            <tr>
                                <td>
                                    Shortest Game
                                </td>
                                <th>
                                    {generalFactsData.shortestGame}
                                </th>
                            </tr>
                            <tr>
                                <td>
                                    Longest Game
                                </td>
                                <th>
                                    {generalFactsData.longestGame}
                                </th>
                            </tr>
                            <tr>
                                <td>
                                    Average Game
                                </td>
                                <th>
                                    {generalFactsData.averageGame}
                                </th>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            
      <div className="my-10"></div>


      {/* Fun-Fact Stats Section 
      <h1 className="text-2xl font-bold mb-4 luminari-font" >Fun-Fact Stats</h1>
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
      */}
    </div>
  );
};

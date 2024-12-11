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

  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="App min-h-screen"  data-theme={darkMode ? "dark" : "light"}>

      {/*Light/Dark mode swap*/}
      <div className="absolute top-0 right-0 m-4">
          <label className="swap swap-rotate">
          {/* this hidden checkbox controls the state */}
          <input type="checkbox" checked={darkMode} onChange={ () => setDarkMode(!darkMode)} className="theme-controller" value="synthwave"/>

          {/* sun icon */}
          <svg
          className="swap-on h-8 w-8 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24">
          <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>

          {/* moon icon */}
          <svg
          className="swap-off h-8 w-8 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24">
          <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
          </label>
      </div>

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

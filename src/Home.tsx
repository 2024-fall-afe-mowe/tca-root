import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadGamesFromCloud } from "./tca-cloud-api";
import logo from "./logo.png";
import axios from 'axios';

// Define the structure of a "player" object
interface Player {
  name: string;
  wins: number;
  losses: number;
  pct: string;
}

interface Game {
  duration: number;
  players: number;
  date: string;
}

interface Stats {
  shortestGame: Game | null;
  longestGame: Game | null;
  lastPlayed: string | null;
  totalGames: number;
  averageGameLength: string | null;
}

const fetchLeaderboard = async () => {
  try {
    const response = await axios.get(
      'https://32wop75hhc.execute-api.us-east-1.amazonaws.com/prod/data/leaderboard'
    );
    const data = response.data;

    // Ensure data is an array
    if (Array.isArray(data)) {
      return data;
    }

    console.error("Unexpected leaderboard response:", data);
    return []; // Return empty array if data is not an array
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
};

export const Home = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [stats, setStats] = useState<Stats>({
    shortestGame: null,
    longestGame: null,
    lastPlayed: null,
    totalGames: 0,
    averageGameLength: null,
  });

  useEffect(() => {
    const loadPlayers = async () => {
      const data = await fetchLeaderboard();

      // Ensure the data is an array before updating state
      if (Array.isArray(data)) {
        setPlayers(data);
      } else {
        console.error("Unexpected data format:", data);
        setPlayers([]); // Set to empty array if data isn't an array
      }
    };

    loadPlayers();
  }, []);

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(storedMode);
  }, []);
  
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);
  

  useEffect(() => {
    const fetchAndCalculateStats = async () => {
      const email = "pbrummel@gmail.com";
      const appName = "tca-root";

      try {
        const games = await loadGamesFromCloud(email, appName);
        if (games.length > 0) {
          calculateStats(games);
        } else {
          console.warn("No games found for the user.");
        }
      } catch (error) {
        console.error("Failed to load games from cloud:", error);
      }
    };

    fetchAndCalculateStats();
  }, []);

  const calculateStats = (games: Game[]) => {
    if (games.length === 0) return;

    let totalDuration = 0;
    let shortestGame: Game | null = null;
    let longestGame: Game | null = null;
    let lastPlayed: string | null = null;

    games.forEach((game) => {
      const { duration, players, date } = game;

      // Update shortest game
      if (!shortestGame || duration < shortestGame.duration) {
        shortestGame = { duration, players, date };
      }

      // Update longest game
      if (!longestGame || duration > longestGame.duration) {
        longestGame = { duration, players, date };
      }

      // Update last played date
      if (!lastPlayed || new Date(date) > new Date(lastPlayed)) {
        lastPlayed = date;
      }

      totalDuration += duration;
    });

    const averageGameLength = (totalDuration / games.length).toFixed(2);

    setStats({
      shortestGame,
      longestGame,
      lastPlayed,
      totalGames: games.length,
      averageGameLength,
    });
  };

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

      <br />
      <br />

      {/* Navbar */}
      <nav className="navbar bg-base-100 justify-center">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-12" />
        </Link>
      </nav>

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
            <p className="text-center">
              (Please add new players to view Leaderboard)
            </p>
          ) : (
            <>
              <div className="grid grid-cols-4 lg:grid-cols-4 sm:grid-cols-2 gap-4">
                <div className="text-left font-bold">Player</div>
                <div className="text-center font-bold">W</div>
                <div className="text-center font-bold">L</div>
                <div className="text-center font-bold">Pct</div>
              </div>
              {players.map((player, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 lg:grid-cols-4 sm:grid-cols-2 gap-4 mt-2 border-b border-gray-300 pb-2"
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
          <div className="stat-value">
            {stats.longestGame?.duration || "N/A"}
          </div>
          <div className="stat-desc">
            {stats.longestGame?.players} players
          </div>
          <div className="stat-desc">{stats.longestGame?.date}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Shortest Game Played</div>
          <div className="stat-value">
            {stats.shortestGame?.duration || "N/A"}
          </div>
          <div className="stat-desc">
            {stats.shortestGame?.players} players
          </div>
          <div className="stat-desc">{stats.shortestGame?.date}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Last Played</div>
          <div className="stat-value">{stats.lastPlayed || "N/A"}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Games</div>
          <div className="stat-value">{stats.totalGames}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Average Game Length</div>
          <div className="stat-value">
            {stats.averageGameLength || "N/A"} mins
          </div>
        </div>
      </div>
    </div>
  );
};
